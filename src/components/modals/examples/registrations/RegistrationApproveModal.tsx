"use client";

import { Modal, type BaseModalProps } from "@/components/modals/bases";
import { useApproveRegistration } from "@/mutations";
import { BaseErrorType, RegistrationResponseType } from "@/types";
import { Box, Stack, Text, ThemeIcon } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { isAxiosError } from "axios";
import { useTranslations } from "next-intl";
import { Fragment, useMemo } from "react";
import { PiCheckCircleBold } from "react-icons/pi";

type RegistrationApproveModalProps = {
  registration: RegistrationResponseType | null;
  refetchListRegistrations?: () => void;
} & Omit<BaseModalProps, "onConfirm" | "isLoading">;

export const RegistrationApproveModal = ({
  registration,
  opened = false,
  onClose,
  refetchListRegistrations,
  ...args
}: RegistrationApproveModalProps) => {
  const t = useTranslations();
  const organizationName = registration?.organizationName ?? t("not_updated");
  const confirmationMessage = useMemo(() => {
    const confirmation = t("registration_approve_confirmation", {
      organizationName,
    });

    if (!organizationName || !confirmation.includes(organizationName)) {
      return confirmation;
    }

    const fragments = confirmation.split(organizationName);

    return fragments.map((part, index) => (
      <Fragment key={`approve-confirmation-${index}`}>
        {part}
        {index < fragments.length - 1 && (
          <Text
            span
            fw={600}
            className="text-emerald-600 dark:text-emerald-300"
          >
            {organizationName}
          </Text>
        )}
      </Fragment>
    ));
  }, [organizationName, t]);

  const { mutate: approveRegistration, isPending } = useApproveRegistration({
    onSuccess: () => {
      notifications.show({
        title: t("approve_registration_success_title"),
        message: t("approve_registration_success_desc"),
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
        title: t("approve_registration_fail"),
        message,
        color: "red",
      });
    },
  });

  const handleConfirm = () => {
    if (!registration) return;
    approveRegistration(registration.id);
  };

  const handleClose = () => {
    onClose?.();
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      onConfirm={handleConfirm}
      header={t("registration_approve_title")}
      footerProps={{
        showFooter: true,
        confirmText: t("approve"),
        cancelText: t("cancel"),
      }}
      contentClassNames={{
        wrapper:
          "rounded-2xl overflow-hidden bg-white dark:bg-dark-7 shadow-xl border border-emerald-100/60 dark:border-emerald-900/40",
        headerBox:
          "border-none bg-gradient-to-r from-emerald-200 via-emerald-300 to-teal-300 px-5 py-3",
        headerTitle:
          "text-center text-lg font-semibold text-emerald-900 dark:text-emerald-100 tracking-wide",
        closeButton:
          "top-3 right-3 bg-white/60 hover:bg-white/70 text-emerald-600 dark:bg-white/10 dark:text-emerald-100 shadow-sm",
        closeIcon: "text-xl",
        footerBox: "border-none bg-emerald-50/70 px-5 py-3 dark:bg-dark-6",
        footerActions: "justify-end gap-3",
        cancelButton:
          "border-emerald-200 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-800/60 dark:text-emerald-200",
        confirmButton: "bg-emerald-600 hover:bg-emerald-500",
      }}
      radius="lg"
      size="md"
      isLoading={isPending}
      {...args}
      {...args}
    >
      <Stack gap="md" className="px-1">
        <Stack gap={12} align="center">
          <ThemeIcon
            radius="xl"
            size={64}
            color="teal"
            variant="light"
            className="shadow-inner"
          >
            <PiCheckCircleBold className="text-3xl" />
          </ThemeIcon>
          <Text
            ta="center"
            className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed"
          >
            {confirmationMessage}
          </Text>
        </Stack>
        <Box className="rounded-lg border border-emerald-100/70 bg-emerald-50/80 px-4 py-3 text-center dark:border-emerald-900/40 dark:bg-emerald-950/40">
          <Text
            fw={600}
            className="text-sm text-emerald-700 dark:text-emerald-300"
          >
            {organizationName}
          </Text>
        </Box>
      </Stack>
    </Modal>
  );
};
