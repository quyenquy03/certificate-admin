import {
  ButtonMore,
  DropdownMenu,
  DropdownMenuItemProps,
  OrganizationStatusCard,
} from "@/components";
import { ORGANIZATION_STATUS_COLORS } from "@/constants";
import { ORGANIZATION_STATUSES } from "@/enums";
import { OrganizationResponseType } from "@/types";
import { Box, Flex, Text } from "@mantine/core";
import { useTranslations } from "next-intl";
import { ReactNode } from "react";
import { BiCheckCircle, BiShow, BiXCircle } from "react-icons/bi";
import {
  HiOutlineBuildingOffice2,
  HiOutlineCheckBadge,
  HiOutlineEnvelope,
  HiOutlineUser,
} from "react-icons/hi2";

type RegistrationItemProps = {
  registration: OrganizationResponseType;
  onViewDetail?: (registration: OrganizationResponseType) => void;
  onApprove?: (registration: OrganizationResponseType) => void;
  onReject?: (registration: OrganizationResponseType) => void;
};

export const RegistrationItem = ({
  registration,
  onViewDetail,
  onApprove,
  onReject,
}: RegistrationItemProps) => {
  const t = useTranslations();

  const normalizeValue = (value?: string | null) => {
    const trimmed = value?.trim();
    return trimmed && trimmed.length > 0 ? trimmed : "";
  };

  const organizationName = normalizeValue(registration.organizationName);
  const organizationInitial =
    organizationName?.charAt(0).toUpperCase() ||
    normalizeValue(registration.ownerFirstName)?.charAt(0)?.toUpperCase() ||
    normalizeValue(registration.ownerLastName)?.charAt(0)?.toUpperCase() ||
    "C";

  const registrantName = [
    normalizeValue(registration.ownerFirstName),
    normalizeValue(registration.ownerLastName),
  ]
    .filter(Boolean)
    .join(" ");

  const getValueOrFallback = (value?: string | null) =>
    normalizeValue(value) || t("not_updated");

  const isPending = registration.status === ORGANIZATION_STATUSES.PENDING;

  const accentColor =
    ORGANIZATION_STATUS_COLORS[registration.status] ?? "#6366F1";

  const avatarBackground = `linear-gradient(135deg, ${accentColor}1A 0%, ${accentColor} 100%)`;

  type RegistrationInfoItem =
    | {
        key: string;
        label: string;
        icon: ReactNode;
        value: string;
        type?: "text";
      }
    | {
        key: string;
        label: string;
        icon: ReactNode;
        value: ReactNode;
        type: "component";
      };

  const infoItems: RegistrationInfoItem[] = [
    {
      key: "email",
      label: t("email"),
      value: getValueOrFallback(registration.email),
      icon: <HiOutlineEnvelope className="h-4 w-4" />,
    },
    {
      key: "registrant",
      label: t("registration_registrant"),
      value: registrantName || t("not_updated"),
      icon: <HiOutlineUser className="h-4 w-4" />,
    },
    {
      key: "organizationName",
      label: t("registration_organization_name"),
      value: organizationName || t("not_updated"),
      icon: <HiOutlineBuildingOffice2 className="h-4 w-4" />,
    },
    {
      key: "status",
      label: t("status"),
      value: <OrganizationStatusCard status={registration.status} />,
      icon: <HiOutlineCheckBadge className="h-4 w-4" />,
      type: "component",
    },
  ];

  const dropdownMenus: DropdownMenuItemProps[] = [
    {
      id: "1",
      label: t("view_detail"),
      leftIcon: <BiShow />,
      onClick: () => onViewDetail?.(registration),
    },
    ...(isPending
      ? [
          {
            id: "2",
            label: t("approve"),
            leftIcon: <BiCheckCircle />,
            onClick: () => onApprove?.(registration),
          },
          {
            id: "3",
            label: t("reject"),
            leftIcon: <BiXCircle />,
            onClick: () => onReject?.(registration),
          },
        ]
      : []),
  ];
  return (
    <Box className="min-h-28 relative text-color-light dark:text-color-dark bg-background-primary-light dark:bg-background-primary-dark rounded-md shadow-md dark:shadow-gray-600 p-2 cursor-pointer transition-all">
      <Box
        className="absolute inset-x-0 top-0 h-1 w-full rounded-t-md"
        style={{
          background: `linear-gradient(90deg, ${accentColor} 0%, ${accentColor}80 100%)`,
        }}
      />
      <DropdownMenu items={dropdownMenus} position="bottom-end">
        <Box className="absolute top-3 right-2">
          <ButtonMore />
        </Box>
      </DropdownMenu>
      <Flex gap={12} align="center" justify="space-between" className="pb-2">
        <Flex gap={8} align="center" className="min-w-0">
          <Box
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-lg font-semibold uppercase text-white shadow-sm"
            style={{ background: avatarBackground }}
          >
            {organizationInitial}
          </Box>
          <Flex direction="column" gap={4} className="min-w-0">
            <Text className="truncate text-base font-semibold capitalize text-gray-900 dark:text-gray-50">
              {organizationName || t("not_updated")}
            </Text>
            <Text className="truncate text-xs text-gray-500 dark:text-gray-300">
              {registrantName || t("not_updated")}
            </Text>
          </Flex>
        </Flex>
      </Flex>
      <Flex gap={8} direction={"column"}>
        {infoItems.map((item) => (
          <Flex
            key={item.key}
            gap={12}
            className="w-full rounded-md border border-gray-200 px-3 py-3 text-left dark:border-gray-600"
          >
            <Box className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-700/40 dark:text-slate-200">
              {item.icon}
            </Box>
            {item.type === "component" ? (
              <Flex
                align="center"
                justify="space-between"
                className="min-w-0 flex-1"
              >
                <Text className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-300">
                  {item.label}
                </Text>
                <Box className="shrink-0">{item.value}</Box>
              </Flex>
            ) : (
              <Flex direction="column" gap={4} className="min-w-0 flex-1">
                <Text className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-300">
                  {item.label}
                </Text>
                <Text className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
                  {item.value}
                </Text>
              </Flex>
            )}
          </Flex>
        ))}
      </Flex>
    </Box>
  );
};
