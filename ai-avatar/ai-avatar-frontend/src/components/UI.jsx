import { useRef, useState, useEffect } from 'react';
import { useChat } from '../hooks/useChat';


const UI_STRINGS = {
  'hi-IN': {
    title: 'मेरी थेरेपी सहायक',
    subtitle: 'मैं आपके साथ हूँ ❤️',
    q1Prompt: 'मुझे बेचैनी महसूस हो रही है और सहारे की ज़रूरत है।',
    q1Label: '🌱 मुझे बेचैनी है',
    q2Prompt: 'क्या आप मुझे एक शांत सांस लेने का व्यायाम सिखा सकती हैं?',
    q2Label: '🌬️ शांत सांस',
    q3Prompt: 'मुझे बात करने के लिए एक दयालु साथी चाहिए।',
    q3Label: '🤍 सहायता चाहिए',
    placeholder: 'संदेश लिखें...',
    listening: 'आपकी आवाज़ सुन रहे हैं...',
  },
  'bn-IN': {
    title: 'আমার থেরাপি সহকারী',
    subtitle: 'আমি আপনার পাশে আছি ❤️',
    q1Prompt: 'আমি উদ্বিগ্ন বোধ করছি এবং সমর্থন দরকার।',
    q1Label: '🌱 উদ্বেগ হচ্ছে',
    q2Prompt: 'আপনি কি আমাকে একটি শান্ত শ্বাস প্রশ্বাসের ব্যায়াম শেখাতে পারেন?',
    q2Label: '🌬️ শান্ত শ্বাস',
    q3Prompt: 'আমার কথা বলার জন্য একজন সহানুভূতিশীল সঙ্গী দরকার।',
    q3Label: '🤍 সহমর্মিতা চাই',
    placeholder: 'বার্তা লিখুন...',
    listening: 'আপনার কথা শুনছি...',
  },
  'ta-IN': {
    title: 'எனது சிகிச்சை உதவியாளர்',
    subtitle: 'நான் உங்களுடன் இருக்கிறேன் ❤️',
    q1Prompt: 'நான் பதட்டமாக உணர்கிறேன் மற்றும் ஆதரவு தேவை.',
    q1Label: '🌱 பதட்டமாக உள்ளது',
    q2Prompt: 'என்னை ஒரு அமைதியான மூச்சுப் பயிற்சிக்கு வழிநடத்த முடியுமா?',
    q2Label: '🌬️ அமைதியான மூச்சு',
    q3Prompt: 'பேசுவதற்கு இரக்கமுள்ள ஒருவர் தேவை.',
    q3Label: '🤍 உதவி தேவை',
    placeholder: 'செய்தியை உள்ளிடவும்...',
    listening: 'கேட்கிறது...',
  },
  'te-IN': {
    title: 'నా థెరపీ సహాయకురాలు',
    subtitle: 'నేను మీతో ఉన్నాను ❤️',
    q1Prompt: 'నాకు ఆందోళనగా ఉంది మరియు మద్దతు కావాలి.',
    q1Label: '🌱 ఆందోళనగా ఉంది',
    q2Prompt: 'మీరు నన్ను ప్రశాంతమైన శ్వాస వ్యాయామంలో మార్గనిర్దేశం చేయగలరా?',
    q2Label: '🌬️ ప్రశాంత శ్వాస',
    q3Prompt: 'మాట్లాడటానికి దయగల వ్యక్తి కావాలి.',
    q3Label: '🤍 మద్దతు కావాలి',
    placeholder: 'సందేశం టైప్ చేయండి...',
    listening: 'వినబడుతోంది...',
  },
  'mr-IN': {
    title: 'माझी थेरपी सहाय्यक',
    subtitle: 'मी तुमच्या सोबत आहे ❤️',
    q1Prompt: 'मला अस्वस्थ वाटत आहे आणि आधाराची गरज आहे.',
    q1Label: '🌱 अस्वस्थ वाटत आहे',
    q2Prompt: 'तुम्ही मला शांत श्वास घेण्याचा व्यायाम शिकवू शकता का?',
    q2Label: '🌬️ शांत श्वास',
    q3Prompt: 'मला बोलण्यासाठी एका दयाळू सोबत्याची गरज आहे.',
    q3Label: '🤍 आधार हवा आहे',
    placeholder: 'संदेश टाईप करा...',
    listening: 'ऐकत आहे...',
  },
  'en-IN': {
    title: 'My Therapy Assistant',
    subtitle: 'I am here with you ❤️',
    q1Prompt: 'I am feeling anxious and need support.',
    q1Label: '{strings.q1Label}',
    q2Prompt: 'Can you guide me through a calming breathing exercise?',
    q2Label: '{strings.q2Label}',
    q3Prompt: 'I need someone compassionate to talk to.',
    q3Label: '{strings.q3Label}',
    placeholder: 'Type a message...',
    listening: 'Listening to your voice...',
  }
};

