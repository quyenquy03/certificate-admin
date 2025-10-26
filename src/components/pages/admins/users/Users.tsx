"use client";

import { PageHeader, ButtonAdd, UserFormModal, UserItem } from "@/components";
import { PAGINATION_PARAMS } from "@/constants";
import { useDisclose } from "@/hooks";
import { useQueryGetAllUsers } from "@/queries";
import { BasePaginationParams, UserResponseType } from "@/types";
import { Box, Grid } from "@mantine/core";
import { useTranslations } from "next-intl";
import React, { useEffect, useMemo, useState } from "react";

export const UsersManagement = () => {
  const t = useTranslations();
  const userFormModal = useDisclose();
  const [selectedUser, setSelectedUser] = useState<UserResponseType | null>(
    null
  );

  const [searchParams, setSerchParams] = useState<BasePaginationParams>({
    page: PAGINATION_PARAMS.GET_USERS.page,
    limit: PAGINATION_PARAMS.GET_USERS.limit,
    search: "",
  });

  const {
    data: usersData,
    isLoading,
    refetch: refetchListUsers,
  } = useQueryGetAllUsers(searchParams);

  const handleCreateUser = () => {
    setSelectedUser(null);
    userFormModal.onOpen();
  };

  useEffect(() => {
    refetchListUsers();
  }, [refetchListUsers]);

  return (
    <Box className="w-full">
      <PageHeader title={t("users_management")}>
        <ButtonAdd onClick={handleCreateUser} />
      </PageHeader>

      {usersData && (
        <Grid columns={3} gutter="md" mt={20}>
          {usersData?.data.map((item) => (
            <Grid.Col key={item.id} span={1}>
              <UserItem user={item} />
            </Grid.Col>
          ))}
        </Grid>
      )}

      <UserFormModal
        opened={userFormModal.isOpen}
        onClose={userFormModal?.onClose}
        selectedUser={selectedUser}
      />
    </Box>
  );
};
