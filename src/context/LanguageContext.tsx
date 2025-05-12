
import { createContext, useState, useContext, ReactNode, useEffect } from "react";

// Storage key for language preference
const LANGUAGE_STORAGE_KEY = "heritage-gateway-language";

// Available languages
export const languages = [
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

type LanguageContextType = {
  currentLanguage: Language;
  switchLanguage: (language: Language) => void;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Helper function to get language from localStorage or default to English
const getSavedLanguage = (): Language => {
  if (typeof window === 'undefined') return languages[0];

  const savedLanguageCode = localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (!savedLanguageCode) return languages[0];

  const savedLanguage = languages.find(lang => lang.code === savedLanguageCode);
  return savedLanguage || languages[0];
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(getSavedLanguage());

  const switchLanguage = (language: Language) => {
    setCurrentLanguage(language);
    document.documentElement.lang = language.code;

    // Save language preference to localStorage
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language.code);

    if (language.rtl) {
      document.documentElement.dir = "rtl";
      document.documentElement.classList.add("rtl");
    } else {
      document.documentElement.dir = "ltr";
      document.documentElement.classList.remove("rtl");
    }
  };

  // Apply the language settings on initial load
  useEffect(() => {
    document.documentElement.lang = currentLanguage.code;

    if (currentLanguage.rtl) {
      document.documentElement.dir = "rtl";
      document.documentElement.classList.add("rtl");
    } else {
      document.documentElement.dir = "ltr";
      document.documentElement.classList.remove("rtl");
    }
  }, []);

  return (
    <LanguageContext.Provider value={{ currentLanguage, switchLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
