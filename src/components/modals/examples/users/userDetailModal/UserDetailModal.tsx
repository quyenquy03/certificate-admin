"use client";

import {
  Image,
  InfoRowItem,
  UserBlockCard,
  UserRoleCard,
  OrganizationMemberStatusCard,
  type OrganizationMemberStatus,
} from "@/components";
import { formatDate } from "@/helpers";
import { BaseModalProps, Modal } from "@/components/modals/bases";
import { UserResponseType } from "@/types";
import { Box, Flex, Stack, Text } from "@mantine/core";
import { useTranslations } from "next-intl";
import { IMAGES } from "@/constants";
import {
  PiCalendarCheck,
  PiEnvelopeSimple,
  PiMapPin,
  PiPhoneCall,
  PiWallet,
} from "react-icons/pi";

type UserDetailModalProps = {
  user: UserResponseType | null;
  membershipStatus?: OrganizationMemberStatus;
} & Omit<BaseModalProps, "children" | "header">;

const normalize = (value?: string | null) => value?.trim() || "";

export const UserDetailModal = ({
  user,
  opened = false,
  onClose,
  membershipStatus,
  ...args
}: UserDetailModalProps) => {
  const t = useTranslations();

  if (!user) return null;

  const fullName =
    [normalize(user.firstName), normalize(user.lastName)]
      .filter(Boolean)
      .join(" ")
      .trim() || t("not_updated");
  const email = normalize(user.email) || t("not_updated");
  const phone = normalize(user.phone) || t("not_updated");
  const address = normalize(user.address) || t("not_updated");
  const walletAddress = normalize(user.walletAddress);
  const dob = formatDate(user.dob) || t("not_updated");
  const createdAt = formatDate(user.createdAt) || t("not_updated");
  const updatedAt = formatDate(user.updatedAt) || t("not_updated");

  const avatarUrl = normalize(user.avatar);
  const avatarSrc = avatarUrl || IMAGES.default.avatar;

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      footerProps={{
        showFooter: false,
      }}
      header={t("user_detail_title")}
      size="lg"
      {...args}
    >
      <Stack gap="lg">
        <Flex align="center" gap={16}>
          <Box className="relative h-20 w-20 overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800">
            <Image
              src={avatarSrc}
              alt="avatar"
              className="h-full w-full object-cover"
              wrapperClassName="h-full w-full"
            />
          </Box>

          <Flex direction="column" gap={6} className="min-w-0 flex-1">
            <Text className="truncate text-lg font-semibold text-slate-900 dark:text-slate-100">
              {fullName}
            </Text>
            <Text className="truncate text-sm text-slate-600 dark:text-slate-300">
              {email}
            </Text>
            <Flex gap={8} wrap="wrap">
              {membershipStatus ? (
                <OrganizationMemberStatusCard status={membershipStatus} />
              ) : (
                <UserRoleCard role={user.role} />
              )}
              <UserBlockCard isBlock={user.isLocked} />
            </Flex>
          </Flex>
        </Flex>

        <Stack gap="sm">
          <InfoRowItem
            icon={PiPhoneCall}
            label={t("phone")}
            value={phone}
          />
          <InfoRowItem icon={PiEnvelopeSimple} label={t("email")} value={email} />
          <InfoRowItem icon={PiCalendarCheck} label={t("dob")} value={dob} />
          <InfoRowItem icon={PiMapPin} label={t("address")} value={address} />
          <InfoRowItem
            icon={PiWallet}
            label={t("wallet_address")}
            value={walletAddress || t("not_updated")}
            showCopyButton
            disabledCopyButton={!walletAddress}
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
      </Stack>
    </Modal>
  );
};
