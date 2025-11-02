"use client";

import { cn } from "@/helpers";
import { BaseModalProps, Modal } from "@/components/modals/bases";
import { Box, Stack, Text, ThemeIcon } from "@mantine/core";
import { useTranslations } from "next-intl";
import { Fragment, ReactNode, useMemo } from "react";
import {
  PiCheckCircleBold,
  PiProhibitBold,
  PiWarningCircleBold,
} from "react-icons/pi";

export type ConfirmationModalType = "delete" | "activate" | "deactivate";

type ConfirmationModalProps = {
  type: ConfirmationModalType;
  title?: string;
  itemName?: string | null;
  description?: string;
  icon?: ReactNode;
  className?: string;
} & Omit<
  BaseModalProps,
  | "children"
  | "header"
  | "footer"
  | "footerProps"
  | "contentClassNames"
  | "onConfirm"
  | "onClose"
  | "isLoading"
> & {
    onConfirm?: () => void;
    onClose: () => void;
    isLoading?: boolean;
  };

const TYPE_STYLES: Record<
  ConfirmationModalType,
  {
    titleKey: string;
    messageKey: string;
    confirmTextKey: string;
    themeIconColor: string;
    headerGradientClass: string;
    headerTitleClass: string;
    wrapperBorderClass: string;
    closeButtonClass: string;
    closeIconClass: string;
    footerBoxClass: string;
    cancelButtonClass: string;
    confirmButtonClass: string;
    accentBoxClass: string;
    accentTextClass: string;
    highlightTextClass: string;
    icon: ReactNode;
  }
> = {
  delete: {
    titleKey: "certificate_type_delete_confirmation_title",
    messageKey: "certificate_type_delete_confirmation_desc",
    confirmTextKey: "delete",
    themeIconColor: "red",
    headerGradientClass:
      "from-rose-200 via-rose-300 to-amber-200 dark:from-rose-900/40 dark:via-rose-800/40 dark:to-amber-900/30",
    headerTitleClass: "text-rose-900 dark:text-rose-100",
    wrapperBorderClass:
      "border-red-100/60 dark:border-red-900/30 bg-white dark:bg-dark-7",
    closeButtonClass:
      "top-3 right-3 bg-white/60 hover:bg-white/70 text-rose-600 dark:bg-white/10 dark:text-rose-100 shadow-sm",
    closeIconClass: "text-xl",
    footerBoxClass: "border-none bg-red-50/80 px-5 py-3 dark:bg-dark-6",
    cancelButtonClass:
      "border-red-200 text-red-600 hover:bg-rose-50 dark:border-red-900/40 dark:text-red-300 dark:hover:bg-red-900/20",
    confirmButtonClass: "bg-rose-600 hover:bg-rose-500",
    accentBoxClass:
      "rounded-lg border border-red-100/70 bg-red-50/80 px-4 py-3 text-center dark:border-red-900/40 dark:bg-red-950/40",
    accentTextClass: "text-red-600 dark:text-red-300",
    highlightTextClass: "text-red-600 dark:text-red-300 font-semibold",
    icon: <PiWarningCircleBold className="text-3xl" />,
  },
  activate: {
    titleKey: "certificate_type_activate_confirmation_title",
    messageKey: "certificate_type_activate_confirmation_desc",
    confirmTextKey: "activate",
    themeIconColor: "teal",
    headerGradientClass:
      "from-emerald-200 via-teal-200 to-sky-200 dark:from-emerald-900/40 dark:via-teal-900/40 dark:to-sky-900/30",
    headerTitleClass: "text-emerald-900 dark:text-emerald-100",
    wrapperBorderClass:
      "border-emerald-100/60 dark:border-emerald-900/30 bg-white dark:bg-dark-7",
    closeButtonClass:
      "top-3 right-3 bg-white/60 hover:bg-white/70 text-emerald-600 dark:bg-white/10 dark:text-emerald-100 shadow-sm",
    closeIconClass: "text-xl",
    footerBoxClass: "border-none bg-emerald-50/80 px-5 py-3 dark:bg-dark-6",
    cancelButtonClass:
      "border-emerald-200 text-emerald-600 hover:bg-emerald-50 dark:border-emerald-900/40 dark:text-emerald-200 dark:hover:bg-emerald-900/20",
    confirmButtonClass: "bg-emerald-600 hover:bg-emerald-500",
    accentBoxClass:
      "rounded-lg border border-emerald-100/70 bg-emerald-50/80 px-4 py-3 text-center dark:border-emerald-900/40 dark:bg-emerald-950/40",
    accentTextClass: "text-emerald-600 dark:text-emerald-200",
    highlightTextClass: "text-emerald-600 dark:text-emerald-200 font-semibold",
    icon: <PiCheckCircleBold className="text-3xl" />,
  },
  deactivate: {
    titleKey: "certificate_type_deactivate_confirmation_title",
    messageKey: "certificate_type_deactivate_confirmation_desc",
    confirmTextKey: "deactivate",
    themeIconColor: "orange",
    headerGradientClass:
      "from-amber-200 via-orange-200 to-rose-200 dark:from-amber-900/40 dark:via-orange-900/40 dark:to-rose-900/30",
    headerTitleClass: "text-amber-900 dark:text-amber-100",
    wrapperBorderClass:
      "border-amber-100/60 dark:border-amber-900/30 bg-white dark:bg-dark-7",
    closeButtonClass:
      "top-3 right-3 bg-white/60 hover:bg-white/70 text-amber-600 dark:bg-white/10 dark:text-amber-100 shadow-sm",
    closeIconClass: "text-xl",
    footerBoxClass: "border-none bg-amber-50/80 px-5 py-3 dark:bg-dark-6",
    cancelButtonClass:
      "border-amber-200 text-amber-600 hover:bg-amber-50 dark:border-amber-900/40 dark:text-amber-200 dark:hover:bg-amber-900/20",
    confirmButtonClass: "bg-amber-600 hover:bg-amber-500",
    accentBoxClass:
      "rounded-lg border border-amber-100/70 bg-amber-50/80 px-4 py-3 text-center dark:border-amber-900/40 dark:bg-amber-950/40",
    accentTextClass: "text-amber-600 dark:text-amber-200",
    highlightTextClass: "text-amber-600 dark:text-amber-200 font-semibold",
    icon: <PiProhibitBold className="text-3xl" />,
  },
};

