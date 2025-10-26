"use client";

import { cn } from "@/helpers";
import {
  ActionIcon,
  Box,
  Button,
  Flex,
  Modal as MantineModal,
  ModalProps,
  Text,
} from "@mantine/core";
import { useTranslations } from "next-intl";
import { ReactNode } from "react";
import { BiX } from "react-icons/bi";

export type BaseModalProps = {
  children?: ReactNode;
  header?: string | ReactNode;
  footer?: ReactNode;
  footerProps?: {
    showFooter?: boolean;
    hideConfirmButton?: boolean;
    hideCancelButton?: boolean;
    confirmText?: string;
    cancelText?: string;
  };
  onConfirm?: () => void;
  onCancel?: () => void;
  contentClassNames?: {
    wrapper?: string;
    headerBox?: string;
    headerTitle?: string;
    closeButton?: string;
    closeIcon?: string;
    body?: string;
    footerBox?: string;
    footerActions?: string;
    cancelButton?: string;
    confirmButton?: string;
  };
  heightFixed?: boolean;
} & ModalProps;

export const Modal = ({
  opened = false,
  children,
  header,
  footer,
  footerProps,
  onClose,
  onConfirm,
  onCancel,
  contentClassNames,
  heightFixed = false,
  ...args
}: BaseModalProps) => {
  const t = useTranslations();
  return (
    <MantineModal
      withCloseButton={false}
      classNames={{
        body: "p-0",
      }}
      opened={opened}
      onClose={onClose}
      {...args}
    >
      <Box className={cn("relative", contentClassNames?.wrapper)}>
        {header && (
          <Box
            className={cn(
              "min-h-10 border-b-[1px] border-b-gray-300 flex items-center",
              contentClassNames?.headerBox
            )}
          >
            {typeof header === "string" ? (
              <Text
                className={cn(
                  "text-color-light font-medium text-lg truncate px-3 py-1 text-center w-full",
                  contentClassNames?.headerTitle
                )}
              >
                {header}
              </Text>
            ) : (
              header
            )}
          </Box>
        )}
        <ActionIcon
          onClick={onClose}
          className={cn(
            "hover:brightness-105 active:brightness-95 transition-all absolute top-1 right-1",
            contentClassNames?.closeButton
          )}
          color="red"
        >
          <BiX className={contentClassNames?.closeIcon} />
        </ActionIcon>
        <Box
          className={cn(
            "p-3 min-h-20 max-h-[75vh] overflow-y-auto",
            heightFixed && "h-[75vh]"
          )}
        >
          {children}
        </Box>
        {footerProps?.showFooter && (
          <Box
            className={cn(
              "min-h-10 border-t-[1px] border-t-gray-300 flex items-center",
              contentClassNames?.footerBox
            )}
          >
            {footer ?? (
              <Flex
                align={"center"}
                justify={"flex-end"}
                className={cn("w-full px-3", contentClassNames?.footerActions)}
                gap={8}
              >
                {!footerProps?.hideCancelButton && (
                  <Button
                    onClick={onCancel ?? onClose}
                    size="xs"
                    variant="outline"
                    color="red"
                    className={contentClassNames?.cancelButton}
                  >
                    {footerProps?.cancelText ?? t("cancel")}
                  </Button>
                )}
                {!footerProps?.hideConfirmButton && (
                  <Button
                    onClick={onConfirm}
                    size="xs"
                    className={contentClassNames?.confirmButton}
                  >
                    {footerProps?.confirmText ?? t("confirm")}
                  </Button>
                )}
              </Flex>
            )}
          </Box>
        )}
      </Box>
    </MantineModal>
  );
};
