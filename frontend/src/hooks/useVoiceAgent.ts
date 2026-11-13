'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { convertAudioBlobToWav } from '@/lib/audio-converter';

export interface UseVoiceAgentOptions {
  onTranscript?: (text: string, isFinal: boolean) => void;
  onCommand?: (intent: string, payload?: any) => void;
  onSpeechStart?: () => void;
  onSpeechEnd?: () => void;
  language?: string;
  autoStopMs?: number;
}

// Browser Web Speech synthesis fallback (zero API cost, 100% offline & safe)
export function speakWithBrowserVoice(
  textToSpeak: string,
  lang: string = 'en-IN',
  onComplete?: () => void,
  onStart?: () => void
) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window) || !textToSpeak || !textToSpeak.trim()) {
    onComplete?.();
    return;
  }

  try {
    // 1. Resume engine in case browser paused it
    window.speechSynthesis.resume();

    // 2. Clear old queue
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    // Pin utterance to window so Chromium garbage collection doesn't drop it mid-sentence
    (window as any).__safespark_utterance = utterance;

    const voices = window.speechSynthesis.getVoices();
    const normLang = (lang || 'en-IN').toLowerCase();
    const prefix = normLang.split('-')[0];

    let chosenVoice: SpeechSynthesisVoice | null = null;
    if (voices && voices.length > 0) {
      // 1. Match exact lang with natural/female preference
      chosenVoice =
        voices.find(
          (v) =>
            v.lang.toLowerCase() === normLang &&
            (v.name.toLowerCase().includes('female') ||
              v.name.toLowerCase().includes('natural') ||
              v.name.toLowerCase().includes('online') ||
              v.name.toLowerCase().includes('google') ||
              v.name.toLowerCase().includes('india') ||
              v.name.toLowerCase().includes('priya') ||
              v.name.toLowerCase().includes('heera'))
        ) || null;

      // 2. Match exact lang
      if (!chosenVoice) {
        chosenVoice = voices.find((v) => v.lang.toLowerCase() === normLang) || null;
      }

      // 3. Match prefix with natural/female preference
      if (!chosenVoice) {
        chosenVoice =
          voices.find(
            (v) =>
              v.lang.toLowerCase().startsWith(prefix) &&
              (v.name.toLowerCase().includes('female') ||
                v.name.toLowerCase().includes('zira') ||
                v.name.toLowerCase().includes('natural') ||
                v.name.toLowerCase().includes('google'))
          ) || null;
      }

      if (!chosenVoice) {
        chosenVoice = voices.find((v) => v.lang.toLowerCase().startsWith(prefix)) || null;
      }

      // 4. For English fallback
      if (!chosenVoice && prefix === 'en') {
        chosenVoice = voices.find((v) => v.lang.toLowerCase().startsWith('en')) || null;
      }

      // 5. Default voice only when language is English
      if (!chosenVoice && prefix === 'en') {
        chosenVoice = voices.find((v) => v.default) || voices[0] || null;
      }
    }

    if (chosenVoice) {
      utterance.voice = chosenVoice;
      utterance.lang = chosenVoice.lang;
    } else {
      utterance.lang = prefix === 'en' ? 'en-US' : normLang;
    }

    utterance.volume = 1.0;
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    let hasEnded = false;
    const handleEnd = () => {
      if (hasEnded) return;
      hasEnded = true;
      (window as any).__safespark_utterance = null;
      onComplete?.();
    };

    utterance.onstart = () => {
      onStart?.();
    };
    utterance.onend = handleEnd;
    utterance.onerror = (e) => {
      console.warn('SpeechSynthesis playback event notice:', e);
      handleEnd();
    };

    // Chrome keepalive: prevent long utterances from pausing
    const keepAlive = setInterval(() => {
      if (!window.speechSynthesis.speaking || hasEnded) {
        clearInterval(keepAlive);
      } else {
        window.speechSynthesis.resume();
      }
    }, 5000);

    // Wait 30ms after cancel() before speaking so browser audio queue cleanly unblocks
    setTimeout(() => {
      try {
        window.speechSynthesis.resume();
        window.speechSynthesis.speak(utterance);
      } catch (err) {
        console.warn('SpeechSynthesis speak notice:', err);
        handleEnd();
      }
    }, 40);
  } catch (e) {
    console.warn('SpeechSynthesis setup notice:', e);
    onComplete?.();
  }
}

