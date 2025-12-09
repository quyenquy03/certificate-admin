"use client";

import {
  PageHeader,
  ButtonAdd,
  UserFormModal,
  UserItem,
  UserItemSkeleton,
  PaginationCustom,
  PageContentWrapper,
  ConfirmationModal,
  type ConfirmationModalType,
} from "@/components";
import { PAGINATION_PARAMS } from "@/constants";
import { removeNoneCharacters, useDebounce, useDisclose } from "@/hooks";
import { useQueryGetAllUsers } from "@/queries";
import { BasePaginationParams, BaseErrorType, UserResponseType } from "@/types";
import { useDeleteUser, useResetPassword } from "@/mutations";
import { Box, Grid, Input } from "@mantine/core";
import { useTranslations } from "next-intl";
import React, { useEffect, useMemo, useState } from "react";
import { notifications } from "@mantine/notifications";
import { isAxiosError } from "axios";

export const UsersManagement = () => {
  const t = useTranslations();
  const userFormModal = useDisclose();
  const confirmationModal = useDisclose();
  const [selectedUser, setSelectedUser] = useState<UserResponseType | null>(
    null
  );
  const [confirmationType, setConfirmationType] =
    useState<ConfirmationModalType | null>(null);
  const [actionUser, setActionUser] = useState<UserResponseType | null>(null);

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

  const actionUserName = useMemo(() => {
    if (!actionUser) {
      return "";
    }

    const fullName =
      [actionUser.firstName?.trim(), actionUser.lastName?.trim()]
        .filter(Boolean)
        .join(" ")
        .trim() || "";

    const email = actionUser.email?.trim() ?? "";

    return fullName || email || t("not_updated");
  }, [actionUser, t]);

  const handleOpenConfirmationModal = (
    type: ConfirmationModalType,
    user: UserResponseType
  ) => {
    setConfirmationType(type);
    setActionUser(user);
    confirmationModal.onOpen();
  };

  const handleCloseConfirmationModal = () => {
    confirmationModal.onClose();
    setConfirmationType(null);
    setActionUser(null);
  };

  const handleMutationError = (error: unknown, failKey: string) => {
    let message = t("common_error_message");

    if (isAxiosError<BaseErrorType>(error)) {
      const code = error.response?.data?.code;
      message = t(code || "common_error_message");
    }

    notifications.show({
      title: t(failKey),
      message,
      color: "red",
    });
  };

  const { mutate: deleteUser, isPending: isDeletingUser } = useDeleteUser({
    onSuccess: () => {
      notifications.show({
        title: t("delete_user_success_title"),
        message: t("delete_user_success_desc"),
        color: "green",
      });
      handleCloseConfirmationModal();
      refetchListUsers();
    },
    onError: (error) => handleMutationError(error, "delete_user_fail"),
  });

  const { mutate: resetPassword, isPending: isResettingPassword } =
    useResetPassword({
      onSuccess: () => {
        notifications.show({
          title: t("reset_password_success_title"),
          message: t("reset_password_success_desc"),
          color: "green",
        });
        handleCloseConfirmationModal();
        refetchListUsers();
      },
      onError: (error) => handleMutationError(error, "reset_password_fail"),
    });

  const handleConfirmAction = () => {
    if (!confirmationType || !actionUser?.id) {
      return;
    }

    if (confirmationType === "delete") {
      deleteUser(actionUser.id);
      return;
    }

    if (confirmationType === "reset_password") {
      resetPassword(actionUser.id);
    }
  };

  const isConfirmProcessing = isDeletingUser || isResettingPassword;

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
                <UserItem
                  user={item}
                  onUpdate={handleUpdateUser}
                  onDelete={(user) =>
                    handleOpenConfirmationModal("delete", user)
                  }
                  onResetPassword={(user) =>
                    handleOpenConfirmationModal("reset_password", user)
                  }
                />
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
      <ConfirmationModal
        type={confirmationType ?? "delete"}
        title={
          confirmationType
            ? t(
                confirmationType === "delete"
                  ? "delete_user_confirmation_title"
                  : "reset_password_confirmation_title"
              )
            : ""
        }
        description={
          confirmationType
            ? t(
                confirmationType === "delete"
                  ? "delete_user_confirmation_desc"
                  : "reset_password_confirmation_desc",
                {
                  name: actionUserName || t("not_updated"),
                }
              )
            : ""
        }
        itemName={actionUserName}
        opened={confirmationModal.isOpen}
        onClose={handleCloseConfirmationModal}
        onConfirm={handleConfirmAction}
        isLoading={isConfirmProcessing}
      />
    </Box>
  );
};
