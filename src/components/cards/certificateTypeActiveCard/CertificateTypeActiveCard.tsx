import { cn } from "@/helpers";
import { Box } from "@mantine/core";
import { useTranslations } from "next-intl";

type CertificateTypeActiveCardProps = {
  isActive: boolean;
  className?: string;
};

export const CertificateTypeActiveCard = ({
  isActive,
  className,
}: CertificateTypeActiveCardProps) => {
  const t = useTranslations();

  const color = isActive ? "#22C55E" : "#EF4444";
  const label = isActive ? t("active") : t("inactive");

  return (
    <Box
      className={cn(
        "flex select-none items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide",
        className
      )}
      style={{
        color,
        backgroundColor: `${color}20`,
      }}
    >
      <Box
        className="h-2 w-2 rounded-full"
        style={{
          backgroundColor: color,
        }}
      />
      {label}
    </Box>
  );
};
