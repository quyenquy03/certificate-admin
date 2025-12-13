"use client";

import { Modal, type BaseModalProps } from "@/components/modals/bases";
import { Box, Stack, Text, Textarea, ThemeIcon } from "@mantine/core";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { PiProhibitBold } from "react-icons/pi";

type RevokeCertificateModalProps = {
  certificateCode?: string | null;
  onConfirm: (reason: string) => void;
} & Omit<BaseModalProps, "onConfirm">;

export const RevokeCertificateModal = ({
  certificateCode,
  opened = false,
  onClose,
  onConfirm,
  isLoading,
  ...args
}: RevokeCertificateModalProps) => {
  const t = useTranslations();
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  const displayCode = certificateCode?.trim() || t("not_updated");
  const confirmationMessage = t("revoke_certificate_confirmation", {
    code: displayCode,
  });

  const handleClose = () => {
    setReason("");
    setError("");
    onClose?.();
  };

  const handleConfirm = () => {
    const trimmedReason = reason.trim();
    if (!trimmedReason) {
      setError(t("revoke_reason_required"));
      return;
    }
    onConfirm(trimmedReason);
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      onConfirm={handleConfirm}
      header={t("revoke_certificate_title")}
      footerProps={{
        showFooter: true,
        confirmText: t("revoke"),
        cancelText: t("cancel"),
      }}
      contentClassNames={{
        wrapper:
          "rounded-2xl overflow-hidden bg-white dark:bg-dark-7 shadow-xl border border-red-100/60 dark:border-red-900/30",
        headerBox:
          "border-none bg-gradient-to-r from-rose-200 via-rose-300 to-amber-200 px-5 py-3",
        headerTitle:
          "text-center text-lg font-semibold text-rose-900 dark:text-rose-100 tracking-wide",
        closeButton:
          "top-3 right-3 bg-white/60 hover:bg-white/70 text-rose-600 dark:bg-white/10 dark:text-rose-100 shadow-sm",
        closeIcon: "text-xl",
        footerBox: "border-none bg-red-50/80 px-5 py-3 dark:bg-dark-6",
        footerActions: "justify-end gap-3",
        cancelButton:
          "border-red-200 text-red-600 hover:bg-rose-50 dark:border-red-900/40 dark:text-red-300 dark:hover:bg-red-900/20",
        confirmButton: "bg-rose-600 hover:bg-rose-500",
      }}
      radius="lg"
      size="md"
      isLoading={isLoading}
      {...args}
    >
      <Stack gap="md" className="px-1">
        <Stack gap={12} align="center">
          <ThemeIcon
            radius="xl"
            size={64}
            color="red"
            variant="light"
            className="shadow-inner"
          >
            <PiProhibitBold className="text-3xl" />
          </ThemeIcon>
          <Text
            ta="center"
            className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed"
          >
            {confirmationMessage}
          </Text>
        </Stack>
        <Box className="rounded-lg border border-red-100/70 bg-red-50/80 px-4 py-3 text-center dark:border-red-900/40 dark:bg-red-950/40">
          <Text fw={600} className="text-sm text-red-600 dark:text-red-300">
            {displayCode}
          </Text>
        </Box>
        <Textarea
          minRows={4}
          autosize
          label={t("revoke_reason_label")}
          placeholder={t("revoke_reason_placeholder")}
          value={reason}
          onChange={(event) => {
            setReason(event.currentTarget.value);
            if (error) setError("");
          }}
          error={error}
          classNames={{
            label: "text-sm font-medium text-gray-700 dark:text-gray-200 mb-2",
            input:
              "rounded-lg border border-red-100/70 focus:border-rose-300 focus:ring-2 focus:ring-rose-200/80 bg-white dark:bg-dark-6 dark:border-dark-5 dark:text-gray-100 transition-all",
          }}
        />
      </Stack>
    </Modal>
  );
};
