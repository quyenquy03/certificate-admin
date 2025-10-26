import {
  UserRoleCard,
  Image,
  UserBlockCard,
  ButtonMore,
  DropdownMenu,
  DropdownMenuItemProps,
} from "@/components";
import { IMAGES } from "@/constants";
import { formatDate } from "@/helpers";
import { UserResponseType } from "@/types";
import { Box, Flex, Text } from "@mantine/core";
import { useTranslations } from "next-intl";
import { BiShow } from "react-icons/bi";

type UserItemProps = {
  user: UserResponseType;
};

export const UserItem = ({ user }: UserItemProps) => {
  const t = useTranslations();
  const dropdownMenus: DropdownMenuItemProps[] = [
    {
      id: "1",
      label: t("view_detail"),
      leftIcon: <BiShow />,
    },
    {
      id: "2",
      label: t("view_detail"),
      leftIcon: <BiShow />,
    },
  ];
  return (
    <Box className="min-h-28 relative text-color-light dark:text-color-dark bg-background-primary-light dark:bg-background-primary-dark rounded-md shadow-md dark:shadow-gray-600 p-2 cursor-pointer transition-all">
      <DropdownMenu items={dropdownMenus} position="bottom-end">
        <Box className="absolute top-1 right-1">
          <ButtonMore />
        </Box>
      </DropdownMenu>
      <Flex gap={8}>
        <Box className="relative border-[3px] border-gray-400 rounded-lg overflow-hidden">
          <Image
            src={IMAGES.default.avatar}
            alt="avatar"
            className="w-full h-full"
            wrapperClassName="w-20 h-20"
          />
        </Box>
        <Flex direction={"column"} gap={4} justify={"space-between"}>
          <Box>
            <Text className="font-semibold text-sm">
              {user.firstName} {user.lastName}
            </Text>
            <Text className="text-sm">{user.email}</Text>
          </Box>
          <Flex gap={4}>
            <UserRoleCard role={user.role} />
            <UserBlockCard isBlock={user.isLocked} />
          </Flex>
        </Flex>
      </Flex>
      <Flex gap={1} direction={"column"} mt={10}>
        <Box className="flex items-center gap-2">
          <Text className="text-sm font-semibold">{t("dob")}:</Text>
          <Text className="text-sm">
            {formatDate(user.dob) ?? t("not_updated")}
          </Text>
        </Box>
        <Box className="flex items-center gap-2">
          <Text className="text-sm font-semibold">{t("phone")}:</Text>
          <Text className="text-sm">
            {user.phone && user.phone?.trim() !== ""
              ? user.phone
              : t("not_updated")}
          </Text>
        </Box>
        <Box className="flex items-center gap-2">
          <Text className="text-sm font-semibold">{t("address")}:</Text>
          <Text className="text-sm">{user.address ?? t("not_updated")}</Text>
        </Box>
      </Flex>
    </Box>
  );
};
