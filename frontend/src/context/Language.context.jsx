import React, { createContext, useContext, useState } from "react";
import { translations } from "../i18n/translations";

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState("en"); // default English
  

  const t = (key) => translations[lang]?.[key] || key;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};