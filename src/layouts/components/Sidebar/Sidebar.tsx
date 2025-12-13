"use client";

import { Image } from "@/components";
import { IMAGES, PAGE_URLS } from "@/constants";
import {
  TbAdjustments,
  TbCalendarStats,
  TbFileAnalytics,
  TbGauge,
  TbNotes,
  TbSettings,
} from "react-icons/tb";
import { MenuItem } from "./MenuItem";
import { stores } from "@/stores";
import { useTranslations } from "next-intl";
import { USER_ROLES } from "@/enums";

type SidebarProps = {
  onOpenSettings: () => void;
};

export const Sidebar = ({ onOpenSettings }: SidebarProps) => {
  const t = useTranslations();
  const { currentUser } = stores.account();
  const fullName = [currentUser?.firstName, currentUser?.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();
  const email = currentUser?.email;
  const adminMenus = [
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
    {
      id: "5",
      label: t("certificate_types_management"),
      icon: TbFileAnalytics,
      link: PAGE_URLS.ADMIN_CERTIFICATE_TYPES,
    },
  ];

  const orgMenus = [
    {
      id: "1",
      label: t("dashboard"),
      icon: TbGauge,
      link: PAGE_URLS.ORGANIZATIONS_DASHBOARD,
    },
    {
      id: "2",
      label: t("my_organization"),
      icon: TbNotes,
      link: PAGE_URLS.MY_ORGANIZATIONS,
    },
    ...(currentUser?.role === USER_ROLES.ORGANIZATION
      ? [
          {
            id: "3",
            label: t("members"),
            icon: TbCalendarStats,
            link: PAGE_URLS.ORGANIZATIONS_MEMBERS,
          },
        ]
      : []),
    {
      id: "4",
      label: t("certificates"),
      icon: TbAdjustments,
      link: PAGE_URLS.ORGANIZATIONS_CERTIFICATES,
    },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-full max-w-72 px-2.5 py-3">
      <div className="relative flex h-full flex-col overflow-hidden rounded-sm border border-slate-200/60 bg-gradient-to-b from-white/95 via-slate-50/80 to-slate-100/65 shadow-[0_18px_48px_-28px_rgba(30,64,175,0.25)] ring-1 ring-slate-900/5 backdrop-blur-xl dark:border-slate-800/60 dark:bg-gradient-to-b dark:from-slate-950 dark:via-slate-900/85 dark:to-slate-950 dark:shadow-[0_24px_54px_-36px_rgba(15,23,42,0.75)] dark:ring-slate-900/80">
        <div className="pointer-events-none absolute inset-x-6 top-0 h-32 rounded-full bg-gradient-to-r from-blue-400/35 via-sky-400/25 to-cyan-300/20 blur-3xl dark:from-sky-600/14 dark:via-blue-500/12 dark:to-indigo-500/10" />

        <div className="relative px-3 pt-4 pb-3">
          <div className="flex items-center gap-3 rounded-md border border-white/55 bg-white/85 p-3 shadow-sm shadow-slate-200/60 dark:border-slate-800/70 dark:bg-slate-900/80 dark:shadow-[0_18px_38px_-30px_rgba(15,23,42,0.7)]">
            <Image
              wrapperClassName="h-11 w-11 rounded-2xl border border-slate-200/80 bg-white/90 p-1 dark:border-slate-800/70 dark:bg-slate-900/75"
              className="h-full w-full object-contain"
              src={IMAGES.logo}
              alt="logo"
            />
            <p className="text-[13px] font-semibold uppercase tracking-[0.24em] text-slate-700 dark:text-slate-100">
              Admin Panel
            </p>
          </div>
        </div>

        <div className="relative flex-1 overflow-y-auto px-3 pb-3">
          <nav className="mt-3 flex flex-col gap-2">
            {(currentUser?.role === USER_ROLES.ADMIN
              ? adminMenus
              : orgMenus
            ).map((item) => (
              <MenuItem key={item.id} {...item} />
            ))}
          </nav>
        </div>

        <div className="relative border-t border-slate-200/60 bg-gradient-to-b from-white/75 to-white/90 px-3 py-1.5 dark:border-slate-800/70 dark:bg-gradient-to-b dark:from-slate-950/90 dark:via-slate-900/80 dark:to-slate-950">
          <div className="flex items-center gap-3 rounded-2xl border border-transparent px-1.5 py-1 dark:border-slate-800/70 dark:bg-slate-900/70">
            <Image
              wrapperClassName="h-11 w-11 rounded-2xl border border-slate-200/80 bg-white/85 p-0.5 dark:border-slate-700/70 dark:bg-slate-900/60"
              className="h-full w-full rounded-2xl object-cover shadow-sm dark:shadow-[0_18px_30px_-26px_rgba(15,23,42,0.55)]"
              src={currentUser?.avatar ?? IMAGES.default.avatar}
              alt="avatar"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-700 dark:text-slate-100">
                {fullName || "Admin"}
              </p>
              <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                {email || "No email"}
              </p>
            </div>
            <button
              type="button"
              onClick={onOpenSettings}
              aria-label="Open settings"
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200/70 bg-white/85 text-slate-500 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-300 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400/30 dark:border-slate-700/70 dark:bg-slate-900/60 dark:text-slate-200 dark:shadow-[0_18px_34px_-28px_rgba(15,23,42,0.55)] dark:hover:border-sky-500/60 dark:hover:text-sky-300"
            >
              <TbSettings className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};
