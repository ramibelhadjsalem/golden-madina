import { ChatbotProvider } from "@/context/ChatbotContext";
import ChatbotButton from "./ChatbotButton";
import ChatbotPanel from "./ChatbotPanel";

const Chatbot = () => {
  return (
    <ChatbotProvider>
      <ChatbotButton />
      <ChatbotPanel />
    </ChatbotProvider>
  );
};

export default Chatbot;
