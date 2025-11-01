"use client";

import { Image } from "@/components";
import { IMAGES, PAGE_URLS } from "@/constants";
import {
  TbCalendarStats,
  TbGauge,
  TbNotes,
  TbSettings,
  TbAdjustments,
  TbFileAnalytics,
  TbLock,
  TbPresentationAnalytics,
} from "react-icons/tb";
import { MenuItem } from "./MenuItem";
import { stores } from "@/stores";
import { useTranslations } from "next-intl";

type SidebarProps = {
  onOpenSettings: () => void;
};

export const Sidebar = ({ onOpenSettings }: SidebarProps) => {
  const t = useTranslations();
  const { currentUser } = stores.account();
  const mockData = [
    {
      id: "1",
      label: t("dashboard"),
      icon: TbGauge,
      link: PAGE_URLS.ADMIN_DASHBOARD,
    },
    {
      id: "2",
      label: t("users_management"),
      icon: TbNotes,
      link: PAGE_URLS.ADMIN_USERS,
    },
    {
      id: "3",
      label: t("organizations_management"),
      icon: TbCalendarStats,
      link: PAGE_URLS.ADMIN_ORGANIZATIONS,
    },
    {
      id: "4",
      label: t("registrations_management"),
      icon: TbAdjustments,
      link: PAGE_URLS.ADMIN_REGISTRATIONS,
    },
  ];
  return (
    <div className="fixed w-full max-w-72 h-screen bg-background-primary-light dark:bg-background-primary-dark shadow-gray-400 dark:shadow-gray-500 shadow-inner">
      <div className="flex items-center p-2 gap-2 border-b-[1px] border-gray-300 dark:border-gray-500 shadow-sm shadow-gray-400 dark:shadow-gray-500 h-14">
        <Image
          wrapperClassName="w-9 h-9"
          className="w-full h-full"
          src={IMAGES.logo}
          alt="logo"
        />
        <p className="leading-normal font-bold text-center text-gray-500 dark:text-gray-200">
          ADMIN PANEL
        </p>
      </div>
      <div className="h-[calc(100vh-112px)] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-gray-600 [&::-webkit-scrollbar-thumb]:bg-gray-800 overflow-y-visible">
        {mockData.map((item) => (
          <MenuItem key={item.id} {...item} />
        ))}
      </div>
      <div className="h-14 border-t-[1px] bg-background-primary-light dark:bg-background-primary-dark border-gray-300 dark:border-gray-500 shadow-sm shadow-gray-400 dark:shadow-gray-500 flex items-center gap-2 px-2">
        <div className="flex gap-2 flex-1">
          <Image
            wrapperClassName="w-9 h-9 rounded-full"
            className="w-full h-full rounded-full border-[2px] border-gray-400"
            src={currentUser?.avatar ?? IMAGES.default.avatar}
            alt="logo"
          />
          <div className="">
            <p className="font-bold text-sm text-gray-500 dark:text-gray-200">
              {`${currentUser?.firstName} ${currentUser?.lastName}`}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-300 font-semibold">
              {currentUser?.email}
            </p>
          </div>
        </div>
        <span
          onClick={onOpenSettings}
          className="cursor-pointer select-none text-gray-500 dark:text-gray-200 bg-gray-300 dark:bg-gray-600 w-8 h-8 flex justify-center items-center rounded-md hover:bg-gray-200 dark:hover:bg-gray-500 transition-all active:bg-gray-300 dark:active:bg-gray-600"
        >
          <TbSettings className="w-6 h-6" />
        </span>
      </div>
    </div>
  );
};
