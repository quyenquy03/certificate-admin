"use client";

import { Modal, type BaseModalProps } from "@/components/modals/bases";
import { CERTIFICATE_STATUSES } from "@/enums";
import { CertificateResponseType } from "@/types";
import { formatDate } from "@/helpers";
import { Badge, Box, Flex, Text, ActionIcon } from "@mantine/core";
import { useTranslations } from "next-intl";
import { FiCopy } from "react-icons/fi";
import { HiOutlineQrCode } from "react-icons/hi2";
import {
  PiEnvelopeSimple,
  PiCalendarCheck,
  PiTrafficConeThin,
  PiShieldCheck,
} from "react-icons/pi";

type CertificateDetailModalProps = {
  certificate: CertificateResponseType | null;
} & Omit<BaseModalProps, "children">;

const getDisplayValue = (value?: string | null, fallback?: string) => {
  const trimmed = value?.trim();
  if (trimmed && trimmed.length > 0) return trimmed;
  return fallback ?? "";
};

export const CertificateDetailModal = ({
  certificate,
  opened,
  onClose,
  ...props
}: CertificateDetailModalProps) => {
  const t = useTranslations();

  const author = certificate?.authorProfile;
  const authorName = getDisplayValue(author?.authorName, t("not_updated"));
  const authorEmail = getDisplayValue(author?.authorEmail, t("not_updated"));
  const authorIdCard = getDisplayValue(author?.authorIdCard, t("not_updated"));
  const authorDob =
    (author?.authorDob && formatDate(author.authorDob)) ?? t("not_updated");

  const copyToClipboard = async (value?: string | null) => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
    } catch (error) {
      console.error("copy_error", error);
    }
  };

  const renderCopyableRow = (
    label: string,
    value?: string | null,
    options?: { allowCopy?: boolean }
  ) => {
    const displayValue = getDisplayValue(value, t("not_updated"));
    const allowCopy = options?.allowCopy && !!value && value.trim().length > 0;

    return (
      <Flex
        gap={8}
        align="center"
        className="rounded-lg border border-slate-200 px-3 py-3 dark:border-slate-700"
      >
        <Flex direction="column" gap={4} className="flex-1 min-w-0">
          <Text className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {label}
          </Text>
          <Text className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
            {displayValue}
          </Text>
        </Flex>
        {allowCopy && (
          <ActionIcon
            variant="subtle"
            color="blue"
            onClick={() => copyToClipboard(value)}
          >
            <FiCopy />
          </ActionIcon>
        )}
      </Flex>
    );
  };

  if (!certificate) {
    return (
      <Modal
        opened={opened}
        onClose={onClose}
        header={t("certificate_detail")}
        {...props}
      >
        <Text className="text-sm text-slate-500 dark:text-slate-400">
          {t("not_updated")}
        </Text>
      </Modal>
    );
  }

  const summaryItems = [
    {
      key: "code",
      label: t("certificate_code"),
      value: certificate.code ? `${certificate.code}` : t("not_updated"),
      allowCopy: Boolean(certificate.code),
    },
    {
      key: "hash",
      label: t("certificate_hash"),
      value:
        getDisplayValue(certificate.certificateHash, t("not_updated")) ?? "",
      allowCopy: Boolean(certificate.certificateHash),
    },
    {
      key: "certificateType",
      label: t("certificate_type_name"),
      value:
        getDisplayValue(certificate.certificateType?.name, t("not_updated")) ??
        "",
    },
  ];

  const txItems = [
    {
      key: "signed",
      label: t("signed_tx_hash"),
      value: certificate.signedTxHash,
    },
    {
      key: "approved",
      label: t("approved_tx_hash"),
      value: certificate.approvedTxHash,
    },
    {
      key: "revoked",
      label: t("revoked_tx_hash"),
      value: certificate.revokedTxHash,
    },
  ];

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      header={t("certificate_detail")}
      size="lg"
      {...props}
    >
      <Flex direction="column" gap={12}>
        <Box className="space-y-3 rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900/60">
          <Text className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {t("certificate_summary")}
          </Text>
          <Flex gap={8} wrap="wrap">
            {summaryItems.map((item) => (
              <Flex
                key={item.key}
                gap={8}
                className="flex-1 min-w-[180px] rounded-lg border border-slate-200 px-3 py-2 dark:border-slate-700"
              >
                <Flex direction="column" gap={2} className="min-w-0 flex-1">
                  <Text className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    {item.label}
                  </Text>
                  <Text className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
                    {item.value}
                  </Text>
                </Flex>
                {item.allowCopy && (
                  <ActionIcon
                    variant="subtle"
                    color="blue"
                    onClick={() => copyToClipboard(item.value)}
                  >
                    <FiCopy />
                  </ActionIcon>
                )}
              </Flex>
            ))}
            <Flex
              gap={8}
              className="flex-1 min-w-[180px] rounded-lg border border-slate-200 px-3 py-2 dark:border-slate-700"
            >
              <Flex direction="column" gap={2} className="min-w-0 flex-1">
                <Text className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  {t("valid_period")}
                </Text>
                <Text className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  {(formatDate(certificate.validFrom) || t("not_updated")) +
                    " - " +
                    (formatDate(certificate.validTo) || t("not_updated"))}
                </Text>
              </Flex>
            </Flex>
          </Flex>
        </Box>

        <Box className="space-y-3 rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900/60">
          <Text className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {t("certificate_author_section")}
          </Text>
          {renderCopyableRow(t("author_name"), authorName)}
          {renderCopyableRow(t("author_id_card"), authorIdCard, {
            allowCopy: Boolean(author?.authorIdCard),
          })}
          {renderCopyableRow(t("email"), authorEmail, {
            allowCopy: Boolean(author?.authorEmail),
          })}
          {renderCopyableRow(t("birthday"), authorDob)}
        </Box>

        <Flex gap={10}>
          <Box className="flex-1 space-y-3 rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900/60">
            <Text className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              {t("certificate_transactions_section")}
            </Text>
            {txItems.map((tx) => (
              <Flex
                key={tx.key}
                gap={8}
                align="center"
                className="rounded-lg border border-slate-200 px-3 py-2 dark:border-slate-700"
              >
                <Box className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-800/60 dark:text-slate-200">
                  <HiOutlineQrCode className="h-4 w-4" />
                </Box>
                <Flex direction="column" gap={2} className="min-w-0 flex-1">
                  <Text className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    {tx.label}
                  </Text>
                  <Text className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
                    {getDisplayValue(tx.value, t("not_updated"))}
                  </Text>
                </Flex>
                <ActionIcon
                  variant="subtle"
                  color="blue"
                  disabled={!tx.value}
                  onClick={() => tx.value && copyToClipboard(tx.value)}
                >
                  <FiCopy />
                </ActionIcon>
              </Flex>
            ))}
          </Box>
        </Flex>
      </Flex>
    </Modal>
  );
};
