import { useLanguage } from "@/context/LanguageContext";
import { en } from "./translations/en";
import { fr } from "./translations/fr";
import { ar } from "./translations/ar";

// Combine translations into a single object
const translations = {
  en,
  fr,
  ar,
};

export const useTranslate = () => {
  const { currentLanguage } = useLanguage();

  const t = (key: string, fallback?: string) => {
    const langCode = currentLanguage.code as keyof typeof translations;
    if (translations[langCode] && translations[langCode][key as keyof typeof translations.en]) {
      return translations[langCode][key as keyof typeof translations.en];
    }
    return fallback || key;
  };

  return { t };
};