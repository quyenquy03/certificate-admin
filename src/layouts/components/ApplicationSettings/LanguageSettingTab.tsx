"use client";

import { Image } from "@/components/images";
import { IMAGES } from "@/constants";
import { LANGUAGES } from "@/enums";
import { useLocale } from "@/providers";
import { Button, Radio } from "@mantine/core";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { TbChevronLeft, TbLanguage } from "react-icons/tb";

type LanguageSettingTabProps = {
  onBack: () => void;
};

export const LanguageSettingTab = ({ onBack }: LanguageSettingTabProps) => {
  const t = useTranslations();
  const { locale, changeLocale } = useLocale();

  const languages = useMemo(
    () => [
      {
        id: LANGUAGES.VI,
        label: "vietnamese",
        icon: IMAGES.flags.vi,
        nativeLabel: "Tieng Viet",
      },
      {
        id: LANGUAGES.EN,
        label: "english",
        icon: IMAGES.flags.en,
        nativeLabel: "English",
      },
    ],
    []
  );

  const handleChangeLanguage = (language: LANGUAGES) => {
    changeLocale(language);
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
            {t("language_setting")}
          </p>
        </div>
      </div>

      <div className="space-y-5 px-4">
        <div className="relative overflow-hidden rounded-md border border-indigo-500/30 bg-gradient-to-r from-indigo-600 via-violet-600 to-slate-900 p-5 text-white shadow-lg">
          <span className="absolute -right-4 top-6 h-24 w-24 rounded-full bg-white/20 blur-3xl" />
          <div className="relative flex items-center gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-md bg-white/20 text-white shadow-inner">
              <TbLanguage className="h-6 w-6" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/80">
                {t("language_setting")}
              </p>
              <p className="mt-1 text-base text-white/90">
                {t("change_language_title")}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {languages.map((item) => {
            const isActive = item.id === locale;
            return (
              <button
                type="button"
                key={item.id}
                onClick={() => handleChangeLanguage(item.id)}
                className={`group relative flex items-center justify-between rounded-md border px-4 py-4 text-left transition-all ${
                  isActive
                    ? "border-indigo-500/80 bg-indigo-50 shadow-md shadow-indigo-500/20 dark:border-indigo-400/80 dark:bg-indigo-500/10"
                    : "border-slate-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/50 dark:border-slate-700 dark:bg-slate-900"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-white/60 bg-white/70 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                    <Image
                      wrapperClassName="w-full h-full"
                      className="h-full w-full object-cover"
                      src={item.icon}
                      alt={item.label}
                    />
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
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {item.nativeLabel}
                    </p>
                  </div>
                </div>
                <Radio checked={isActive} readOnly />
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
