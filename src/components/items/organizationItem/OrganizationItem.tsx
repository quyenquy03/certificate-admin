import { OrganizationStatusCard } from "@/components";
import { ORGANIZATION_STATUS_COLORS } from "@/constants";
import { OrganizationResponseType } from "@/types";
import { Box, Flex, Text } from "@mantine/core";
import { useTranslations } from "next-intl";
import {
  HiOutlineBuildingOffice2,
  HiOutlineEnvelope,
  HiOutlineUser,
} from "react-icons/hi2";

type OrganizationItemProps = {
  organization: OrganizationResponseType;
  onClick?: (organization: OrganizationResponseType) => void;
};

export const OrganizationItem = ({
  organization,
  onClick,
}: OrganizationItemProps) => {
  const t = useTranslations();
  console.log(organization);

  const trimmedOrEmpty = (value?: string | null) => {
    const trimmed = value?.trim();
    return trimmed && trimmed.length > 0 ? trimmed : "";
  };

  const organizationName =
    trimmedOrEmpty(organization.organizationName) || t("not_updated");

  const registrantName =
    [
      trimmedOrEmpty(organization.ownerFirstName),
      trimmedOrEmpty(organization.ownerLastName),
    ]
      .filter(Boolean)
      .join(" ") || t("not_updated");

  const organizationInitial =
    organizationName?.charAt(0)?.toUpperCase() ||
    registrantName?.charAt(0)?.toUpperCase() ||
    "O";

  const accentColor =
    ORGANIZATION_STATUS_COLORS[organization.status] ?? "#6366F1";

  const infoItems = [
    {
      key: "email",
      label: t("email"),
      value: trimmedOrEmpty(organization.email) || t("not_updated"),
      icon: <HiOutlineEnvelope className="h-4 w-4" />,
    },
    {
      key: "registrant",
      label: t("registration_registrant"),
      value: registrantName,
      icon: <HiOutlineUser className="h-4 w-4" />,
    },
    {
      key: "organization",
      label: t("registration_organization_name"),
      value: organizationName,
      icon: <HiOutlineBuildingOffice2 className="h-4 w-4" />,
    },
  ];

  return (
    <Box
      className="min-h-28 relative text-color-light dark:text-color-dark bg-background-primary-light dark:bg-background-primary-dark rounded-md shadow-md dark:shadow-gray-600 p-3 transition-all"
      onClick={() => onClick?.(organization)}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <Box
        className="absolute inset-x-0 top-0 h-1 w-full rounded-t-md"
        style={{
          background: `linear-gradient(90deg, ${accentColor} 0%, ${accentColor}80 100%)`,
        }}
      />
      <Flex gap={12} align="center" justify="space-between" className="pb-2">
        <Flex gap={8} align="center" className="min-w-0">
          <Box
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-lg font-semibold uppercase text-white shadow-sm"
            style={{
              background: `linear-gradient(135deg, ${accentColor}1A 0%, ${accentColor} 100%)`,
            }}
          >
            {organizationInitial}
          </Box>
          <Flex direction="column" gap={4} className="min-w-0">
            <Text className="truncate text-base font-semibold capitalize text-gray-900 dark:text-gray-50">
              {organizationName}
            </Text>
            <Text className="truncate text-xs text-gray-500 dark:text-gray-300">
              {registrantName}
            </Text>
          </Flex>
        </Flex>
        <OrganizationStatusCard status={organization.status} />
      </Flex>
      <Flex gap={8} direction="column">
        {infoItems.map((item) => (
          <Flex
            key={item.key}
            gap={12}
            className="w-full rounded-md border border-gray-200 px-3 py-3 text-left dark:border-gray-600"
          >
            <Box className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-700/40 dark:text-slate-200">
              {item.icon}
            </Box>
            <Flex direction="column" gap={4} className="min-w-0 flex-1">
              <Text className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-300">
                {item.label}
              </Text>
              <Text className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
                {item.value}
              </Text>
            </Flex>
          </Flex>
        ))}
      </Flex>
    </Box>
  );
};
