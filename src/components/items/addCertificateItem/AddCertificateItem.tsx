"use client";

import { CertificateItemFormType } from "@/types";
import { Box, Button, Drawer, Flex, Text } from "@mantine/core";
import { useTranslations } from "next-intl";
import {
  ButtonMore,
  DropdownMenu,
  DropdownMenuItemProps,
  InfoRowItem,
} from "@/components";
import { HiOutlineQrCode } from "react-icons/hi2";
import { PiCalendarCheck, PiShieldCheck } from "react-icons/pi";
import { BiEdit, BiTrash } from "react-icons/bi";
import { FiGlobe } from "react-icons/fi";
import { formatDate } from "@/helpers";
import { useMemo, useState } from "react";

type AddCertificateItemProps = {
  certificate: CertificateItemFormType;
  onClick?: (certificate: CertificateItemFormType) => void;
  onUpdate?: (certificate: CertificateItemFormType) => void;
  onDelete?: (certificate: CertificateItemFormType) => void;
};

const BADGE_COLOR = "#2563EB";

export const AddCertificateItem = ({
  certificate,
  onClick,
  onUpdate,
  onDelete,
}: AddCertificateItemProps) => {
  const t = useTranslations();
  const [isDelete, setIsDelete] = useState(false);

  const badgeColor = BADGE_COLOR;

  const authorName = certificate.authorName.trim() || t("not_updated");
  const authorInitial = authorName.charAt(0)?.toUpperCase() || "C";
  const dobValue =
    certificate.authorDob instanceof Date
      ? certificate.authorDob.toISOString()
      : certificate.authorDob || "";

  const actionMenuItems: DropdownMenuItemProps[] = useMemo(() => {
    const menuItems = [];
    if (onUpdate) {
      menuItems.push({
        id: "update",
        label: t("update"),
        leftIcon: <BiEdit />,
        onClick: () => onUpdate(certificate),
      });
    }
    if (onDelete) {
      menuItems.push({
        id: "delete",
        label: t("delete"),
        leftIcon: <BiTrash />,
        onClick: () => setIsDelete(true),
      });
    }
    return menuItems;
  }, [certificate, onUpdate, setIsDelete, onDelete]);

  return (
    <Box
      className="min-h-28 relative rounded-lg bg-background-primary-light p-3 shadow-md transition-all hover:shadow-lg dark:bg-background-primary-dark dark:shadow-slate-800"
      onClick={() => onClick?.(certificate)}
    >
      {actionMenuItems.length > 0 && (
        <DropdownMenu items={actionMenuItems} position="bottom-end">
          <Box
            className="absolute top-3 right-3 z-10"
            onClick={(event) => event.stopPropagation()}
          >
            <ButtonMore />
          </Box>
        </DropdownMenu>
      )}
      <Box
        className="absolute inset-x-0 top-0 h-1 w-full rounded-t-lg"
        style={{
          background: `linear-gradient(90deg, ${badgeColor} 0%, ${badgeColor}bb 100%)`,
        }}
      />

      <Flex gap={12} align="center" justify="space-between" className="pb-4">
        <Flex gap={12} align="center" className="min-w-0">
          <Box
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-slate-100 text-base font-semibold text-slate-600 dark:bg-slate-800/60 dark:text-slate-100"
            style={{
              background: `linear-gradient(135deg, ${badgeColor}1A 0%, ${badgeColor} 100%)`,
              color: "#fff",
            }}
          >
            {authorInitial}
          </Box>
          <Flex direction="column" gap={4} className="min-w-0">
            <Text className="truncate text-base font-semibold text-slate-900 dark:text-slate-100">
              {authorName}
            </Text>
            <Text className="truncate text-xs text-slate-500 dark:text-slate-400">
              {certificate.authorIdCard}
            </Text>
          </Flex>
        </Flex>
      </Flex>

      <Flex gap={8} direction="column">
        <InfoRowItem
          icon={PiCalendarCheck}
          label={t("certificate_author_dob_label")}
          value={
            dobValue.trim().length > 0 ? formatDate(dobValue) : t("not_updated")
          }
        />

        <InfoRowItem
          icon={FiGlobe}
          label={t("domain_label")}
          value={certificate?.domain ?? t("not_updated")}
        />

        <InfoRowItem
          icon={PiShieldCheck}
          label={t("certificate_grant_level")}
          value={certificate?.grantLevel}
        />

        <InfoRowItem
          icon={HiOutlineQrCode}
          label={t("certificate_reg_no_label")}
          value={certificate?.reg_no}
        />
      </Flex>

      <Drawer
        opened={isDelete}
        onClose={() => setIsDelete(false)}
        position="bottom"
        padding="md"
        withCloseButton={false}
        withinPortal={false}
        lockScroll={false}
        transitionProps={{ transition: "scale", duration: 300 }}
        overlayProps={{ opacity: 0 }}
        classNames={{
          content:
            "rounded-sm max-h-[290px] w-full absolute bottom-0 child-drawer",
          inner: "relative",
          overlay: "absolute overflow-hidden",
        }}
      >
        <Flex
          direction="column"
          gap={14}
          onClick={(event) => event.stopPropagation()}
        >
          <Box className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-amber-500 text-white shadow-lg shadow-red-500/30">
            <BiTrash className="h-6 w-6" />
          </Box>

          <Flex
            direction="column"
            gap={6}
            align="center"
            className="text-center"
          >
            <Text className="text-base font-semibold text-red-600 dark:text-red-300">
              {t("delete")}
            </Text>
            <Text className="text-sm text-slate-700 dark:text-slate-200 whitespace-pre-wrap">
              {t("certificate_delete_confirmation_desc")}
            </Text>
          </Flex>

          <Flex justify="flex-end" gap={12} className="px-1">
            <Button
              variant="outline"
              color="gray"
              fullWidth
              onClick={(event) => {
                event.stopPropagation();
                setIsDelete(false);
              }}
            >
              {t("cancel")}
            </Button>
            <Button
              color="red"
              leftSection={<BiTrash />}
              fullWidth
              onClick={(event) => {
                event.stopPropagation();
                onDelete?.(certificate);
                setIsDelete(false);
              }}
            >
              {t("delete")}
            </Button>
          </Flex>
        </Flex>
      </Drawer>
    </Box>
  );
};
