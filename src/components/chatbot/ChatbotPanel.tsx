import { useState, useRef, useEffect } from "react";
import { useChatbot } from "@/context/ChatbotContext";
import { useTranslate } from "@/hooks/use-translate";
import { useLanguage } from "@/context/LanguageContext";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { APP_NAME } from "@/lib/config";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

// Import chatscope components
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator
} from "@chatscope/chat-ui-kit-react";

// Import chatscope styles
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";

const ChatbotPanel = () => {
  const { isOpen, closeChat, messages, sendMessage } = useChatbot();
  const { t } = useTranslate();
  const { currentLanguage } = useLanguage();
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Handle sending a message
  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      sendMessage(inputMessage);
      setInputMessage("");
      setIsTyping(true);
      
      // Simulate typing indicator
      setTimeout(() => {
        setIsTyping(false);
      }, 1000);
    }
  };

  // Handle key press (Enter to send)
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={closeChat}>
      <SheetContent 
        side="right" 
        className={cn(
          "w-[350px] sm:w-[400px] p-0 flex flex-col",
          currentLanguage.rtl ? "rtl" : "ltr"
        )}
      >
        <SheetHeader className="px-4 py-3 border-b">
          <SheetTitle className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-amber-600 flex items-center justify-center">
              <span className="text-white text-sm">GM</span>
            </div>
            <span>{APP_NAME} {t('chatbot')}</span>
          </SheetTitle>
        </SheetHeader>
        
        <div className="flex-1 flex flex-col h-[calc(100vh-120px)]">
          <MainContainer className="h-full border-none">
            <ChatContainer className="h-full">
              <MessageList
                typingIndicator={
                  isTyping ? <TypingIndicator content={t('chatbotTyping')} /> : null
                }
              >
                {messages.map((msg) => (
                  <Message
                    key={msg.id}
                    model={{
                      message: msg.message,
                      sentTime: msg.sentTime,
                      direction: msg.direction === "incoming" ? "incoming" : "outgoing",
                      position: "single"
                    }}
                  />
                ))}
              </MessageList>
              <MessageInput
                placeholder={t('chatbotPlaceholder')}
                value={inputMessage}
                onChange={(val) => setInputMessage(val)}
                onSend={handleSendMessage}
                attachButton={false}
              />
            </ChatContainer>
          </MainContainer>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ChatbotPanel;
