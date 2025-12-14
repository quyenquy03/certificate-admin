"use client";

import {
  InfoRowItem,
  OrganizationStatusCard,
} from "@/components";
import { COUNTRY_LABELS } from "@/constants";
import { formatDate } from "@/helpers";
import { BaseModalProps, Modal } from "@/components/modals/bases";
import { OrganizationResponseType } from "@/types";
import { Box, Flex, Stack, Text } from "@mantine/core";
import { useTranslations } from "next-intl";
import {
  PiCalendarCheck,
  PiGlobeHemisphereWest,
  PiHashStraight,
  PiMapPin,
  PiNotePencil,
  PiUser,
} from "react-icons/pi";

type OrganizationDetailModalProps = {
  organization: OrganizationResponseType | null;
} & Omit<BaseModalProps, "children" | "header">;

const normalize = (value?: string | null) => value?.trim() || "";

export const OrganizationDetailModal = ({
  organization,
  opened = false,
  onClose,
  ...args
}: OrganizationDetailModalProps) => {
  const t = useTranslations();

  if (!organization) return null;

  const organizationName =
    normalize(organization.name) || t("not_updated");
  const organizationDescription =
    normalize(organization.description) || t("not_updated");
  const website = normalize(organization.website) || t("not_updated");
  const countryLabel = organization.countryCode
    ? t(COUNTRY_LABELS[organization.countryCode])
    : t("not_updated");
  const initTxHash = normalize(organization.initTxHash);
  const changeOwnerTxHash = normalize(organization.changeOwnerTxHash);
  const createdAt = formatDate(organization.createdAt) || t("not_updated");
  const updatedAt = formatDate(organization.updatedAt) || t("not_updated");

  const ownerFullName =
    [
      normalize(organization.owner?.firstName),
      normalize(organization.owner?.lastName),
    ]
      .filter(Boolean)
      .join(" ")
      .trim() || t("not_updated");
  const ownerEmail = normalize(organization.owner?.email) || t("not_updated");
  const ownerPhone = normalize(organization.owner?.phone) || t("not_updated");

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      header={t("organization_detail_title")}
      footerProps={{ showFooter: false }}
      size="lg"
      {...args}
    >
      <Stack gap="lg">
        <Flex justify="space-between" align="center" gap={12}>
          <Box className="min-w-0 flex-1">
            <Text className="truncate text-lg font-semibold text-slate-900 dark:text-slate-100">
              {organizationName}
            </Text>
            <Text className="mt-1 truncate text-sm text-slate-500 dark:text-slate-300">
              {organizationDescription}
            </Text>
          </Box>
          <OrganizationStatusCard status={organization.status} />
        </Flex>

        <Stack gap="sm">
          <InfoRowItem
            icon={PiGlobeHemisphereWest}
            label={t("registration_website")}
            value={website}
          />
          <InfoRowItem
            icon={PiMapPin}
            label={t("registration_country")}
            value={countryLabel}
          />
          <InfoRowItem
            icon={PiNotePencil}
            label={t("description")}
            value={organizationDescription}
          />
          <InfoRowItem
            icon={PiHashStraight}
            label={t("organization_init_tx_hash")}
            value={initTxHash || t("not_updated")}
            showCopyButton
            disabledCopyButton={!initTxHash}
          />
          <InfoRowItem
            icon={PiHashStraight}
            label={t("organization_change_owner_tx_hash")}
            value={changeOwnerTxHash || t("not_updated")}
            showCopyButton
            disabledCopyButton={!changeOwnerTxHash}
          />
          <InfoRowItem
            icon={PiCalendarCheck}
            label={t("registration_created_at")}
            value={createdAt}
          />
          <InfoRowItem
            icon={PiCalendarCheck}
            label={t("registration_updated_at")}
            value={updatedAt}
          />
        </Stack>

        <Box className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/40">
          <Text className="mb-3 text-sm font-semibold text-slate-800 dark:text-slate-100">
            {t("organization_owner")}
          </Text>
          <Stack gap="sm">
            <InfoRowItem icon={PiUser} label={t("full_name")} value={ownerFullName} />
            <InfoRowItem label={t("email")} value={ownerEmail} />
            <InfoRowItem label={t("phone")} value={ownerPhone} />
          </Stack>
        </Box>
      </Stack>
    </Modal>
  );
};
