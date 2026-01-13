import { createContext, useState } from "react";
import translationsData from "../i18n/translations.json";

interface TranslationsContextType {
  translations: typeof translationsData;
  lang: string;
  setLang: (lang: string) => void;
}

export const TranslationsContext = createContext<TranslationsContextType | null>(null);

export function TranslationsProvider({ children }: { children: React.ReactNode }) {
  const [translations] = useState(translationsData);
  const [lang, setLang] = useState("it");

  return (
    <TranslationsContext.Provider
      value={{ translations, lang, setLang }}
    >
      {children}
    </TranslationsContext.Provider>
  );
}
