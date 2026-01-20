import { createContext, useState, useEffect } from "react";
import translationsData from "../i18n/translations.json";

interface TranslationsContextType {
  translations: typeof translationsData;
  lang: string;
  setLang: (lang: string) => void;
}

export const TranslationsContext = createContext<TranslationsContextType | null>(null);

function getInitialLanguage(): string {
  // Try to get language from localStorage first
  const savedLang = localStorage.getItem("language");
  if (savedLang && ['de', 'en', 'fr', 'it'].includes(savedLang)) {
    return savedLang;
  }
  
  // Try to get from URL
  const pathSegments = window.location.pathname.split('/').filter(Boolean);
  if (pathSegments.length > 0 && ['de', 'en', 'fr', 'it'].includes(pathSegments[0])) {
    return pathSegments[0];
  }
  
  // Default to German
  return "de";
}

export function TranslationsProvider({ children }: { children: React.ReactNode }) {
  const [translations] = useState(translationsData);
  const [lang, setLang] = useState(getInitialLanguage());

  // Save language to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("language", lang);
  }, [lang]);

  return (
    <TranslationsContext.Provider
      value={{ translations, lang, setLang }}
    >
      {children}
    </TranslationsContext.Provider>
  );
}
