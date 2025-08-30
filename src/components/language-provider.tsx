"use client";

import * as React from "react";

export type LanguageCode =
  | "en" | "as" | "bn" | "brx" | "doi" | "gu" | "hi" | "kn" | "ks" | "kok" | "mai" | "ml" | "mni" | "mr" | "ne" | "or" | "pa" | "sa" | "sat" | "sd" | "ta" | "te" | "ur";

export type Language = { code: LanguageCode; name: string };

export const LANGUAGES: Language[] = [
  { code: "en", name: "English" },
  { code: "as", name: "Assamese" },
  { code: "bn", name: "Bengali" },
  { code: "brx", name: "Bodo" },
  { code: "doi", name: "Dogri" },
  { code: "gu", name: "Gujarati" },
  { code: "hi", name: "Hindi" },
  { code: "kn", name: "Kannada" },
  { code: "ks", name: "Kashmiri" },
  { code: "kok", name: "Konkani" },
  { code: "mai", name: "Maithili" },
  { code: "ml", name: "Malayalam" },
  { code: "mni", name: "Manipuri (Meitei)" },
  { code: "mr", name: "Marathi" },
  { code: "ne", name: "Nepali" },
  { code: "or", name: "Odia" },
  { code: "pa", name: "Punjabi" },
  { code: "sa", name: "Sanskrit" },
  { code: "sat", name: "Santali" },
  { code: "sd", name: "Sindhi" },
  { code: "ta", name: "Tamil" },
  { code: "te", name: "Telugu" },
  { code: "ur", name: "Urdu" },
];

type Messages = Record<string, string>;

const messagesByLang: Record<LanguageCode, Messages> = {
  en: { "app.title": "Swami Ayyappa Seva" },
  hi: { "app.title": "स्वामी अय्यप्पा सेवा" },
  // Devanagari-based languages
  brx: { "app.title": "स्वामी अय्यप्पा सेवा" }, // Bodo
  doi: { "app.title": "स्वामी अय्यप्पा सेवा" }, // Dogri
  kok: { "app.title": "स्वामी अय्यप्पा सेवा" }, // Konkani
  mai: { "app.title": "स्वामी अय्यप्पा सेवा" }, // Maithili
  mr: { "app.title": "स्वामी अय्यप्पा सेवा" }, // Marathi
  ne: { "app.title": "स्वामी अय्यप्पा सेवा" }, // Nepali
  sa: { "app.title": "स्वामी अय्यप्पा सेवा" }, // Sanskrit
  // Bengali-Assamese scripts
  bn: { "app.title": "স্বামী অয়্যাপ্পা সেবা" },
  as: { "app.title": "স্বামী অয়্যাপ্পা সেৱা" },
  // Gujarati
  gu: { "app.title": "સ્વામી અય્યપ્પા સેવા" },
  // Kannada
  kn: { "app.title": "ಸ್ವಾಮಿ ಅಯ್ಯಪ್ಪ ಸೇವೆ" },
  // Malayalam
  ml: { "app.title": "സ്വാമി അയ്യപ്പ സേവനം" },
  // Odia
  or: { "app.title": "ସ୍ୱାମୀ ଅୟ୍ୟପ୍ପା ସେବା" },
  // Punjabi (Gurmukhi)
  pa: { "app.title": "ਸਵਾਮੀ ਅਯੱਪਾ ਸੇਵਾ" },
  // Tamil
  ta: { "app.title": "ஸ்வாமி அய்யப்பா சேவை" },
  // Telugu
  te: { "app.title": "స్వామి అయ్యప్ప సేవ" },
  // Kashmiri, Santali, Sindhi, Urdu, Meitei — fallback to English for now
  ks: { "app.title": "Swami Ayyappa Seva" },
  sat: { "app.title": "Swami Ayyappa Seva" },
  sd: { "app.title": "Swami Ayyappa Seva" },
  ur: { "app.title": "Swami Ayyappa Seva" },
  mni: { "app.title": "Swami Ayyappa Seva" },
};

type LanguageContextValue = {
  language: LanguageCode;
  setLanguage: (code: LanguageCode) => void;
  t: (key: string) => string;
};

const LanguageContext = React.createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = React.useState<LanguageCode>(() => {
    const stored = localStorage.getItem("app-language") as LanguageCode | null;
    if (stored && LANGUAGES.find((l) => l.code === stored)) return stored;
    // Try navigator language
    const nav = navigator.language?.split("-")[0] as LanguageCode | undefined;
    if (nav && LANGUAGES.find((l) => l.code === nav)) return nav;
    return "en";
  });

  const setLanguage = React.useCallback((code: LanguageCode) => {
    setLanguageState(code);
    localStorage.setItem("app-language", code);
  }, []);

  const t = React.useCallback(
    (key: string) => {
      const table = messagesByLang[language] ?? messagesByLang.en;
      return table[key] ?? messagesByLang.en[key] ?? key;
    },
    [language]
  );

  const value = React.useMemo(() => ({ language, setLanguage, t }), [language, setLanguage, t]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = React.useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
