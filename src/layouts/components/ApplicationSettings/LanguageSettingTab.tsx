"use client";

import { Image } from "@/components/images";
import { IMAGES } from "@/constants";
import { LANGUAGES } from "@/enums";
import { useLocale } from "@/providers";
import { Button, Radio } from "@mantine/core";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { TbChevronLeft } from "react-icons/tb";

type LanguageSettingTabProps = {
  onBack: () => void;
};

export const LanguageSettingTab = ({ onBack }: LanguageSettingTabProps) => {
  const t = useTranslations();
  const { locale, changeLocale } = useLocale();
  const languages = useMemo(() => {
    return [
      {
        id: LANGUAGES.VI,
        label: "vietnamese",
        icon: IMAGES.flags.vi,
      },
      {
        id: LANGUAGES.EN,
        label: "english",
        icon: IMAGES.flags.en,
      },
    ];
  }, []);
  const handleChangeLanguage = (language: LANGUAGES) => {
    changeLocale(language);
  };
  return (
    <div>
      <div className="flex items-center h-12 rounded-lg px-2 gap-2 bg-gray-300 dark:bg-gray-800 text-gray-600 dark:text-gray-200">
        <span
          onClick={onBack}
          className="w-8 h-8 select-none bg-gray-200 dark:bg-gray-700 cursor-pointer shadow-sm shadow-gray-300 dark:shadow-gray-500 hover:bg-gray-400 dark:hover:bg-gray-600 active:bg-gray-200 dark:active:bg-gray-700 flex items-center justify-center rounded-md transition-all"
        >
          <TbChevronLeft className="w-5 h-5" />
        </span>
        <p className="flex-1 text-center font-semibold">
          {t("language_setting")}
        </p>
      </div>
      <div className="mt-6 px-2 py-4 min-h-20 bg-gray-300 dark:bg-gray-800  rounded-md">
        <p className="text-center whitespace-pre-line font-medium text-gray-600 dark:text-gray-200">
          {t("change_language_title")}
        </p>
        <div className="flex flex-col gap-2 mt-4">
          {languages.map((item) => (
            <div
              onClick={() => handleChangeLanguage(item.id)}
              key={item.id}
              className="flex items-center gap-3 h-16 cursor-pointer select-none w-full bg-gray-400 dark:bg-slate-700 rounded-md border-2 border-gray-400 dark:border-gray-600 text-gray-800 dark:text-gray-200"
            >
              <span className="bg-gray-300 dark:bg-gray-800 flex items-center justify-center w-12 h-full rounded-l-md">
                <Radio
                  className="cursor-pointer"
                  checked={item.id === locale}
                  readOnly
                />
              </span>
              <Image
                wrapperClassName="w-14 h-10 rounded-full"
                className="w-full h-full rounded-lg"
                src={item.icon}
                alt="icon"
              />
              <span>{t(item.label)}</span>
            </div>
          ))}
        </div>
        <Button className="mt-4 w-full">{t("confirm")}</Button>
      </div>
    </div>
  );
};
