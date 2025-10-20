"use client";

import { THEMES } from "@/enums";
import { createContext, useContext, useEffect, useState } from "react";

type ThemeContextType = {
  theme: THEMES;
  setTheme: (theme: THEMES) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({
  children,
  defaultTheme = THEMES.AUTO,
  storageKey = "theme",
}: {
  children: React.ReactNode;
  defaultTheme?: THEMES;
  storageKey?: string;
}) {
  const [theme, setThemeState] = useState<THEMES>(defaultTheme);

  // load từ localStorage
  useEffect(() => {
    const saved = localStorage.getItem(storageKey) as THEMES | null;
    if (saved) {
      applyTheme(saved);
    } else {
      applyTheme(defaultTheme);
    }
  }, []);

  const applyTheme = (t: THEMES) => {
    const root = document.documentElement;
    root.classList.remove(THEMES.LIGHT, THEMES.DARK);

    let applied: THEMES;
    if (t === THEMES.AUTO) {
      applied = window.matchMedia(`(prefers-color-scheme: ${THEMES.DARK})`)
        .matches
        ? THEMES.DARK
        : THEMES.LIGHT;
    } else {
      applied = t;
    }

    root.classList.add(applied);
    setThemeState(t);
    localStorage.setItem(storageKey, t);
  };

  const value: ThemeContextType = {
    theme,
    setTheme: applyTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (ctx === undefined) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return ctx;
}
