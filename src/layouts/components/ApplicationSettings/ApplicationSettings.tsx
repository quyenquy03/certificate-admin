"use client";

import { Image } from "@/components/images";
import { ACCESS_TOKEN_KEY, IMAGES, PAGE_URLS } from "@/constants";
import { Drawer, Tabs } from "@mantine/core";
import Cookies from "js-cookie";
import { useTranslations } from "next-intl";
import { useCallback, useMemo, useState } from "react";
import { TbChevronRight, TbGauge, TbLogout } from "react-icons/tb";
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

  const settingMenus = useMemo(() => {
    return [
      {
        value: APPLICATION_SETTING_TABS.LANGUAGE_SETTING_TAB,
        label: "language_setting",
        icon: <TbGauge className="w-5 h-5" />,
      },
      {
        value: APPLICATION_SETTING_TABS.THEME_SETTING_TAB,
        label: "theme_setting",
        icon: <TbGauge className="w-5 h-5" />,
      },
      {
        value: APPLICATION_SETTING_TABS.PROFILE_SETTING_TAB,
        label: "profile_setting",
        icon: <TbGauge className="w-5 h-5" />,
      },
      {
        value: APPLICATION_SETTING_TABS.PASSWORD_SETTING_TAB,
        label: "password_setting",
        icon: <TbGauge className="w-5 h-5" />,
      },
    ];
  }, []);

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
    >
      <Tabs
        defaultValue={APPLICATION_SETTING_TABS.MENU_SETTING_TAB}
        value={currentTab}
      >
        <Tabs.Panel value={APPLICATION_SETTING_TABS.MENU_SETTING_TAB}>
          <div className="border-b-[1px] border-gray-300 dark:border-gray-500 pb-4 relative">
            <span
              onClick={onClose}
              className="absolute top-2 right-2 bg-gray-400 dark:bg-gray-500 dark:text-red-300 dark:hover:bg-gray-600 hover:bg-gray-300 transition-all text-red-700 cursor-pointer z-10 p-2 rounded-sm"
            >
              <FaXmark className="w-4 h-4" />
            </span>
            <div className="h-32 bg-gray-200 dark:bg-gray-600 rounded-lg animate-pulse"></div>
            <div className="flex items-center flex-col -mt-10 gap-3">
              <Image
                wrapperClassName="w-20 h-20 rounded-full"
                className="w-full h-full rounded-full border-[2px] border-gray-600 dark:border-gray-400"
                src={currentUser?.avatar ?? IMAGES.default.avatar}
                alt="logo"
              />
              <div className="text-center text-gray-500 dark:text-gray-200">
                <p className="font-bold text-sm">{`${currentUser?.firstName} ${currentUser?.lastName}`}</p>
                <p className="font-medium text-xs mt-1">{currentUser?.email}</p>
              </div>
            </div>
          </div>
          <div className="p-2 my-4 space-y-3">
            {settingMenus.map((item) => (
              <div
                onClick={() => setCurrentTab(item.value)}
                className="h-10 flex items-center gap-2 bg-gray-300 dark:bg-gray-700 px-2 rounded-sm cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 active:bg-gray-300 dark:active:bg-gray-700 select-none transition-all text-gray-500 dark:text-gray-200"
                key={item.value}
              >
                <div className="flex gap-2 items-center flex-1">
                  <span className="w-8 flex justify-center items-center">
                    {item.icon}
                  </span>
                  <span className="text-sm font-bold">{t(item.label)}</span>
                </div>
                <TbChevronRight />
              </div>
            ))}
          </div>
          <div className="border-t-[1px] border-gray-300 dark:border-gray-500 p-2 pt-6">
            <button
              type="button"
              onClick={handleLogout}
              className="h-10 w-full flex items-center gap-2 bg-gray-300 dark:bg-gray-700 text-red-500 px-2 rounded-sm cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 active:bg-gray-300 dark:active:bg-gray-700 select-none transition-all"
            >
              <span className="w-8 flex justify-center items-center">
                <TbLogout className="h-5 w-5" />
              </span>
              <span className="text-sm font-bold">{t("logout")}</span>
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
