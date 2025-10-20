"use client";

import {
  ReactNode,
  useEffect,
  useState,
  createContext,
  useContext,
} from "react";
import { NextIntlClientProvider } from "next-intl";
import { LANGUAGES } from "@/enums";

type LocaleContextType = {
  locale: LANGUAGES;
  changeLocale: (newLocale: LANGUAGES) => void;
};

const LocaleContext = createContext<LocaleContextType | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<LANGUAGES>(LANGUAGES.EN);
  const [messages, setMessages] = useState<any>(null);

  useEffect(() => {
    const saved = localStorage.getItem("locale") || LANGUAGES.EN;
    changeLocale(saved as LANGUAGES);
  }, []);

  async function changeLocale(newLocale: LANGUAGES) {
    const data = await import(`@/messages/${newLocale}.json`);
    setLocale(newLocale);
    setMessages(data.default);
    localStorage.setItem("locale", newLocale);
  }

  if (!messages) return null;

  return (
    <LocaleContext.Provider value={{ locale, changeLocale }}>
      <NextIntlClientProvider locale={locale} messages={messages}>
        {children}
      </NextIntlClientProvider>
    </LocaleContext.Provider>
  );
}

export const useLocale = () => {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
};
