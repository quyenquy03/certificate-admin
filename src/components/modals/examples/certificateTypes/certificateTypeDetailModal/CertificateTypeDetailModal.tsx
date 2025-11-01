"use client";

import {
  CertificateTypeActiveCard,
  LoadingOverlay,
  Modal,
  type BaseModalProps,
} from "@/components";
import { cn, formatDate } from "@/helpers";
import { CertificateCategoryType } from "@/types";
import { ActionIcon, Box, Flex, Text } from "@mantine/core";
import { useTranslations } from "next-intl";
import { useCallback, useMemo, type ReactNode } from "react";
import { BiCopy } from "react-icons/bi";

type CertificateTypeDetailModalProps = {
  certificateType: CertificateCategoryType | null;
  isLoading?: boolean;
} & Omit<BaseModalProps, "children">;

const normalizeValue = (value?: string | null) => {
  const trimmed = value?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : "";
};

const formatHash = (hash?: string | null) => {
  const normalized = normalizeValue(hash);
  if (!normalized) return "";
  if (normalized.length <= 32) return normalized;
  return `${normalized.slice(0, 16)}...${normalized.slice(-8)}`;
};

export const CertificateTypeDetailModal = ({
  certificateType,
  isLoading = false,
  header,
  ...args
}: CertificateTypeDetailModalProps) => {
  const t = useTranslations();

  const certificateName =
    normalizeValue(certificateType?.name) || t("not_updated");
  const certificateCode =
    normalizeValue(certificateType?.code) || t("not_updated");
  const certificateDescription =
    normalizeValue(certificateType?.description) || t("not_updated");

  const initTxHashRaw = normalizeValue(certificateType?.initTxHash);
  const initTxHashDisplay =
    formatHash(certificateType?.initTxHash) || t("not_updated");

  const createdAtDisplay = certificateType?.createdAt
    ? formatDate(certificateType.createdAt)
    : t("not_updated");
  const updatedAtDisplay = certificateType?.updatedAt
    ? formatDate(certificateType.updatedAt)
    : t("not_updated");

  const headerGradientClass =
    "from-indigo-200 via-indigo-300 to-sky-300 dark:from-indigo-900/40 dark:via-indigo-800/40 dark:to-sky-900/30";
  const headerPrimaryTextClass = "text-indigo-900 dark:text-indigo-100";
  const wrapperBorderClass =
    "border-indigo-100/60 dark:border-indigo-900/40";
  const closeButtonClass =
    "!text-indigo-600 hover:!text-indigo-700 dark:!text-indigo-200";

  const handleCopyHash = useCallback(() => {
    if (!initTxHashRaw) return;
    if (typeof navigator === "undefined" || !navigator.clipboard) return;
    navigator.clipboard.writeText(initTxHashRaw).catch(() => undefined);
  }, [initTxHashRaw]);

  type DetailRowItem =
    | {
        key: string;
        label: string;
        value: string;
        valueClassName?: string;
        layout?: "stack" | "inline";
      }
    | {
        key: string;
        label: string;
        type: "component";
        value: ReactNode;
        valueClassName?: string;
        layout?: "stack" | "inline";
      };

  const detailRows = useMemo(() => {
    const rows: DetailRowItem[][] = [
      [
        {
          key: "name",
          label: t("certificate_type_name"),
          value: certificateName,
        },
      ],
      [
        {
          key: "code",
          label: t("certificate_type_code"),
          value: certificateCode,
        },
      ],
      [
        {
          key: "status",
          label: t("status"),
          type: "component",
          value: (
            <CertificateTypeActiveCard
              isActive={Boolean(certificateType?.isActive)}
            />
          ),
        },
        {
          key: "initTxHash",
          label: t("certificate_type_init_tx_hash"),
          type: "component",
          value: (
            <Flex align="center" gap={8} className="min-w-0">
              <Text
                className="flex-1 min-w-0 truncate text-sm font-medium text-gray-900 dark:text-gray-100"
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
          ),
        },
      ],
      [
        {
          key: "description",
          label: t("certificate_type_description"),
          value: certificateDescription,
          valueClassName:
            "text-sm font-medium text-gray-900 dark:text-gray-100 whitespace-pre-wrap",
        },
      ],
      [
        {
          key: "createdAt",
          label: t("certificate_type_created_at"),
          value: createdAtDisplay,
        },
        {
          key: "updatedAt",
          label: t("certificate_type_updated_at"),
          value: updatedAtDisplay,
        },
      ],
    ];

    return rows;
  }, [
    certificateName,
    certificateCode,
    certificateDescription,
    certificateType?.isActive,
    createdAtDisplay,
    initTxHashDisplay,
    initTxHashRaw,
    t,
    updatedAtDisplay,
    handleCopyHash,
  ]);

  return (
    <Modal
      header={
        header ?? (
          <Text
            className={cn(
              "text-lg font-semibold leading-tight truncate",
              headerPrimaryTextClass
            )}
            title={certificateName}
          >
            {certificateName}
          </Text>
        )
      }
      isLoading={isLoading}
      contentClassNames={{
        wrapper: cn(
          "rounded-md overflow-hidden bg-white dark:bg-dark-7 shadow-xl border",
          wrapperBorderClass
        ),
        headerBox: cn(
          "border-none bg-gradient-to-r px-5 py-4",
          headerGradientClass
        ),
        closeButton: cn(
          "top-3 right-3 bg-white/70 hover:bg-white/90 dark:bg-white/10 dark:hover:bg-white/20 shadow-sm",
          closeButtonClass
        ),
        closeIcon: cn("text-xl", "!text-indigo-600 dark:!text-indigo-200"),
        body: "bg-slate-50 dark:bg-dark-8",
      }}
      {...args}
    >
      <Box className="relative">
        <LoadingOverlay visible={isLoading} />
        <Flex direction="column" gap={12}>
          {detailRows.map((row, rowIndex) => (
            <Flex
              key={rowIndex}
              gap={12}
              direction={row.length > 1 ? "row" : "column"}
              wrap={row.length > 1 ? "wrap" : undefined}
            >
              {row.map((item) => {
                const isInline = item.layout === "inline";
                const isComponent =
                  "type" in item && item.type === "component";

                return (
                  <Box
                    key={item.key}
                    className={`rounded-md border border-gray-200 bg-white px-4 py-3 shadow-sm transition-colors dark:border-gray-700 dark:bg-gray-900/40 ${
                      row.length > 1 ? "flex-1 min-w-[220px]" : ""
                    }`}
                  >
                    {isInline ? (
                      <Flex
                        align="center"
                        justify="space-between"
                        gap={12}
                        className="min-w-0"
                      >
                        <Text className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-300">
                          {item.label}
                        </Text>
                        {isComponent ? (
                          <Box className="shrink-0">{item.value}</Box>
                        ) : (
                          <Text
                            className={
                              item.valueClassName ??
                              "text-sm font-medium text-gray-900 dark:text-gray-100 text-right"
                            }
                          >
                            {item.value}
                          </Text>
                        )}
                      </Flex>
                    ) : (
                      <>
                        <Text className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-300">
                          {item.label}
                        </Text>
                        {isComponent ? (
                          <Box className="mt-2">{item.value}</Box>
                        ) : (
                          <Text
                            className={
                              item.valueClassName ??
                              "mt-2 text-sm font-medium text-gray-900 dark:text-gray-100"
                            }
                          >
                            {item.value}
                          </Text>
                        )}
                      </>
                    )}
                  </Box>
                );
              })}
            </Flex>
          ))}
        </Flex>
      </Box>
    </Modal>
  );
};
