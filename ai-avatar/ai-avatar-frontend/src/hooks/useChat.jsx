import { createContext, useContext, useEffect, useState } from "react";

const backendUrl = "";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState();
  const [loading, setLoading] = useState(false);
  const [cameraZoomed, setCameraZoomed] = useState(true);

  // Extract locale from query string or default to en-IN
  const getLocale = () => {
    if (typeof window === "undefined") return "en-IN";
    const params = new URLSearchParams(window.location.search);
    return params.get("locale") || "en-IN";
  };

  // Support postMessage communication with parent Next.js frame
  useEffect(() => {
    const handleWindowMessage = (event) => {
      if (!event.data) return;
      if (event.data.type === "SAFE_SPARK_SPEAK") {
        const { text, audio, animation, facialExpression, lipsync, fromParent } = event.data;
        setMessages((prev) => [
          ...prev,
          {
            text: text || "",
            audio: audio,
            animation: animation || "Talking_0",
            facialExpression: facialExpression || "smile",
            lipsync: lipsync,
            fromParent: fromParent !== undefined ? fromParent : (typeof window !== 'undefined' && window.self !== window.top),
          },
        ]);
      } else if (event.data.type === "SAFE_SPARK_STOP") {
        setMessages([]);
        setMessage(null);
      }
    };
    window.addEventListener("message", handleWindowMessage);
    return () => window.removeEventListener("message", handleWindowMessage);
  }, []);

  const chat = async (message) => {
    setLoading(true);
    try {
      const endpoints = [
        "/chat",
        "http://localhost:3000/chat",
      ];
      let resp = null;
      for (const endpoint of endpoints) {
        try {
          const data = await fetch(endpoint, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ message, language: getLocale() }),
          });
          if (data.ok) {
            const json = await data.json();
            if (json?.messages && Array.isArray(json.messages) && json.messages.length > 0) {
              resp = json.messages;
              break;
            }
          }
        } catch (e) {
          // try next endpoint
        }
      }

      if (resp && resp.length > 0) {
        setMessages((prev) => [...prev, ...resp]);
      } else {
        throw new Error("No response from /chat endpoints");
      }
    } catch (err) {
      console.warn("useChat chat note (using local therapeutic response):", err);
      // Contextual therapeutic fallback matching user question
      const q = (message || "").toLowerCase();
      let fallbackText = "I am right here with you. Please take a gentle, deep breath, and remember that you are in a safe, confidential space.";
      let anim = "Talking_0";
      let expr = "smile";

      if (q.includes("anxious") || q.includes("anxiety") || q.includes("fear") || q.includes("panic")) {
        fallbackText = "I hear how intense the anxiety feels right now. Place one hand gently over your chest, feel the ground under you, and remember this feeling will pass.";
        anim = "Talking_1";
      } else if (q.includes("breath") || q.includes("breathe") || q.includes("calm")) {
        fallbackText = "Let us breathe together. Inhale deeply through your nose for 4 counts, hold gently for 4, and slowly release through your mouth for 6 counts.";
        anim = "Talking_1";
      } else if (q.includes("sad") || q.includes("cry") || q.includes("alone") || q.includes("lonely")) {
        fallbackText = "I hear the deep sadness in your words. Your feelings are completely valid, and you do not have to carry this alone. I am here with you.";
        anim = "Talking_2";
        expr = "sad";
      } else if (q.includes("danger") || q.includes("help") || q.includes("emergency") || q.includes("police")) {
        fallbackText = "Your safety is the highest priority. If you are in immediate danger, please reach out to emergency services at 112 or Women Helpline 1091 right away.";
        anim = "Talking_0";
        expr = "surprised";
      }

      setMessages((prev) => [
        ...prev,
        {
          text: fallbackText,
          facialExpression: expr,
          animation: anim,
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
