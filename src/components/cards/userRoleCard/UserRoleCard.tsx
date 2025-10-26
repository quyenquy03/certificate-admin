import { USER_ROLE_LABELS } from "@/constants";
import { USER_ROLES } from "@/enums";
import { cn } from "@/helpers";
import { Box } from "@mantine/core";
import { useTranslations } from "next-intl";
import { BiSolidUser } from "react-icons/bi";
type UserRoleCardProps = {
  role: USER_ROLES;
};

export const UserRoleCard = ({ role }: UserRoleCardProps) => {
  const t = useTranslations();
  return (
    <Box
      className={cn(
        "text-xs bg-purple-400 px-4 py-1 rounded-full text-color-dark flex items-center gap-1 select-none",
        role === USER_ROLES.ADMIN && "bg-blue-400"
      )}
    >
      <BiSolidUser />
      {t(USER_ROLE_LABELS[role])}
    </Box>
  );
};
