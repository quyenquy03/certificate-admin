"use client";

import { Image } from "@/components/images";
import { ACCESS_TOKEN_KEY, IMAGES, PAGE_URLS } from "@/constants";
import { Drawer, Tabs } from "@mantine/core";
import Cookies from "js-cookie";
import { useTranslations } from "next-intl";
import { ReactNode, useCallback, useMemo, useState } from "react";
import {
  TbChevronRight,
  TbLanguage,
  TbPalette,
  TbUser,
  TbLock,
  TbLogout,
} from "react-icons/tb";
import { PasswordSettingTab } from "./PasswordSettingTab";
import { ProfileSettingTab } from "./ProfileSettingTab";
import { ThemeSettingTab } from "./ThemeSettingTab";
import { LanguageSettingTab } from "./LanguageSettingTab";
import { FaXmark } from "react-icons/fa6";
import { stores } from "@/stores";
import { useRouter } from "next/navigation";

type ApplicationSettingsProps = {
  opened: boolean;
  onClose: () => void;
};

enum APPLICATION_SETTING_TABS {
  MENU_SETTING_TAB = "MENU_SETTING_TAB",
  LANGUAGE_SETTING_TAB = "LANGUAGE_SETTING_TAB",
  PASSWORD_SETTING_TAB = "PASSWORD_SETTING_TAB",
  PROFILE_SETTING_TAB = "PROFILE_SETTING_TAB",
  THEME_SETTING_TAB = "THEME_SETTING_TAB",
}

type SettingMenu = {
  value: APPLICATION_SETTING_TABS;
  label: string;
  description: string;
  icon: ReactNode;
  accent: string;
};

