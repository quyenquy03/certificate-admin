"use client";

import { THEMES } from "@/enums";
import { useTheme } from "@/providers";
import { Button, Radio } from "@mantine/core";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import {
  TbChevronLeft,
  TbMoonStars,
  TbSunHigh,
  TbSparkles,
} from "react-icons/tb";

type ThemeSettingTabProps = {
  onBack: () => void;
};

export const ThemeSettingTab = ({ onBack }: ThemeSettingTabProps) => {
  const t = useTranslations();
  const { theme, setTheme } = useTheme();

  const themes = useMemo(
    () => [
      {
        id: THEMES.LIGHT,
        label: "light_theme",
        icon: <TbSunHigh className="h-6 w-6" />,
        helper: "Best for bright spaces and daytime use.",
      },
      {
        id: THEMES.DARK,
        label: "dark_theme",
        icon: <TbMoonStars className="h-6 w-6" />,
        helper: "Gentle on the eyes in low-light environments.",
      },
    ],
    []
  );

  const handleChangeTheme = (nextTheme: THEMES) => {
    setTheme(nextTheme);
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="sticky top-0 z-20 flex items-center gap-3  p-1.5 text-slate-600 shadow-sm bg-white dark:bg-slate-900/70 dark:text-slate-200">
        <button
          type="button"
          onClick={onBack}
          aria-label={t("not_found_back_cta")}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:-translate-x-0.5 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
        >
          <TbChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex-1 text-center">
          <p className="text-base font-semibold text-slate-900 dark:text-white">
            {t("theme_setting")}
          </p>
        </div>
      </div>

      <div className="space-y-5 px-4">
        <div className="relative overflow-hidden rounded-md border border-slate-200/40 bg-gradient-to-r from-indigo-600 via-purple-600 to-slate-900 p-5 text-white shadow-lg dark:border-slate-700/50">
          <span className="absolute -right-6 top-6 h-32 w-32 rounded-full bg-white/20 blur-3xl" />
          <div className="relative flex items-center gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-md bg-white/20 text-white shadow-inner">
              <TbSparkles className="h-6 w-6" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
                {t("theme_setting")}
              </p>
              <p className="mt-1 text-base text-white/90">
                {t("change_theme_title")}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {themes.map((item) => {
            const isActive = item.id === theme;
            return (
              <button
                type="button"
                key={item.id}
                onClick={() => handleChangeTheme(item.id)}
                className={`group relative flex flex-col gap-4 rounded-md border px-5 py-5 text-left transition-all ${
                  isActive
                    ? "border-indigo-500/80 bg-indigo-50 shadow-md shadow-indigo-500/30 dark:border-indigo-400/80 dark:bg-indigo-500/10"
                    : "border-slate-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/40 dark:border-slate-700 dark:bg-slate-900"
                }`}
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-3">
                    <span
                      className={`flex h-12 w-12 items-center justify-center rounded-md ${
                        isActive
                          ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-200"
                          : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-200"
                      }`}
                    >
                      {item.icon}
                    </span>
                    <div>
                      <p
                        className={`text-sm font-semibold ${
                          isActive
                            ? "text-indigo-600 dark:text-indigo-300"
                            : "text-slate-900 dark:text-slate-100"
                        }`}
                      >
                        {t(item.label)}
                      </p>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <span>{item.helper}</span>
                      </div>
                    </div>
                  </div>
                  <Radio checked={isActive} readOnly />
                </div>
                <span
                  className={`pointer-events-none absolute inset-px rounded-md border border-white/60 transition-opacity ${
                    isActive
                      ? "opacity-100"
                      : "opacity-0 group-hover:opacity-100 dark:border-white/20"
                  }`}
                />
              </button>
            );
          })}
        </div>

        <Button
          size="md"
          radius="md"
          variant="gradient"
          gradient={{ from: "indigo", to: "violet" }}
          className="w-full"
        >
          {t("confirm")}
        </Button>
      </div>
    </div>
  );
};
