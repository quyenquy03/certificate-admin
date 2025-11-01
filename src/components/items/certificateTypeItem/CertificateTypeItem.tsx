import {
  ButtonMore,
  CertificateTypeActiveCard,
  DropdownMenu,
  DropdownMenuItemProps,
} from "@/components";
import { CertificateCategoryType } from "@/types";
import { ActionIcon, Box, Flex, Text } from "@mantine/core";
import { useTranslations } from "next-intl";
import { useCallback } from "react";
import {
  HiOutlineCheckBadge,
  HiOutlineCubeTransparent,
  HiOutlineDocumentText,
} from "react-icons/hi2";
import { BiCopy, BiShow } from "react-icons/bi";

type CertificateTypeItemProps = {
  certificateType: CertificateCategoryType;
  onViewDetail?: (certificateType: CertificateCategoryType) => void;
};

const normalizeValue = (value?: string | null) => {
  const trimmed = value?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : "";
};

const formatHash = (hash?: string | null) => {
  const normalized = normalizeValue(hash);
  if (!normalized) return "";

  if (normalized.length <= 20) return normalized;
  return `${normalized.slice(0, 12)}...${normalized.slice(-6)}`;
};

export const CertificateTypeItem = ({
  certificateType,
  onViewDetail,
}: CertificateTypeItemProps) => {
  const t = useTranslations();

  const getValueOrFallback = (value?: string | null) =>
    normalizeValue(value) || t("not_updated");

  const certificateName = getValueOrFallback(certificateType.name);
  const certificateCode = getValueOrFallback(certificateType.code);
  const certificateInitial =
    normalizeValue(certificateType.name)?.charAt(0)?.toUpperCase() || "C";

  const accentColor = certificateType.isActive ? "#22C55E" : "#EF4444";

  const initTxHashRaw = normalizeValue(certificateType.initTxHash);
  const initTxHashDisplay =
    formatHash(certificateType.initTxHash) || t("not_updated");

  const handleCopyHash = useCallback(() => {
    if (!initTxHashRaw) return;
    if (typeof navigator === "undefined" || !navigator.clipboard) return;
    navigator.clipboard.writeText(initTxHashRaw).catch(() => undefined);
  }, [initTxHashRaw]);

  const dropdownItems: DropdownMenuItemProps[] = [
    {
      id: "view-detail",
      label: t("view_detail"),
      leftIcon: <BiShow />,
      onClick: () => onViewDetail?.(certificateType),
    },
  ];

  return (
    <Box className="min-h-[360px] relative cursor-pointer rounded-md bg-background-primary-light p-2 text-color-light shadow-md transition-all dark:bg-background-primary-dark dark:text-color-dark dark:shadow-gray-600">
      <Box
        className="absolute inset-x-0 top-0 h-1 w-full rounded-t-md"
        style={{
          background: `linear-gradient(90deg, ${accentColor} 0%, ${accentColor}80 100%)`,
        }}
      />
      <DropdownMenu items={dropdownItems} position="bottom-end">
        <Box className="absolute top-2 right-2 z-10">
          <ButtonMore />
        </Box>
      </DropdownMenu>
      <Flex gap={12} align="center" className="pb-2">
        <Box
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-lg font-semibold uppercase text-white shadow-sm"
          style={{
            background: `linear-gradient(135deg, ${accentColor}1A 0%, ${accentColor} 100%)`,
          }}
        >
          {certificateInitial}
        </Box>
        <Flex direction="column" gap={4} className="min-w-0">
          <Text
            className="truncate text-base font-semibold capitalize text-gray-900 dark:text-gray-50"
            title={certificateName}
          >
            {certificateName}
          </Text>
          <Text
            className="truncate text-xs uppercase text-gray-500 dark:text-gray-300"
            title={certificateCode}
          >
            {certificateCode}
          </Text>
        </Flex>
      </Flex>

      <Flex gap={8} direction="column">
        <Flex
          gap={12}
          className="w-full rounded-md border border-gray-200 px-3 py-3 text-left dark:border-gray-600"
        >
          <Box className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-700/40 dark:text-slate-200">
            <HiOutlineCheckBadge className="h-4 w-4" />
          </Box>
          <Flex
            align="center"
            gap={12}
            justify="space-between"
            className="min-w-0 flex-1"
          >
            <Text className="shrink-0 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-300">
              {t("status")}
            </Text>
            <CertificateTypeActiveCard isActive={certificateType.isActive} />
          </Flex>
        </Flex>

        <Flex
          gap={12}
          className="w-full rounded-md border border-gray-200 px-3 py-3 text-left dark:border-gray-600"
        >
          <Box className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-700/40 dark:text-slate-200">
            <HiOutlineCubeTransparent className="h-4 w-4" />
          </Box>
          <Flex direction="column" gap={6} className="min-w-0 flex-1">
            <Text className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-300">
              {t("certificate_type_init_tx_hash")}
            </Text>
            <Flex align="center" gap={8} className="min-w-0">
              <Text
                className="min-w-0 flex-1 truncate text-sm font-medium text-gray-900 dark:text-gray-100"
                title={initTxHashRaw || initTxHashDisplay}
              >
                {initTxHashDisplay}
              </Text>
              {initTxHashRaw && (
                <ActionIcon
                  variant="subtle"
                  size="sm"
                  onClick={handleCopyHash}
                  title={t("copy")}
                >
                  <BiCopy className="h-4 w-4" />
                </ActionIcon>
              )}
            </Flex>
          </Flex>
        </Flex>

        <Flex
          gap={12}
          className="w-full rounded-md border border-gray-200 px-3 py-3 text-left dark:border-gray-600"
        >
          <Box className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-700/40 dark:text-slate-200">
            <HiOutlineDocumentText className="h-4 w-4" />
          </Box>
          <Flex direction="column" gap={6} className="min-w-0 flex-1">
            <Text className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-300">
              {t("certificate_type_description")}
            </Text>
            <Text
              className="line-clamp-3 text-sm font-medium text-gray-900 dark:text-gray-100 whitespace-pre-line"
              title={normalizeValue(certificateType.description) || undefined}
            >
              {getValueOrFallback(certificateType.description)}
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
};
