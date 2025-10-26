import { cn } from "@/helpers";
import { Box } from "@mantine/core";
import { useTranslations } from "next-intl";
import { BiSolidLock } from "react-icons/bi";

type UserBlockCardProps = {
  isBlock: boolean;
};

export const UserBlockCard = ({ isBlock }: UserBlockCardProps) => {
  const t = useTranslations();
  return (
    <Box
      className={cn(
        "text-xs bg-green-400 px-4 py-1 rounded-full text-color-dark flex items-center gap-1 select-none",
        isBlock && "bg-red-400"
      )}
    >
      <BiSolidLock />
      {t(isBlock ? "block" : "not_block")}
    </Box>
  );
};
