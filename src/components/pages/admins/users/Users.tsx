"use client";

import {
  PageHeader,
  ButtonAdd,
  UserFormModal,
  UserItem,
  UserItemSkeleton,
  PaginationCustom,
  PageContentWrapper,
} from "@/components";
import { PAGINATION_PARAMS } from "@/constants";
import { removeNoneCharacters, useDebounce, useDisclose } from "@/hooks";
import { useQueryGetAllUsers } from "@/queries";
import { BasePaginationParams, UserResponseType } from "@/types";
import { Box, Grid, Input } from "@mantine/core";
import { useTranslations } from "next-intl";
import React, { useEffect, useMemo, useState } from "react";

export const UsersManagement = () => {
  const t = useTranslations();
  const userFormModal = useDisclose();
  const [selectedUser, setSelectedUser] = useState<UserResponseType | null>(
    null
  );

  const [searchParams, setSearchParams] = useState<BasePaginationParams>({
    page: PAGINATION_PARAMS.GET_USERS.page,
    limit: PAGINATION_PARAMS.GET_USERS.limit,
    search: "",
  });

  const searchDebouncedValue = useDebounce(
    searchParams.search?.trim() ?? "",
    700
  );

  const {
    data: usersData,
    isFetching,
    refetch: refetchListUsers,
  } = useQueryGetAllUsers({
    ...searchParams,
    search: removeNoneCharacters(searchDebouncedValue),
  });

  const handleCreateUser = () => {
    setSelectedUser(null);
    userFormModal.onOpen();
  };

  const handleUpdateUser = (user: UserResponseType) => {
    setSelectedUser(user);
    userFormModal.onOpen();
  };

  const handleCloseModal = () => {
    userFormModal.onClose();
    setSelectedUser(null);
  };

  const handleSuccessSubmit = () => {
    refetchListUsers();
  };

  useEffect(() => {
    refetchListUsers();
  }, [
    refetchListUsers,
    searchParams.limit,
    searchParams.page,
    searchDebouncedValue,
  ]);

  return (
    <Box className="w-full relative">
      <PageHeader
        title={t("users_management")}
        classNames={{ wrapper: "relative z-10 gap-4" }}
      >
        <Input
          placeholder={t("enter_search_keyword")}
          className="w-full max-w-[200px]"
          value={searchParams?.search?.trim()}
          onChange={(e) =>
            setSearchParams((prev) => ({ ...prev, search: e.target.value }))
          }
        />
        <ButtonAdd onClick={handleCreateUser} />
      </PageHeader>
      <PageContentWrapper>
        {isFetching ? (
          <Grid gutter="md">
            {new Array(PAGINATION_PARAMS.GET_USERS.limit)
              .fill(0)
              .map((_, index) => (
                <Grid.Col
                  key={index}
                  span={{
                    base: 12,
                    sm: 12,
                    md: 6,
                    xl: 4,
                  }}
                >
                  <UserItemSkeleton />
                </Grid.Col>
              ))}
          </Grid>
        ) : usersData && usersData.data && usersData.data?.length > 0 ? (
          <Grid gutter="md">
            {usersData?.data.map((item) => (
              <Grid.Col
                key={item.id}
                span={{
                  base: 12,
                  sm: 12,
                  md: 6,
                  xl: 4,
                }}
              >
                <UserItem user={item} onUpdate={handleUpdateUser} />
              </Grid.Col>
            ))}
          </Grid>
        ) : (
          <div>no user</div>
        )}
        {usersData &&
          usersData?.pagination &&
          usersData?.pagination?.totalPage > 1 && (
            <PaginationCustom
              value={searchParams?.page}
              total={usersData?.pagination?.totalPage ?? 0}
              onChange={(page) =>
                setSearchParams((prev) => ({ ...prev, page }))
              }
            />
          )}
      </PageContentWrapper>

      <UserFormModal
        opened={userFormModal.isOpen}
        onClose={handleCloseModal}
        onSuccess={handleSuccessSubmit}
        selectedUser={selectedUser}
      />
    </Box>
  );
};
