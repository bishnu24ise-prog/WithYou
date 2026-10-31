import { useRef, useState, useEffect } from 'react';
import { useChat } from '../hooks/useChat';

export const UI = ({ hidden, ...props }) => {
  const input = useRef();
  const { chat, loading, cameraZoomed, setCameraZoomed, message } = useChat();
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

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
          <h1 className="font-black text-xl">My Therapy Assistant</h1>
          <p>I will heal you ❤️</p>
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
              onClick={() => sendMessage("I am feeling anxious and need support.")}
              className="text-xs bg-white/70 hover:bg-white text-slate-800 font-medium px-3 py-1 rounded-full shadow-sm backdrop-blur-sm transition disabled:opacity-50"
            >
              🌱 I feel anxious
            </button>
            <button
              disabled={loading || message}
              onClick={() => sendMessage("Can you guide me through a calming breathing exercise?")}
              className="text-xs bg-white/70 hover:bg-white text-slate-800 font-medium px-3 py-1 rounded-full shadow-sm backdrop-blur-sm transition disabled:opacity-50"
            >
              🌬️ Calming breath
            </button>
            <button
              disabled={loading || message}
              onClick={() => sendMessage("I need someone compassionate to talk to.")}
              className="text-xs bg-white/70 hover:bg-white text-slate-800 font-medium px-3 py-1 rounded-full shadow-sm backdrop-blur-sm transition disabled:opacity-50"
            >
              🤍 Need support
            </button>
          </div>

          {/* Typing & Microphone Bar matching video */}
          <div className="flex items-center gap-2 w-full">
            <input
              className="w-full placeholder:text-gray-800 placeholder:italic p-4 rounded-md bg-opacity-50 bg-white backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-[#fda625] text-slate-900"
              placeholder={isListening ? "Listening to your voice..." : "Type a message..."}
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
