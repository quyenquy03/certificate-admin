import { Box } from "@mantine/core";
import { useTranslations } from "next-intl";
import { BiSolidUser } from "react-icons/bi";

export type OrganizationMemberStatus = "owner" | "member";

const STATUS_CONFIG: Record<
  OrganizationMemberStatus,
  { label: string; className: string }
> = {
  owner: {
    label: "organization_member_owner",
    className: "bg-amber-400",
  },
  member: {
    label: "organization_member_member",
    className: "bg-emerald-400",
  },
};

type OrganizationMemberStatusCardProps = {
  status: OrganizationMemberStatus;
};

export const OrganizationMemberStatusCard = ({
  status,
}: OrganizationMemberStatusCardProps) => {
  const t = useTranslations();
  const statusConfig = STATUS_CONFIG[status];

  return (
    <Box
      className={`text-xs px-4 py-1 rounded-full text-color-dark flex items-center gap-1 select-none ${statusConfig.className}`}
    >
      <BiSolidUser />
      {t(statusConfig.label)}
    </Box>
  );
};