export const ApplicationSettings = ({
  opened,
  onClose,
}: ApplicationSettingsProps) => {
  const t = useTranslations();
  const { currentUser, setCurrentUser, setAccessToken } = stores.account();
  const router = useRouter();

  const [currentTab, setCurrentTab] = useState<APPLICATION_SETTING_TABS>(
    APPLICATION_SETTING_TABS.MENU_SETTING_TAB
  );

  const settingMenus = useMemo<SettingMenu[]>(() => {
    return [
      {
        value: APPLICATION_SETTING_TABS.LANGUAGE_SETTING_TAB,
        label: t("language_setting"),
        description: t("language_setting_description"),
        icon: <TbLanguage className="h-5 w-5" />,
        accent: "from-sky-400 via-indigo-400 to-indigo-500",
      },
      {
        value: APPLICATION_SETTING_TABS.THEME_SETTING_TAB,
        label: t("theme_setting"),
        description: t("theme_setting_description"),
        icon: <TbPalette className="h-5 w-5" />,
        accent: "from-amber-400 via-orange-500 to-pink-500",
      },
      {
        value: APPLICATION_SETTING_TABS.PROFILE_SETTING_TAB,
        label: t("profile_setting"),
        description: t("profile_setting_description"),
        icon: <TbUser className="h-5 w-5" />,
        accent: "from-emerald-400 via-teal-500 to-cyan-500",
      },
      {
        value: APPLICATION_SETTING_TABS.PASSWORD_SETTING_TAB,
        label: t("password_setting"),
        description: t("password_setting_description"),
        icon: <TbLock className="h-5 w-5" />,
        accent: "from-purple-400 via-indigo-500 to-blue-500",
      },
    ];
  }, [t]);

  const handleLogout = useCallback(() => {
    Cookies.remove(ACCESS_TOKEN_KEY);
    setCurrentUser(null);
    setAccessToken(null);
    onClose();
    router.push(PAGE_URLS.LOGIN);
  }, [onClose, router, setAccessToken, setCurrentUser]);

  const onBack = useCallback(() => {
    setCurrentTab(APPLICATION_SETTING_TABS.MENU_SETTING_TAB);
  }, []);

  const userFullName = useMemo(() => {
    if (!currentUser) {
      return "";
    }
    const names = [currentUser.firstName, currentUser.lastName].filter(Boolean);
    return names.join(" ").trim();
  }, [currentUser]);

  return (
    <Drawer
      position="right"
      opened={opened}
      withCloseButton={false}
      size={"sm"}
      onClose={onClose}
      overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}
      closeOnClickOutside={false}
      closeOnEscape={false}
      classNames={{
        body: "p-0",
      }}
    >
      <Tabs
        defaultValue={APPLICATION_SETTING_TABS.MENU_SETTING_TAB}
        value={currentTab}
        className="flex h-full flex-col"
      >
        <Tabs.Panel
          value={APPLICATION_SETTING_TABS.MENU_SETTING_TAB}
          className="flex h-full flex-col gap-5"
        >
          <div className="relative overflow-hidden rounded-b-xl border border-white/30 bg-gradient-to-br from-indigo-500 via-purple-500 to-slate-900 px-4 py-4 text-white shadow-2xl dark:border-white/10">
            <span className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/30 blur-3xl" />
            <span className="pointer-events-none absolute -bottom-16 -left-6 h-32 w-32 rounded-full bg-violet-400/40 blur-3xl" />
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-2xl border border-white/40 bg-white/20 text-white transition hover:bg-white/40"
              aria-label={t("cancel")}
            >
              <FaXmark className="h-4 w-4" />
            </button>
            <div className="flex flex-col gap-3">
              <span className="text-xs uppercase tracking-[0.3em] text-white/70">
                {t("application_settings_badge")}
              </span>
              <div>
                <p className="text-2xl font-semibold leading-tight">
                  {t("application_settings_title")}
                </p>
                <p className="mt-2 text-sm text-white/80">
                  {t("application_settings_subtitle")}
                </p>
              </div>
              <div className="mt-2 flex items-center gap-3 rounded-lg border border-white/30 bg-white/10 p-2.5 backdrop-blur-sm">
                <Image
                  wrapperClassName="w-12 h-12 rounded-xl overflow-hidden border border-white/50"
                  className="h-full w-full rounded-xl object-cover"
                  src={currentUser?.avatar ?? IMAGES.default.avatar}
                  alt="avatar"
                />
                <div className="text-sm">
                  {userFullName && (
                    <p className="font-semibold text-white">{userFullName}</p>
                  )}
                  {currentUser?.email && (
                    <p className="mt-1 text-white/80">{currentUser.email}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-3 p-2">
            <div className="space-y-1 px-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                {t("application_settings_badge")}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {t("application_settings_subtitle")}
              </p>
            </div>
            <div className="flex flex-col gap-3">
              {settingMenus.map((item) => (
                <button
                  type="button"
                  key={item.value}
                  onClick={() => setCurrentTab(item.value)}
                  className="group relative flex items-center gap-3 overflow-hidden rounded-lg border border-slate-200/80 bg-white/90 px-2.5 py-2.5 text-left shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md dark:border-slate-800/60 dark:bg-slate-900/70"
                >
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${item.accent} text-white shadow-inner`}
                  >
                    {item.icon}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      {item.label}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-300">
                      {item.description}
                    </p>
                  </div>
                  <TbChevronRight className="text-slate-400 transition group-hover:translate-x-1" />
                </button>
              ))}
            </div>
          </div>
          <div className="mt-auto p-2">
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center justify-between rounded-xl border border-red-200/70 bg-gradient-to-r from-red-50 to-rose-50 px-3 py-3 text-left text-red-600 shadow-sm transition hover:shadow-md dark:border-red-900/70 dark:from-red-900/40 dark:to-red-900/20 dark:text-red-200"
            >
              <div className="flex items-center gap-3 text-sm font-semibold">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-100 text-red-600 dark:bg-red-900/60 dark:text-red-200">
                  <TbLogout className="h-5 w-5" />
                </span>
                {t("logout")}
              </div>
              <TbChevronRight className="text-red-400" />
            </button>
          </div>
        </Tabs.Panel>

        <Tabs.Panel value={APPLICATION_SETTING_TABS.PASSWORD_SETTING_TAB}>
          <PasswordSettingTab onBack={onBack} />
        </Tabs.Panel>

        <Tabs.Panel value={APPLICATION_SETTING_TABS.PROFILE_SETTING_TAB}>
          <ProfileSettingTab onBack={onBack} />
        </Tabs.Panel>

        <Tabs.Panel value={APPLICATION_SETTING_TABS.THEME_SETTING_TAB}>
          <ThemeSettingTab onBack={onBack} />
        </Tabs.Panel>

        <Tabs.Panel value={APPLICATION_SETTING_TABS.LANGUAGE_SETTING_TAB}>
          <LanguageSettingTab onBack={onBack} />
        </Tabs.Panel>
      </Tabs>
    </Drawer>
  );
};
