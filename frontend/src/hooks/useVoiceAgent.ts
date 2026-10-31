'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useLocale } from 'next-intl';

export interface UseVoiceAgentOptions {
  onTranscript?: (text: string, isFinal: boolean) => void;
  onCommand?: (intent: string, payload?: any) => void;
  onSpeechStart?: () => void;
  onSpeechEnd?: () => void;
  language?: string;
  autoStopMs?: number;
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
            options.onTranscript?.(currentText, !!final);
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

    // 3. Setup MediaRecorder for backend Sarvam STT (especially for Indian languages & iOS)
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
        // Only call backend STT if webSpeech did not already return a transcript
        if (audioChunksRef.current.length > 0) {
          const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
          if (audioBlob.size > 2000) {
            setIsTranscribing(true);
            try {
              const formData = new FormData();
              formData.append('file', audioBlob, `speech.${mimeType.includes('mp4') ? 'mp4' : 'webm'}`);
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

      recorder.start(500); // 500ms slice
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

  // Speak text using Sarvam Bulbul v3 or ElevenLabs / Web Speech
  const speak = useCallback(
    async (textToSpeak: string, customLang?: string, onComplete?: () => void) => {
      stopAudio();
      if (!textToSpeak || !textToSpeak.trim()) return;

      const lang = customLang || activeLanguage;
      setIsSpeaking(true);

      try {
        // Request backend TTS
        const res = await fetch('/api/voice/speak', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: textToSpeak, language: lang }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.supported && data.audio_base64) {
            const audioSrc = `data:audio/${data.format || 'mp3'};base64,${data.audio_base64}`;
            const audio = new Audio(audioSrc);
            currentAudioRef.current = audio;

            audio.onended = () => {
              setIsSpeaking(false);
              onComplete?.();
            };

            audio.onerror = () => {
              setIsSpeaking(false);
              onComplete?.();
            };

            await audio.play();
            return;
          }
        }
      } catch (err) {
        console.warn('Backend TTS notice:', err);
      }

      // Browser Web Speech fallback
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        try {
          const utterance = new SpeechSynthesisUtterance(textToSpeak);
          utterance.lang = lang;
          utterance.rate = 0.95;

          utterance.onend = () => {
            setIsSpeaking(false);
            onComplete?.();
          };

          utterance.onerror = () => {
            setIsSpeaking(false);
            onComplete?.();
          };

          window.speechSynthesis.speak(utterance);
          return;
        } catch (synthErr) {
          console.warn('SpeechSynthesis fallback notice:', synthErr);
        }
      }

      setIsSpeaking(false);
      onComplete?.();
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

