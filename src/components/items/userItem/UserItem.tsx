import {
  ButtonMore,
  DropdownMenu,
  DropdownMenuItemProps,
  Image,
  InfoRowItem,
  UserBlockCard,
  UserRoleCard,
} from "@/components";
import { IMAGES } from "@/constants";
import { USER_ROLES } from "@/enums";
import { formatDate } from "@/helpers";
import { UserResponseType } from "@/types";
import { Box, Flex, Text } from "@mantine/core";
import { useTranslations } from "next-intl";
import { BiEdit, BiShow, BiTrash } from "react-icons/bi";
import {
  PiCalendarCheck,
  PiEnvelopeSimple,
  PiMapPin,
  PiPhoneCall,
  PiWallet,
} from "react-icons/pi";

type UserItemProps = {
  user: UserResponseType;
  onClick?: (user: UserResponseType) => void;
  onViewDetail?: (user: UserResponseType) => void;
  onUpdate?: (user: UserResponseType) => void;
  onDelete?: (user: UserResponseType) => void;
};

const ROLE_COLORS: Partial<Record<USER_ROLES, string>> = {
  [USER_ROLES.ADMIN]: "#2563EB",
  [USER_ROLES.ORGANIZATION]: "#8B5CF6",
};

const normalize = (value?: string | null) => value?.trim() || "";

export const UserItem = ({
  user,
  onClick,
  onViewDetail,
  onUpdate,
  onDelete,
}: UserItemProps) => {
  const t = useTranslations();

  const badgeColor = ROLE_COLORS[user.role] ?? "#0EA5E9";
  const avatarUrl = normalize(user.avatar);
  const avatarSrc = avatarUrl || IMAGES.default.avatar;
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

  const actionMenuItems: DropdownMenuItemProps[] = [];

  if (onViewDetail) {
    actionMenuItems.push({
      id: "detail",
      label: t("view_detail"),
      leftIcon: <BiShow />,
      onClick: () => onViewDetail?.(user),
    });
  }

  if (onUpdate) {
    actionMenuItems.push({
      id: "update",
      label: t("update_user"),
      leftIcon: <BiEdit />,
      onClick: () => onUpdate?.(user),
    });
  }

  if (onDelete) {
    actionMenuItems.push({
      id: "delete",
      label: t("delete_user"),
      leftIcon: <BiTrash />,
      onClick: () => onDelete?.(user),
    });
  }

  return (
    <Box
      className="relative min-h-28 cursor-pointer rounded-lg bg-background-primary-light p-3 text-color-light shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg dark:bg-background-primary-dark dark:text-color-dark dark:shadow-slate-800"
      onClick={() => onClick?.(user)}
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

      <Flex gap={12} align="center" className="pb-4">
        <Box
          className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-md bg-slate-100 text-base font-semibold text-slate-600 dark:bg-slate-800/60 dark:text-slate-100"
          style={{
            background: `linear-gradient(135deg, ${badgeColor}1A 0%, ${badgeColor} 100%)`,
            color: "#fff",
          }}
        >
          <Image
            src={avatarSrc}
            alt="avatar"
            className="h-full w-full object-cover"
            wrapperClassName="absolute inset-0 h-full w-full"
          />
        </Box>

        <Flex direction="column" gap={6} className="min-w-0 flex-1">
          <Text className="truncate text-base font-semibold text-slate-900 dark:text-slate-100">
            {fullName}
          </Text>
          <Text className="truncate text-xs text-slate-500 dark:text-slate-400">
            {email}
          </Text>
          <Flex gap={6} wrap="wrap">
            <UserRoleCard role={user.role} />
            <UserBlockCard isBlock={user.isLocked} />
          </Flex>
        </Flex>
      </Flex>

      <Flex direction="column" gap={10}>
        <InfoRowItem icon={PiPhoneCall} label={t("phone")} value={phone} />
        <InfoRowItem icon={PiCalendarCheck} label={t("dob")} value={dob} />
        <InfoRowItem icon={PiMapPin} label={t("address")} value={address} />
        <InfoRowItem
          icon={PiWallet}
          label={t("wallet_address")}
          value={walletAddress || t("not_updated")}
          showCopyButton
          disabledCopyButton={!walletAddress}
        />
      </Flex>
    </Box>
  );
};