export function useVoiceAgent(options: UseVoiceAgentOptions = {}) {
  const currentLocale = useLocale();
  const activeLanguage = options.language || currentLocale || 'en-IN';

  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const activeStreamRef = useRef<MediaStream | null>(null);
  const recognitionRef = useRef<any>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Pre-load browser voices on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
      const onVoices = () => window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = onVoices;
      return () => {
        if (window.speechSynthesis.onvoiceschanged === onVoices) {
          window.speechSynthesis.onvoiceschanged = null;
        }
      };
    }
  }, []);

  // Stop any active audio immediately (Barge-in support)
  const stopAudio = useCallback(() => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.src = '';
      currentAudioRef.current = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  }, []);

  // Complete cleanup of all media streams, audio, and recognition
  const cleanupVoice = useCallback(() => {
    stopAudio();

    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch (e) {}
      recognitionRef.current = null;
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch (e) {}
    }

    if (activeStreamRef.current) {
      activeStreamRef.current.getTracks().forEach((track) => track.stop());
      activeStreamRef.current = null;
    }

    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }

    setIsRecording(false);
    setIsTranscribing(false);
    audioChunksRef.current = [];
  }, [stopAudio]);

  // Clean up on component unmount and listen for global Quick Exit
  useEffect(() => {
    const handleQuickExit = () => cleanupVoice();
    window.addEventListener('beforeunload', handleQuickExit);
    window.addEventListener('safespark_quick_exit', handleQuickExit);

    return () => {
      cleanupVoice();
      window.removeEventListener('beforeunload', handleQuickExit);
      window.removeEventListener('safespark_quick_exit', handleQuickExit);
    };
  }, [cleanupVoice]);

  // Start listening (Dictation / Voice)
  const startListening = useCallback(async () => {
    // 1. Barge-in: immediately stop any playing voice
    stopAudio();
    setError(null);
    setTranscript('');
    audioChunksRef.current = [];

    // 2. Try browser Web Speech API for instant zero-latency feedback
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    let webSpeechActive = false;
    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = activeLanguage;

        recognition.onstart = () => {
          setIsRecording(true);
          options.onSpeechStart?.();
        };

        recognition.onresult = (event: any) => {
          let interim = '';
          let final = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              final += event.results[i][0].transcript;
            } else {
              interim += event.results[i][0].transcript;
            }
          }
          const currentText = final || interim;
          if (currentText) {
            setTranscript(currentText);
            // Only fire onTranscript for FINAL results to prevent repetition stacking
            if (final) {
              options.onTranscript?.(final, true);
            }
          }
        };

        recognition.onerror = (e: any) => {
          if (e.error === 'not-allowed') {
            setError('Microphone permission denied.');
          }
        };

        recognition.onend = () => {
          setIsRecording(false);
          options.onSpeechEnd?.();
        };

        recognition.start();
        recognitionRef.current = recognition;
        webSpeechActive = true;
      } catch (err) {
        console.warn('Web Speech fallback to MediaRecorder:', err);
      }
    }

    // 3. Setup MediaRecorder for backend Sarvam STT
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      activeStreamRef.current = stream;

      const mimeType = MediaRecorder.isTypeSupported('audio/webm')
        ? 'audio/webm'
        : MediaRecorder.isTypeSupported('audio/mp4')
        ? 'audio/mp4'
        : 'audio/wav';

      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        setIsRecording(false);
        if (audioChunksRef.current.length > 0) {
          const rawBlob = new Blob(audioChunksRef.current, { type: mimeType });
          if (rawBlob.size > 1000) {
            setIsTranscribing(true);
            try {
              const wavBlob = await convertAudioBlobToWav(rawBlob);
              const formData = new FormData();
              formData.append('file', wavBlob, 'speech.wav');
              formData.append('language', activeLanguage);

              const res = await fetch('/api/voice/transcribe', {
                method: 'POST',
                body: formData,
              });

              if (res.ok) {
                const data = await res.json();
                if (data.text) {
                  setTranscript(data.text);
                  options.onTranscript?.(data.text, true);
                }
              }
            } catch (backendErr) {
              console.warn('Backend STT notice:', backendErr);
            } finally {
              setIsTranscribing(false);
            }
          }
        }

        // Release mic stream
        stream.getTracks().forEach((track) => track.stop());
        activeStreamRef.current = null;
      };

      recorder.start(500);
      setIsRecording(true);
    } catch (micErr: any) {
      if (!webSpeechActive) {
        setError(micErr.name === 'NotAllowedError' ? 'Microphone permission denied.' : 'Unable to access microphone.');
        setIsRecording(false);
      }
    }
  }, [activeLanguage, options, stopAudio]);

  // Stop listening
  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      try {
        mediaRecorderRef.current.stop();
      } catch (e) {}
    }
    setIsRecording(false);
    options.onSpeechEnd?.();
  }, [options]);

  // Toggle listening
  const toggleListening = useCallback(() => {
    if (isRecording) {
      stopListening();
    } else {
      startListening();
    }
  }, [isRecording, startListening, stopListening]);

  // Speak text using audioUrl, backend TTS, or browser Web Speech
  const speak = useCallback(
    async (
      textToSpeak: string,
      customLang?: string,
      onComplete?: () => void,
      onStart?: () => void,
      audioUrl?: string
    ) => {
      stopAudio();
      if (!textToSpeak || !textToSpeak.trim()) {
        onComplete?.();
        return;
      }

      // Auto-detect exact language from text content (Kannada script -> kn-IN, Devanagari -> hi-IN, etc.)
      let lang = customLang || activeLanguage;
      if (/[\u0C80-\u0CFF]/.test(textToSpeak)) {
        lang = 'kn-IN';
      } else if (/[\u0900-\u097F]/.test(textToSpeak)) {
        lang = 'hi-IN';
      } else if (/[\u0B80-\u0BFF]/.test(textToSpeak)) {
        lang = 'ta-IN';
      } else if (/[\u0C00-\u0C7F]/.test(textToSpeak)) {
        lang = 'te-IN';
      } else if (/[\u0980-\u09FF]/.test(textToSpeak)) {
        lang = 'bn-IN';
      }

      setIsSpeaking(true);

      // If audioUrl is already provided, play directly!
      if (audioUrl) {
        try {
          const audio = new Audio(audioUrl);
          currentAudioRef.current = audio;

          audio.onplay = () => {
            setIsSpeaking(true);
            onStart?.();
          };

          audio.onended = () => {
            setIsSpeaking(false);
            currentAudioRef.current = null;
            onComplete?.();
          };

          audio.onerror = () => {
            speakWithBrowserVoice(
              textToSpeak,
              lang,
              () => {
                setIsSpeaking(false);
                onComplete?.();
              },
              onStart
            );
          };

          await audio.play();
          return;
        } catch (playErr) {
          console.warn('Audio playback notice, using browser voice fallback:', playErr);
        }
      }

      // Clean markdown tags for natural speech synthesis
      const cleanForSpeech = textToSpeak
        .replace(/###\s*[^\n]+/g, '')
        .replace(/\[Source:[^\]]+\]/gi, '')
        .replace(/https?:\/\/\S+/g, '')
        .replace(/\*\*([^*]+)\*\*/g, '$1')
        .replace(/[#*_~`>-]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      // Try backend Sarvam Bulbul v3 / Gnani TTS with 8s timeout
      try {
        const res = await fetch('/api/voice/speak', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: cleanForSpeech || textToSpeak, language: lang }),
          signal: AbortSignal.timeout(8000),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.supported && data.audio_base64) {
            const audioSrc = `data:audio/${data.format || 'wav'};base64,${data.audio_base64}`;
            const audio = new Audio(audioSrc);
            currentAudioRef.current = audio;

            audio.onplay = () => {
              setIsSpeaking(true);
              onStart?.();
            };

            audio.onended = () => {
              setIsSpeaking(false);
              currentAudioRef.current = null;
              onComplete?.();
            };

            audio.onerror = () => {
              speakWithBrowserVoice(
                cleanForSpeech || textToSpeak,
                lang,
                () => {
                  setIsSpeaking(false);
                  onComplete?.();
                },
                onStart
              );
            };

            await audio.play();
            return;
          }
        }
      } catch (err) {
        // Backend unavailable or timed out; proceed to browser synthesis
      }

      // Browser Web Speech fallback
      speakWithBrowserVoice(
        cleanForSpeech || textToSpeak,
        lang,
        () => {
          setIsSpeaking(false);
          onComplete?.();
        },
        () => {
          setIsSpeaking(true);
          onStart?.();
        }
      );
    },
    [activeLanguage, stopAudio]
  );

  return {
    isRecording,
    isTranscribing,
    isSpeaking,
    transcript,
    error,
    startListening,
    stopListening,
    toggleListening,
    speak,
    stopAudio,
    cleanupVoice,
  };
}
