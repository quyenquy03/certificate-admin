import { cn } from "@/helpers";
import Link from "next/link";
import { IconType } from "react-icons";

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
      className={cn(
        "flex h-12 items-center gap-2 px-2 hover:bg-slate-100 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-200",
        isActive && "dark:bg-slate-700 bg-slate-300"
      )}
    >
      <div className="w-10 flex items-center justify-center">
        <Icon className="w-6 h-6" />
      </div>
      <span>{label}</span>
    </Link>
  );
};
