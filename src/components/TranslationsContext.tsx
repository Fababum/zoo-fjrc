import { createContext, useState } from "react";
import translationsData from "../i18n/translations.json";

export const TranslationsContext = createContext(null);

export function TranslationsProvider({ children }) {
  const [translations] = useState(translationsData);
  const [lang, setLang] = useState("it"); // 👈 GLOBAL

  return (
    <TranslationsContext.Provider
      value={{ translations, lang, setLang }}
    >
      {children}
    </TranslationsContext.Provider>
  );
}