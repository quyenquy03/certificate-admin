"use client";

import { Modal, type BaseModalProps } from "@/components/modals/bases";
import { useRejectRegistration } from "@/mutations";
import { BaseErrorType, RegistrationResponseType } from "@/types";
import { Box, Stack, Text, Textarea, ThemeIcon } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useTranslations } from "next-intl";
import { Fragment, useMemo, useState } from "react";
import { isAxiosError } from "axios";
import { PiWarningCircleBold } from "react-icons/pi";

type RegistrationRejectModalProps = {
  registration: RegistrationResponseType | null;
  refetchListRegistrations?: () => void;
} & Omit<BaseModalProps, "onConfirm" | "isLoading">;

export const RegistrationRejectModal = ({
  registration,
  opened = false,
  onClose,
  refetchListRegistrations,
  ...args
}: RegistrationRejectModalProps) => {
  const t = useTranslations();
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  const organizationName = registration?.organizationName ?? t("not_updated");
  const confirmationMessage = useMemo(() => {
    const confirmation = t("registration_reject_confirmation");

    if (!organizationName || !confirmation.includes(organizationName)) {
      return confirmation;
    }

    const fragments = confirmation.split(organizationName);

    return fragments.map((part, index) => (
      <Fragment key={`reject-confirmation-${index}`}>
        {part}
        {index < fragments.length - 1 && (
          <Text span fw={600} className="text-red-600 dark:text-red-300">
            {organizationName}
          </Text>
        )}
      </Fragment>
    ));
  }, [organizationName, t]);

  const { mutate: rejectRegistration, isPending } = useRejectRegistration({
    onSuccess: () => {
      notifications.show({
        title: t("reject_registration_success_title"),
        message: t("reject_registration_success_desc"),
        color: "green",
      });
      refetchListRegistrations?.();
      handleClose();
    },
    onError: (error) => {
      let message = t("common_error_message");

      if (isAxiosError<BaseErrorType>(error)) {
        const code = error.response?.data?.code;
        message = t(code || "common_error_message");
      }

      notifications.show({
        title: t("reject_registration_fail"),
        message,
        color: "red",
      });
    },
  });

  const handleConfirm = () => {
    const trimmedReason = reason.trim();

    if (!registration) return;

    if (!trimmedReason) {
      setError(t("reject_reason_required"));
      return;
    }

    rejectRegistration({ id: registration.id, rejectReason: trimmedReason });
  };

  const handleClose = () => {
    setReason("");
    setError("");
    onClose?.();
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      onConfirm={handleConfirm}
      header={t("registration_reject_title")}
      footerProps={{
        showFooter: true,
        confirmText: t("reject"),
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
      isLoading={isPending}
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
            <PiWarningCircleBold className="text-3xl" />
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
            {organizationName}
          </Text>
        </Box>
        <Textarea
          minRows={4}
          autosize
          label={t("reject_reason")}
          placeholder={t("reject_reason_placeholder")}
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
