
import { useLanguage } from "@/context/LanguageContext";

// This is a simplified translation function
// In a real app, you would use i18next or similar
const translations = {
  en: {
    welcome: "Welcome to our Museum",
    explore: "Explore our collection",
    learnMore: "Learn more",
    about: "About",
    contact: "Contact",
    blog: "Blog",
    artifacts: "Artifacts",
    services: "Services",
  },
  fr: {
    welcome: "Bienvenue à notre musée",
    explore: "Explorez notre collection",
    learnMore: "En savoir plus",
    about: "À propos",
    contact: "Contact",
    blog: "Blog",
    artifacts: "Artefacts",
    services: "Services",
  },
  ar: {
    welcome: "مرحبا بكم في متحفنا",
    explore: "استكشف مجموعتنا",
    learnMore: "اقرأ المزيد",
    about: "حول",
    contact: "اتصال",
    blog: "مدونة",
    artifacts: "القطع الأثرية",
    services: "خدمات",
  }
};

export const useTranslate = () => {
  const { currentLanguage } = useLanguage();
  
  const t = (key: keyof typeof translations.en, fallback?: string) => {
    const langCode = currentLanguage.code as keyof typeof translations;
    if (translations[langCode] && translations[langCode][key]) {
      return translations[langCode][key];
    }
    return fallback || key;
  };
  
  return { t };
};
