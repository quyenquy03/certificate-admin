import { ORGANIZATION_STATUS_COLORS } from "@/constants";
import { OrganizationResponseType } from "@/types";
import { ActionIcon, Box, Flex, Text, Tooltip } from "@mantine/core";
import { useTranslations } from "next-intl";
import {
  HiOutlineCheck,
  HiOutlineDocumentDuplicate,
  HiOutlineGlobeAlt,
  HiOutlineSparkles,
} from "react-icons/hi2";
import { ORGANIZATION_STATUSES } from "@/enums";
import { FiCopy } from "react-icons/fi";

type OrganizationItemProps = {
  organization: OrganizationResponseType;
  onClick?: (organization: OrganizationResponseType) => void;
  isCurrent?: boolean;
};

export const OrganizationItem = ({
  organization,
  onClick,
  isCurrent = false,
}: OrganizationItemProps) => {
  const t = useTranslations();

  const trimmedOrEmpty = (value?: string | null) => {
    const trimmed = value?.trim();
    return trimmed && trimmed.length > 0 ? trimmed : "";
  };

  const organizationName =
    trimmedOrEmpty(organization.name) || t("not_updated");
  const organizationDescription =
    trimmedOrEmpty(organization.description) || t("not_updated");

  const organizationInitial = organizationName?.charAt(0)?.toUpperCase() || "O";

  const accentStatus = organization.isActive
    ? ORGANIZATION_STATUSES.APPROVED
    : ORGANIZATION_STATUSES.REJECTED;
  const accentColor = ORGANIZATION_STATUS_COLORS[accentStatus] ?? "#6366F1";
  const statusLabel = organization.isActive ? t("active") : t("inactive");
  const websiteValue = trimmedOrEmpty(organization.website) || t("not_updated");
  const initTxHash = trimmedOrEmpty(organization.initTxHash);
  const displayInitTxHash = initTxHash || t("not_updated");
  const canCopyInitTxHash = Boolean(initTxHash);
  const currentLabel = isCurrent
    ? t("organization_dashboard_current_org")
    : t("organization_not_current_org");
  const currentAccent = isCurrent ? "#0EA5E9" : "#94A3B8";

  const infoCardClass =
    "w-full rounded-md border border-gray-200 px-3 py-3 text-left dark:border-gray-600";
  const iconWrapperClass =
    "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-700/40 dark:text-slate-200";
  const labelClass =
    "text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-300";
  const valueClass =
    "truncate text-sm font-medium text-gray-900 dark:text-gray-100";

  const copyToClipboard = async (value?: string | null) => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
    } catch (error) {
      console.error("copy_error", error);
    }
  };

  return (
    <Box
      className="min-h-28 relative text-color-light dark:text-color-dark bg-background-primary-light dark:bg-background-primary-dark rounded-md shadow-md dark:shadow-gray-600 p-3 transition-all"
      onClick={() => onClick?.(organization)}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <Box
        className="absolute inset-x-0 top-0 h-1 w-full rounded-t-md"
        style={{
          background: `linear-gradient(90deg, ${accentColor} 0%, ${accentColor}80 100%)`,
        }}
      />
      <Flex gap={12} align="center" justify="space-between" className="pb-2">
        <Flex gap={8} align="center" className="min-w-0">
          <Box
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-lg font-semibold uppercase text-white shadow-sm"
            style={{
              background: `linear-gradient(135deg, ${accentColor}1A 0%, ${accentColor} 100%)`,
            }}
          >
            {organizationInitial}
          </Box>
          <Flex direction="column" gap={4} className="min-w-0">
            <Text className="truncate text-base font-semibold capitalize text-gray-900 dark:text-gray-50">
              {organizationName}
            </Text>
            <Text className="truncate text-xs text-gray-500 dark:text-gray-300">
              {organizationDescription}
            </Text>
          </Flex>
        </Flex>
      </Flex>
      <Flex gap={8} direction="column">
        <Flex gap={8} className="flex-col sm:flex-row">
          <Flex gap={12} className={`${infoCardClass} flex-1`}>
            <Box className={iconWrapperClass}>
              <HiOutlineCheck className="h-4 w-4" />
            </Box>
            <Flex direction="column" className="min-w-0 flex-1">
              <Text
                className="text-sm font-semibold text-gray-900 dark:text-gray-100"
                style={{ color: currentAccent }}
              >
                {currentLabel}
              </Text>
            </Flex>
          </Flex>
          <Flex gap={12} className={`${infoCardClass} flex-1`}>
            <Box className={iconWrapperClass}>
              <HiOutlineSparkles className="h-4 w-4" />
            </Box>
            <Flex direction="column" className="min-w-0 flex-1">
              <Box
                className="text-xs px-4 py-1 rounded-full font-semibold w-fit"
                style={{
                  color: accentColor,
                  backgroundColor: `${accentColor}20`,
                }}
              >
                {statusLabel}
              </Box>
            </Flex>
          </Flex>
        </Flex>
        <Flex gap={12} className={infoCardClass}>
          <Box className={iconWrapperClass}>
            <HiOutlineGlobeAlt className="h-4 w-4" />
          </Box>
          <Flex direction="column" gap={4} className="min-w-0 flex-1">
            <Text className={labelClass}>{t("registration_website")}</Text>
            <Text className={valueClass}>{websiteValue}</Text>
          </Flex>
        </Flex>
        <Flex gap={12} align="center" className={infoCardClass}>
          <Box className={iconWrapperClass}>
            <HiOutlineDocumentDuplicate className="h-4 w-4" />
          </Box>
          <Flex direction="column" gap={4} className="min-w-0 flex-1">
            <Text className={labelClass}>{t("organization_init_tx_hash")}</Text>
            <Text className={valueClass} title={initTxHash || undefined}>
              {displayInitTxHash}
            </Text>
          </Flex>
          <Tooltip label={t("copy")} withArrow disabled={!canCopyInitTxHash}>
            <ActionIcon
              variant="subtle"
              color="blue"
              disabled={!canCopyInitTxHash}
              onClick={(event) => {
                event.stopPropagation();
                copyToClipboard(initTxHash);
              }}
            >
              <FiCopy />
            </ActionIcon>
          </Tooltip>
        </Flex>
      </Flex>
    </Box>
  );
};
