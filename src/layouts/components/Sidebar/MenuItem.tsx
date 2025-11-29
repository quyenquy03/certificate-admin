import { cn } from "@/helpers";
import Link from "next/link";
import { IconType } from "react-icons";
import { TbChevronRight } from "react-icons/tb";

type MenuItemProps = {
  id: string;
  label: string;
  icon: IconType;
  isActive?: boolean;
  link?: string;
};

export const MenuItem = ({
  id,
  label,
  icon,
  link = "",
  isActive = false,
}: MenuItemProps) => {
  const Icon = icon;

  return (
    <Link
      href={link}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "group relative flex items-center gap-2 overflow-hidden rounded-sm border border-slate-200/70 bg-white/75 p-2 text-sm font-medium text-slate-600 shadow-sm shadow-slate-200/40 transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-200/60 hover:bg-white/95 hover:shadow-md dark:border-slate-800/50 dark:bg-slate-900 dark:text-slate-200 dark:shadow-[0_12px_30px_-24px_rgba(0,0,0,0.6)] dark:hover:border-blue-400/45 dark:hover:bg-slate-800/80",
        isActive &&
          "border-transparent bg-gradient-to-r from-blue-500/90 via-blue-500/80 to-blue-400/80 text-white shadow-lg shadow-blue-500/25 dark:from-blue-600/60 dark:via-indigo-500/55 dark:to-blue-400/50 dark:shadow-[0_18px_40px_-30px_rgba(37,99,235,0.45)]"
      )}
    >
      <span
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-md bg-slate-100 text-slate-500 transition-all duration-200 group-hover:bg-blue-50 group-hover:text-blue-600 dark:bg-slate-800/80 dark:text-slate-300 dark:group-hover:bg-blue-500/25 dark:group-hover:text-blue-200",
          isActive && "bg-white/25 text-white dark:bg-white/10"
        )}
      >
        <Icon className="h-5 w-5" />
      </span>

      <span className="flex-1 truncate">{label}</span>

      <TbChevronRight
        className={cn(
          "h-4 w-4 translate-x-0 text-slate-300 transition-all duration-200 group-hover:translate-x-1 group-hover:text-blue-500 dark:text-slate-500 dark:group-hover:text-blue-300",
          isActive && "translate-x-1 text-white dark:text-white"
        )}
      />

      <span
        className={cn(
          "pointer-events-none absolute inset-px rounded-sm opacity-0 transition-opacity duration-200 group-hover:opacity-100",
          !isActive &&
            "bg-gradient-to-r from-blue-500/10 via-blue-400/10 to-cyan-400/10 dark:from-blue-500/8 dark:via-indigo-500/8 dark:to-cyan-400/8"
        )}
      />
    </Link>
  );
};
