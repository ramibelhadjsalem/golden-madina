import { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useTranslate } from "@/hooks/use-translate";
import { useGetChatbotResponse } from "@/hooks/use-chatbot-responses";
import { v4 as uuidv4 } from 'uuid';

// Define message types
export type MessageDirection = "incoming" | "outgoing";

export interface ChatMessage {
  id: string;
  message: string;
  sentTime: string;
  direction: MessageDirection;
  position?: "single" | "first" | "normal" | "last";
}

// Define the context type
type ChatbotContextType = {
  messages: ChatMessage[];
  isOpen: boolean;
  openChat: () => void;
  closeChat: () => void;
  toggleChat: () => void;
  sendMessage: (text: string) => void;
  clearMessages: () => void;
};

// Create the context
const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined);

// Create the provider component
export const ChatbotProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const { currentLanguage } = useLanguage();
  const { t } = useTranslate();
  const { getResponse, loading: responsesLoading } = useGetChatbotResponse();

  // Add welcome message when the chat is first opened or language changes
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: uuidv4(),
        message: t('chatbotWelcome'),
        sentTime: new Date().toLocaleTimeString(),
        direction: "incoming",
      };
      setMessages([welcomeMessage]);
    }
  }, [currentLanguage.code, messages.length, t]);

  // Function to open the chat
  const openChat = () => {
    setIsOpen(true);
  };

  // Function to close the chat
  const closeChat = () => {
    setIsOpen(false);
  };

  // Function to toggle the chat
  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  // Function to send a message
  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: uuidv4(),
      message: text,
      sentTime: new Date().toLocaleTimeString(),
      direction: "outgoing",
    };

    setMessages((prev) => [...prev, userMessage]);

    // Simulate typing indicator
    const typingIndicatorTimeout = setTimeout(() => {
      // Get response from Supabase
      const response = getResponse(text);

      // If no response from Supabase, use default
      const botResponse = response || t('chatbotDefault');

      const botMessage: ChatMessage = {
        id: uuidv4(),
        message: botResponse,
        sentTime: new Date().toLocaleTimeString(),
        direction: "incoming",
      };

      setMessages((prev) => [...prev, botMessage]);
    }, 1000);

    return () => clearTimeout(typingIndicatorTimeout);
  };

  // Function to clear all messages
  const clearMessages = () => {
    setMessages([]);
  };

  return (
    <ChatbotContext.Provider
      value={{
        messages,
        isOpen,
        openChat,
        closeChat,
        toggleChat,
        sendMessage,
        clearMessages,
      }}
    >
      {children}
    </ChatbotContext.Provider>
  );
};

// Custom hook to use the chatbot context
export const useChatbot = () => {
  const context = useContext(ChatbotContext);
  if (context === undefined) {
    throw new Error("useChatbot must be used within a ChatbotProvider");
  }
  return context;
};
