import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useChatbot } from "@/context/ChatbotContext";
import { useTranslate } from "@/hooks/use-translate";

const ChatbotButton = () => {
  const { toggleChat } = useChatbot();
  const { t } = useTranslate();

  return (
    <Button
      onClick={toggleChat}
      className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-amber-600 hover:bg-amber-700 shadow-lg z-50 flex items-center justify-center"
      aria-label={t('chatbot')}
    >
      <MessageSquare className="h-6 w-6 text-white" />
    </Button>
  );
};

export default ChatbotButton;
