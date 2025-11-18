"use client";

import { Modal, type BaseModalProps } from "@/components/modals/bases";
import { LoadingOverlay, OrganizationStatusCard } from "@/components";
import { cn, formatDate } from "@/helpers";
import { ORGANIZATION_STATUSES } from "@/enums";
import { RegistrationResponseType } from "@/types";
import { ActionIcon, Box, Button, Flex, Text } from "@mantine/core";
import { useTranslations } from "next-intl";
import { BiCopy } from "react-icons/bi";
import { ReactNode } from "react";
import { COUNTRY_LABELS } from "@/constants";

type RegistrationDetailModalProps = {
  registration: RegistrationResponseType | null;
  onApprove?: (registration: RegistrationResponseType) => void;
  onReject?: (registration: RegistrationResponseType) => void;
  isLoading?: boolean;
} & Omit<BaseModalProps, "children">;

const getDisplayValue = (value?: string | null, fallback?: string) => {
  const trimmed = value?.trim();
  if (trimmed && trimmed.length > 0) return trimmed;
  return fallback ?? "";
};

export const RegistrationDetailModal = ({
  registration,
  header,
  opened = false,
  onApprove,
  onReject,
  isLoading = false,
  ...args
}: RegistrationDetailModalProps) => {
  const t = useTranslations();

  const organizationName =
    getDisplayValue(registration?.organizationName) || t("not_updated");
  const registrantName = [
    getDisplayValue(registration?.ownerFirstName),
    getDisplayValue(registration?.ownerLastName),
  ]
    .filter(Boolean)
    .join(" ");

  const detailItems = [
    {
      key: "registrant",
      label: t("registration_registrant"),
      value: registrantName || t("not_updated"),
    },
    {
      key: "email",
      label: t("email"),
      value: getDisplayValue(registration?.email, t("not_updated")),
    },
    {
      key: "phoneNumber",
      label: t("phone"),
      value: getDisplayValue(registration?.phoneNumber, t("not_updated")),
    },
    {
      key: "organizationName",
      label: t("registration_organization_name"),
      value: organizationName,
    },
    {
      key: "walletAddress",
      label: t("registration_wallet_address"),
      value: getDisplayValue(registration?.walletAddress, t("not_updated")),
    },
    {
      key: "website",
      label: t("registration_website"),
      value: getDisplayValue(registration?.website, t("not_updated")),
    },
    {
      key: "countryCode",
      label: t("registration_country"),
      value: getDisplayValue(registration?.countryCode, t("not_updated")),
    },
    {
      key: "createdAt",
      label: t("registration_created_at"),
      value:
        (registration?.createdAt && formatDate(registration.createdAt)) ||
        t("not_updated"),
    },
    {
      key: "updatedAt",
      label: t("registration_updated_at"),
      value:
        (registration?.updatedAt && formatDate(registration.updatedAt)) ||
        t("not_updated"),
    },
  ];

  const isPending = registration?.status === ORGANIZATION_STATUSES.PENDING;
  const isRejected = registration?.status === ORGANIZATION_STATUSES.REJECTED;
  const showFooterActions = isPending && !isLoading;

  const handleApprove = () => {
    if (registration && onApprove) {
      onApprove(registration);
    }
  };

  const handleReject = () => {
    if (registration && onReject) {
      onReject(registration);
    }
  };

  const detailCardClass =
    "rounded-md border border-gray-200 bg-white p-3 shadow-sm transition-colors dark:border-gray-700 dark:bg-gray-900/40";
  const sectionWrapperClass =
    "space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/40";

  const renderInfoCard = (
    key: string,
    label: string,
    value: string,
    options?: {
      valueClassName?: string;
      customContent?: ReactNode;
    }
  ) => (
    <Box key={key} className={detailCardClass}>
      <Text className="text-xs font-semibold text-gray-500 dark:text-gray-300">
        {label}
      </Text>
      {options?.customContent ?? (
        <Text
          className={cn(
            "mt-1 text-sm font-medium text-gray-900 dark:text-gray-100",
            options?.valueClassName
          )}
        >
          {value}
        </Text>
      )}
    </Box>
  );

  const walletAddressValue = getDisplayValue(
    registration?.walletAddress,
    t("not_updated")
  );

  const handleCopyWalletAddress = () => {
    if (!registration?.walletAddress) return;
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(registration.walletAddress).catch(() => {});
    }
  };

  return (
    <Modal
      opened={opened}
      header={header ?? t("registration_detail_title")}
      footerProps={{ showFooter: showFooterActions }}
      footer={
        showFooterActions ? (
          <Flex
            align="center"
            justify="flex-end"
            className="w-full px-3 py-2"
            gap={8}
          >
            <Button
              variant="outline"
              color="red"
              size="xs"
              onClick={handleReject}
              disabled={!registration || !onReject}
            >
              {t("reject")}
            </Button>
            <Button
              size="xs"
              onClick={handleApprove}
              disabled={!registration || !onApprove}
            >
              {t("approve")}
            </Button>
          </Flex>
        ) : undefined
      }
      contentClassNames={{
        wrapper:
          "rounded-2xl overflow-hidden bg-white dark:bg-dark-7 shadow-xl border border-indigo-100/60 dark:border-indigo-900/40",
        headerBox:
          "border-none bg-gradient-to-r from-indigo-200 via-indigo-300 to-sky-300 px-5 py-3",
        headerTitle:
          "text-center text-lg font-semibold text-indigo-900 dark:text-indigo-50 tracking-wide",
        closeButton:
          "top-3 right-3 bg-white/70 hover:bg-white text-indigo-600 dark:bg-white/10 dark:text-indigo-100 shadow-sm",
        closeIcon: "text-xl",
        footerBox: showFooterActions
          ? "border-none bg-indigo-50/80 px-4 py-1 dark:bg-indigo-900/30"
          : undefined,
        footerActions: "justify-end gap-3",
        cancelButton:
          "border-indigo-200 text-indigo-700 hover:bg-indigo-100 dark:border-indigo-800/60 dark:text-indigo-200",
        confirmButton: "bg-indigo-600 hover:bg-indigo-500",
      }}
      radius="lg"
      {...args}
    >
      <LoadingOverlay
        visible={isLoading}
        overlayProps={{ blur: 5, backgroundOpacity: 0.7 }}
      />
      <Box className="relative">
        <Flex direction="column" gap={16}>
          <Flex
            align="center"
            justify="space-between"
            className={`${detailCardClass} px-4 py-3`}
          >
            <Text className="text-xs font-semibold text-gray-500 dark:text-gray-300">
              {t("status")}
            </Text>
            {registration?.status ? (
              <OrganizationStatusCard status={registration.status} />
            ) : (
              <Text className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {t("not_updated")}
              </Text>
            )}
          </Flex>

          {isRejected && (
            <Box className={detailCardClass}>
              <Text className="text-xs font-semibold text-gray-500 dark:text-gray-300">
                {t("reject_reason")}
              </Text>
              <Text className="mt-1 text-sm font-medium text-gray-900 dark:text-gray-100">
                {getDisplayValue(registration?.rejectReason, t("not_updated"))}
              </Text>
            </Box>
          )}

          <Box className={sectionWrapperClass}>
            <Text className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-300">
              {t("registration_personal_section_title")}
            </Text>
            <div className="space-y-3">
              {renderInfoCard(
                "registrant",
                t("registration_registrant"),
                registrantName || t("not_updated")
              )}
              {renderInfoCard(
                "email",
                t("email"),
                getDisplayValue(registration?.email, t("not_updated"))
              )}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {renderInfoCard(
                  "phoneNumber",
                  t("phone"),
                  getDisplayValue(registration?.phoneNumber, t("not_updated"))
                )}
                {renderInfoCard(
                  "walletAddress",
                  t("registration_wallet_address"),
                  walletAddressValue,
                  {
                    customContent: (
                      <Flex align="center" gap={8} className="pt-1">
                        <Text className="flex-1 min-w-0 truncate text-sm font-medium text-gray-900 dark:text-gray-100">
                          {walletAddressValue}
                        </Text>
                        {registration?.walletAddress && (
                          <ActionIcon
                            size="sm"
                            variant="subtle"
                            onClick={handleCopyWalletAddress}
                            title={t("copy")}
                          >
                            <BiCopy />
                          </ActionIcon>
                        )}
                      </Flex>
                    ),
                  }
                )}
              </div>
            </div>
          </Box>

          <Box className={sectionWrapperClass}>
            <Text className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-300">
              {t("registration_organization_section_title")}
            </Text>
            <div className="space-y-3">
              {renderInfoCard(
                "organizationName",
                t("registration_organization_name"),
                organizationName,
                { valueClassName: "truncate" }
              )}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {renderInfoCard(
                  "website",
                  t("registration_website"),
                  getDisplayValue(registration?.website, t("not_updated")),
                  { valueClassName: "truncate" }
                )}
                {renderInfoCard(
                  "countryCode",
                  t("registration_country"),
                  getDisplayValue(
                    registration?.countryCode
                      ? t(COUNTRY_LABELS[registration?.countryCode])
                      : "",
                    t("not_updated")
                  )
                )}
              </div>
              <Box className={detailCardClass}>
                <Text className="text-xs font-semibold text-gray-500 dark:text-gray-300">
                  {t("registration_description")}
                </Text>
                <Text className="mt-1 text-sm font-medium text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
                  {getDisplayValue(
                    registration?.organizationDescription,
                    t("not_updated")
                  )}
                </Text>
              </Box>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {renderInfoCard(
                  "createdAt",
                  t("registration_created_at"),
                  detailItems.find((item) => item.key === "createdAt")?.value ??
                    t("not_updated")
                )}
                {renderInfoCard(
                  "updatedAt",
                  t("registration_updated_at"),
                  detailItems.find((item) => item.key === "updatedAt")?.value ??
                    t("not_updated")
                )}
              </div>
            </div>
          </Box>
        </Flex>
      </Box>
    </Modal>
  );
};
