"use client";

import { THEMES } from "@/enums";
import { cn } from "@/helpers";
import { useTheme } from "@/providers";
import { Button, Radio } from "@mantine/core";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { TbChevronLeft, TbMoonStars, TbSunHigh } from "react-icons/tb";

type ThemeSettingTabProps = {
  onBack: () => void;
};

export const ThemeSettingTab = ({ onBack }: ThemeSettingTabProps) => {
  const t = useTranslations();
  const { theme, setTheme } = useTheme();
  const themes = useMemo(() => {
    return [
      {
        id: THEMES.DARK,
        label: "dark_theme",
        icon: <TbMoonStars className="w-16 h-16" />,
      },
      {
        id: THEMES.LIGHT,
        label: "light_theme",
        icon: <TbSunHigh className="w-16 h-16" />,
      },
    ];
  }, []);
  const handleChangeTheme = (theme: THEMES) => {
    setTheme(theme);
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
        <p className="flex-1 text-center font-semibold">{t("theme_setting")}</p>
      </div>
      <div className="mt-6 px-2 py-4 min-h-20 bg-gray-300 dark:bg-gray-800 rounded-md">
        <p className="text-center whitespace-pre-line font-medium text-gray-600 dark:text-gray-200">
          {t("change_theme_title")}
        </p>
        <div className="flex gap-2 mt-4">
          {themes.map((item) => (
            <div
              onClick={() => handleChangeTheme(item.id)}
              key={item.id}
              className={cn(
                "flex flex-col h-36 items-center cursor-pointer select-none w-full bg-slate-200 dark:bg-slate-700 rounded-md border-2 border-gray-400 dark:border-gray-600",
                item.id === theme && "border-gray-500 dark:border-gray-400"
              )}
            >
              <span className="flex-1 flex items-center justify-center text-gray-600 dark:text-gray-200">
                {item.icon}
              </span>
              <span className="bg-gray-400 dark:bg-gray-800 flex items-center justify-center w-full h-10 rounded-b-md">
                <Radio
                  className="cursor-pointer"
                  checked={item.id === theme}
                  readOnly
                />
              </span>
            </div>
          ))}
        </div>
        <Button className="mt-4 w-full">{t("confirm")}</Button>
      </div>
    </div>
  );
};
