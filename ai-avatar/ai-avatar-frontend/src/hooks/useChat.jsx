import { createContext, useContext, useEffect, useState } from "react";

const backendUrl = "http://localhost:3000";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState();
  const [loading, setLoading] = useState(false);
  const [cameraZoomed, setCameraZoomed] = useState(true);

  const chat = async (message) => {
    setLoading(true);
    try {
      const data = await fetch(`${backendUrl}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });
      if (!data.ok) {
        throw new Error(`Server returned ${data.status}`);
      }
      const json = await data.json();
      const resp = json?.messages;
      if (resp && Array.isArray(resp) && resp.length > 0) {
        setMessages((prev) => [...prev, ...resp]);
      }
    } catch (err) {
      console.error("useChat chat error:", err);
      // Fallback local response so avatar never hangs or stays frozen
      setMessages((prev) => [
        ...prev,
        {
          text: "I am right here with you. Please take a gentle, deep breath.",
          facialExpression: "smile",
          animation: "Talking_0",
          lipsync: {
            metadata: { duration: 2.5 },
            mouthCues: [
              { start: 0, end: 0.1, value: "X" },
              { start: 0.1, end: 0.6, value: "B" },
              { start: 0.6, end: 1.2, value: "E" },
              { start: 1.2, end: 1.8, value: "C" },
              { start: 1.8, end: 2.5, value: "X" },
            ],
          },
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const onMessagePlayed = () => {
    setMessages((messages) => messages.slice(1));
  };

  useEffect(() => {
    if (messages.length > 0) {
      setMessage(messages[0]);
    } else {
      setMessage(null);
    }
  }, [messages]);

  return (
    <ChatContext.Provider
      value={{
        chat,
        message,
        onMessagePlayed,
        loading,
        cameraZoomed,
        setCameraZoomed,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
