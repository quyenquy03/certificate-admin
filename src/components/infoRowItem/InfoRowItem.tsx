import { useCopyToClipboard } from "@/hooks";
import { ActionIcon, Box, Flex, Text, Tooltip } from "@mantine/core";
import { useTranslations } from "next-intl";
import React, { useMemo } from "react";
import { IconType } from "react-icons";
import { FiCopy } from "react-icons/fi";

type InfoRowItemProps = {
  label?: string;
  value?: string | number | null;
  showCopyButton?: boolean;
  disabledCopyButton?: boolean;
  icon?: IconType;
};

export const InfoRowItem = ({
  label,
  value,
  showCopyButton,
  disabledCopyButton,
  icon,
}: InfoRowItemProps) => {
  const t = useTranslations();
  const { handleCopy, isCopied } = useCopyToClipboard();
  const Icon = useMemo(() => {
    if (!icon) return null;
    return icon;
  }, [icon]);
  return (
    <Flex
      gap={8}
      align="center"
      className="rounded-lg border border-slate-200 px-3 py-3 dark:border-slate-700"
    >
      {Icon && (
        <Box className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-800/60 dark:text-slate-200">
          <Icon className="h-4 w-4" />
        </Box>
      )}
      <Flex direction="column" gap={4} className="flex-1 min-w-0">
        <Text className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          {label}
        </Text>
        <Text className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
          {value}
        </Text>
      </Flex>
      {showCopyButton && (
        <Tooltip
          label={isCopied ? t("copied") : t("copy")}
          withArrow
          disabled={disabledCopyButton}
        >
          <ActionIcon
            variant="subtle"
            color="blue"
            disabled={disabledCopyButton}
            onClick={(e) => {
              e.stopPropagation();
              handleCopy(value);
            }}
          >
            <FiCopy />
          </ActionIcon>
        </Tooltip>
      )}
    </Flex>
  );
};