export const ConfirmationModal = ({
  type,
  title,
  itemName,
  description,
  onConfirm,
  onClose,
  opened = false,
  isLoading,
  icon,
  className,
  ...args
}: ConfirmationModalProps) => {
  const t = useTranslations();
  const config = TYPE_STYLES[type];

  const displayName = itemName?.toString().trim() ?? "";
  const fallbackName = displayName || t("not_updated");
  const heading =
    typeof title === "string" && title.trim().length > 0
      ? title
      : t(config.titleKey);
  const descriptionText =
    typeof description === "string" && description.trim().length > 0
      ? description
      : t(config.messageKey, {
          name: fallbackName,
        });

  const messageContent = useMemo(() => {
    if (!displayName || !descriptionText.includes(displayName)) {
      return descriptionText;
    }

    const fragments = descriptionText.split(displayName);

    return fragments.map((part, index) => (
      <Fragment key={`confirmation-message-${index}`}>
        {part}
        {index < fragments.length - 1 && (
          <Text span className={config.highlightTextClass}>
            {displayName}
          </Text>
        )}
      </Fragment>
    ));
  }, [config.highlightTextClass, descriptionText, displayName]);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      onConfirm={onConfirm}
      isLoading={isLoading}
      header={
        <Text
          className={cn(
            "text-center text-lg font-semibold tracking-wide",
            config.headerTitleClass
          )}
        >
          {heading}
        </Text>
      }
      footerProps={{
        showFooter: true,
        confirmText: t(config.confirmTextKey),
        cancelText: t("cancel"),
      }}
      contentClassNames={{
        wrapper: cn(
          "rounded-2xl overflow-hidden shadow-xl border",
          config.wrapperBorderClass,
          className
        ),
        headerBox: cn(
          "border-none bg-gradient-to-r px-5 py-3",
          config.headerGradientClass
        ),
        headerTitle: cn("text-center", config.headerTitleClass),
        closeButton: config.closeButtonClass,
        closeIcon: config.closeIconClass,
        footerBox: config.footerBoxClass,
        footerActions: "justify-end gap-3",
        cancelButton: config.cancelButtonClass,
        confirmButton: config.confirmButtonClass,
      }}
      radius="lg"
      size="md"
      {...args}
    >
      <Stack gap="md" className="px-1">
        <Stack gap={12} align="center">
          <ThemeIcon
            radius="xl"
            size={64}
            color={config.themeIconColor}
            variant="light"
            className="shadow-inner"
          >
            {icon ?? config.icon}
          </ThemeIcon>
          <Text
            ta="center"
            className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed"
          >
            {messageContent}
          </Text>
        </Stack>
        <Box className={config.accentBoxClass}>
          <Text fw={600} className={cn("text-sm", config.accentTextClass)}>
            {fallbackName}
          </Text>
        </Box>
      </Stack>
    </Modal>
  );
};
