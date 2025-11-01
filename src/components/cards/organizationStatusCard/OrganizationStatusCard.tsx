import {
  ORGANIZATION_STATUS_COLORS,
  ORGANIZATION_STATUS_LABELS,
} from "@/constants";
import { ORGANIZATION_STATUSES } from "@/enums";
import { cn } from "@/helpers";
import { Box } from "@mantine/core";
import { useTranslations } from "next-intl";

type OrganizationStatusCardProps = {
  status: ORGANIZATION_STATUSES;
};

export const OrganizationStatusCard = ({
  status,
}: OrganizationStatusCardProps) => {
  const t = useTranslations();

  const color = ORGANIZATION_STATUS_COLORS[status];

  return (
    <Box
      className={cn(
        "text-xs px-4 py-1 rounded-full flex items-center gap-1 select-none font-semibold"
      )}
      style={{
        color,
        backgroundColor: `${color}20`,
      }}
    >
      {t(ORGANIZATION_STATUS_LABELS[status])}
    </Box>
  );
};