export const UI = ({ hidden, ...props }) => {
  const input = useRef();
  const { chat, loading, cameraZoomed, setCameraZoomed, message } = useChat();
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  const getLocale = () => {
    if (typeof window === 'undefined') return 'en-IN';
    const params = new URLSearchParams(window.location.search);
    return params.get('locale') || 'en-IN';
  };
  const activeLocale = getLocale();
  const strings = UI_STRINGS[activeLocale] || UI_STRINGS['en-IN'];

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = activeLocale;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0].transcript)
          .join('');
        if (input.current) {
          input.current.value = transcript;
        }
      };

      recognition.onerror = (event) => {
        console.warn('Speech recognition notice:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
        if (input.current && input.current.value.trim() && !loading && !message) {
          const spokenText = input.current.value.trim();
          chat(spokenText);
          input.current.value = '';
        }
      };

      recognitionRef.current = recognition;
    }
  }, [loading, message, chat]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is supported in Google Chrome or Edge. You can also type your message in the box.');
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      if (input.current) input.current.value = '';
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.warn('Recognition start notice:', err);
      }
    }
  };

  const sendMessage = (customText) => {
    const text = customText || (input.current ? input.current.value : '');
    if (!text || !text.trim()) return;
    if (!loading && !message) {
      chat(text);
      if (input.current) input.current.value = '';
    }
  };

  if (hidden) {
    return null;
  }

  return (
    <>
      <div className="fixed top-0 left-0 right-0 bottom-0 z-10 flex justify-between p-4 flex-col pointer-events-none">
        {/* Top-Left Card matching video demo */}
        <div className="self-start backdrop-blur-md bg-white bg-opacity-50 p-4 rounded-lg pointer-events-auto shadow-sm">
          <h1 className="font-black text-xl">{strings.title}</h1>
          <p>{strings.subtitle}</p>
        </div>

        {/* Action Controls on Right */}
        <div className="w-full flex flex-col items-end justify-center gap-4">
          <button
            onClick={() => setCameraZoomed(!cameraZoomed)}
            title={cameraZoomed ? "Zoom out" : "Zoom in"}
            className="pointer-events-auto bg-[#ffcc7e] hover:bg-[#fda625] transition-colors text-black p-4 rounded-md shadow-md"
          >
            {cameraZoomed ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM13.5 10.5h-6"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6"
                />
              </svg>
            )}
          </button>
          <button
            onClick={() => {
              const body = document.querySelector('body');
              if (body.classList.contains('greenScreen')) {
                body.classList.remove('greenScreen');
              } else {
                body.classList.add('greenScreen');
              }
            }}
            title="Toggle Backdrop"
            className="pointer-events-auto bg-[#ffcc7e] hover:bg-[#fda625] transition-colors text-black p-4 rounded-md shadow-md"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z"
              />
            </svg>
          </button>
        </div>

        {/* Bottom Input Area */}
        <div className="flex flex-col gap-2 pointer-events-auto max-w-screen-sm w-full mx-auto">
          {/* Quick Prompts */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-1">
            <button
              disabled={loading || message}
              onClick={() => sendMessage(strings.q1Prompt)}
              className="text-xs bg-white/70 hover:bg-white text-slate-800 font-medium px-3 py-1 rounded-full shadow-sm backdrop-blur-sm transition disabled:opacity-50"
            >
              {strings.q1Label}
            </button>
            <button
              disabled={loading || message}
              onClick={() => sendMessage(strings.q2Prompt)}
              className="text-xs bg-white/70 hover:bg-white text-slate-800 font-medium px-3 py-1 rounded-full shadow-sm backdrop-blur-sm transition disabled:opacity-50"
            >
              {strings.q2Label}
            </button>
            <button
              disabled={loading || message}
              onClick={() => sendMessage(strings.q3Prompt)}
              className="text-xs bg-white/70 hover:bg-white text-slate-800 font-medium px-3 py-1 rounded-full shadow-sm backdrop-blur-sm transition disabled:opacity-50"
            >
              {strings.q3Label}
            </button>
          </div>

          {/* Typing & Microphone Bar matching video */}
          <div className="flex items-center gap-2 w-full">
            <input
              className="w-full placeholder:text-gray-800 placeholder:italic p-4 rounded-md bg-opacity-50 bg-white backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-[#fda625] text-slate-900"
              placeholder={isListening ? strings.listening : strings.placeholder}
              ref={input}
              disabled={loading || message}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  sendMessage();
                }
              }}
            />

            {/* Microphone Button (Speech to Text) */}
            <button
              type="button"
              disabled={loading || message}
              onClick={toggleListening}
              title={isListening ? "Listening... Click to stop" : "Speak to Maya (Voice Assistant)"}
              className={`p-4 rounded-md transition-colors flex items-center justify-center ${
                isListening
                  ? 'bg-red-500 text-white animate-pulse'
                  : 'bg-[#ffcc7e] hover:bg-[#fda625] text-black'
              } ${loading || message ? 'cursor-not-allowed opacity-30' : ''}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.8}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15a3 3 0 003-3V6a3 3 0 00-3-3 3 3 0 00-3 3v6a3 3 0 003 3z"
                />
              </svg>
            </button>

            {/* Send Button */}
            <button
              disabled={loading || message}
              onClick={() => sendMessage()}
              className={`bg-[#ffcc7e] hover:bg-[#fda625] text-black p-4 px-10 font-semibold uppercase rounded-md transition-colors ${
                loading || message ? 'cursor-not-allowed opacity-30' : ''
              }`}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
