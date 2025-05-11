
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";

// Available languages
const languages = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "ar", name: "العربية", flag: "🇸🇦", rtl: true }
];

export type Language = {
  code: string;
  name: string;
  flag: string;
  rtl?: boolean;
};

interface LanguageSelectorProps {
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm";
  className?: string;
}

const LanguageSelector = ({ 
  variant = "outline", 
  size = "default",
  className = ""
}: LanguageSelectorProps) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(languages[0]);

  const switchLanguage = (language: Language) => {
    setCurrentLanguage(language);
    document.documentElement.lang = language.code;
    
    if (language.rtl) {
      document.documentElement.dir = "rtl";
      document.documentElement.classList.add("rtl");
    } else {
      document.documentElement.dir = "ltr";
      document.documentElement.classList.remove("rtl");
    }

    // In a real app, we would use i18n libraries like i18next
    // For now, we'll just show a toast
    toast({
      title: `Language changed to ${language.name}`,
      description: "In a real app, all text would be translated",
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} className={className}>
          {currentLanguage.flag} <span className="ml-2 hidden md:inline-block">{currentLanguage.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => switchLanguage(language)}
            className="cursor-pointer"
          >
            <span className="mr-2">{language.flag}</span>
            {language.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
