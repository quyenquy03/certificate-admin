"use client";

import { Image } from "@/components/images";
import { IMAGES } from "@/constants";
import {
  TbAdjustments,
  TbCalendarStats,
  TbFileAnalytics,
  TbGauge,
  TbLock,
  TbNotes,
  TbPresentationAnalytics,
  TbSettings,
} from "react-icons/tb";
import { MenuItem } from "./MenuItem";

type SidebarProps = {
  onOpenSettings: () => void;
};

export const Sidebar = ({ onOpenSettings }: SidebarProps) => {
  const mockdata = [
    { id: "1", label: "Dashboard", icon: TbGauge, isActive: true },
    { id: "2", label: "Market news", icon: TbNotes },
    { id: "3", label: "Releases", icon: TbCalendarStats },
    { id: "4", label: "Analytics", icon: TbPresentationAnalytics },
    { id: "5", label: "Contracts", icon: TbFileAnalytics },
    { id: "6", label: "Settings", icon: TbAdjustments },
    { id: "7", label: "Security", icon: TbLock },
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
        {mockdata.map((item) => (
          <MenuItem key={item.id} {...item} />
        ))}
      </div>
      <div className="h-14 border-t-[1px] bg-background-primary-light dark:bg-background-primary-dark border-gray-300 dark:border-gray-500 shadow-sm shadow-gray-400 dark:shadow-gray-500 flex items-center gap-2 px-2">
        <div className="flex gap-2 flex-1">
          <Image
            wrapperClassName="w-9 h-9 rounded-full"
            className="w-full h-full rounded-full border-[2px] border-gray-400"
            src={IMAGES.default.avatar}
            alt="logo"
          />
          <div className="">
            <p className="font-bold text-sm text-gray-500 dark:text-gray-200">
              Nguyen Ta Quyen
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-300 font-semibold">
              Ta2k3quyen@gmail.com
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
