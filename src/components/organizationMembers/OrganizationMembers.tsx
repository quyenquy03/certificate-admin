"use client";

import {
  ButtonAdd,
  NoData,
  OrganizationMemberFormModal,
  PageContentWrapper,
  PageHeader,
  PaginationCustom,
  UserDetailModal,
  UserItem,
  UserItemSkeleton,
  type OrganizationMemberStatus,
} from "@/components";
import { PAGINATION_PARAMS } from "@/constants";
import { removeNoneCharacters, useDebounce, useDisclose } from "@/hooks";
import { useQueryGetOrganizationMembers } from "@/queries";
import {
  BasePaginationParams,
  OrganizationMemberResponseType,
  OrganizationResponseType,
  UserResponseType,
} from "@/types";
import { Box, Grid, Input, Text } from "@mantine/core";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";

type OrganizationMembersProps = {
  currentOrganization: OrganizationResponseType | null;
  isAdmin?: boolean;
};

export const OrganizationMembers = ({
  currentOrganization,
  isAdmin = false,
}: OrganizationMembersProps) => {
  const t = useTranslations();
  const addMemberModal = useDisclose();
  const detailModal = useDisclose();
  const [selectedMember, setSelectedMember] = useState<UserResponseType | null>(
    null
  );
  const [selectedMemberStatus, setSelectedMemberStatus] =
    useState<OrganizationMemberStatus | null>(null);

  const [searchParams, setSearchParams] = useState<BasePaginationParams>({
    page: PAGINATION_PARAMS.GET_ORGANIZATION_MEMBERS.page,
    limit: PAGINATION_PARAMS.GET_ORGANIZATION_MEMBERS.limit,
    search: "",
  });

  const debouncedSearch = useDebounce(searchParams.search ?? "", 700);
  const normalizedSearch = useMemo(
    () => removeNoneCharacters(debouncedSearch?.trim() ?? ""),
    [debouncedSearch]
  );

  const {
    data: membersResponse,
    isFetching,
    isLoading,
    refetch,
  } = useQueryGetOrganizationMembers(
    {
      organizationId: currentOrganization?.id ?? "",
      page: searchParams.page,
      limit: searchParams.limit,
      search: normalizedSearch,
    },
    {
      enabled: Boolean(currentOrganization?.id),
    } as any
  );

  useEffect(() => {
    if (!currentOrganization?.id) return;
    refetch();
  }, [
    currentOrganization?.id,
    normalizedSearch,
    searchParams.limit,
    searchParams.page,
    refetch,
  ]);

  const members: OrganizationMemberResponseType[] = membersResponse?.data ?? [];
  const totalPages = membersResponse?.pagination?.totalPage ?? 0;
  const canManageMembers = Boolean(currentOrganization?.isOwner);

  const handleOpenAddModal = () => {
    if (!canManageMembers) return;
    addMemberModal.onOpen();
  };

  const handleCloseAddModal = () => {
    addMemberModal.onClose();
  };

  const handleOpenDetail = (
    member: UserResponseType,
    status: OrganizationMemberStatus
  ) => {
    setSelectedMember(member);
    setSelectedMemberStatus(status);
    detailModal.onOpen();
  };

  const handleCloseDetail = () => {
    detailModal.onClose();
    setSelectedMember(null);
    setSelectedMemberStatus(null);
  };

  const handleSuccessAdd = () => {
    refetch();
  };

  const handleChangePage = (page: number) =>
    setSearchParams((prev) => ({ ...prev, page }));

  const hasMembers = !isLoading && members.length > 0;

  const renderContent = () => {
    if (!currentOrganization?.id) {
      return (
        <Box className="flex h-full w-full items-center justify-center py-10">
          <Text className="text-sm text-slate-500 dark:text-slate-300">
            {t("organization_not_found")}
          </Text>
        </Box>
      );
    }

    if (isLoading) {
      return (
        <Grid gutter="md">
          {new Array(searchParams.limit).fill(0).map((_, index) => (
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
      );
    }

    if (!hasMembers) {
      return <NoData />;
    }

    return (
      <Grid gutter="md">
        {members.map((member) => {
          const user = member.user;
          const membershipStatus: OrganizationMemberStatus = member.isOwner
            ? "owner"
            : "member";
          const userData: UserResponseType = {
            ...user,
            walletAddress: user.walletAddress || member.walletAddress,
          };

          return (
            <Grid.Col
              key={userData.id}
              span={{
                base: 12,
                sm: 12,
                md: 6,
                xl: 4,
              }}
            >
              <UserItem
                user={userData}
                membershipStatus={membershipStatus}
                onClick={() => handleOpenDetail(userData, membershipStatus)}
                onViewDetail={() =>
                  handleOpenDetail(userData, membershipStatus)
                }
              />
            </Grid.Col>
          );
        })}
      </Grid>
    );
  };

  return (
    <Box className="w-full relative flex h-full flex-col">
      <PageHeader
        showBackButton={isAdmin}
        title={t("members")}
        classNames={{
          wrapper:
            "relative z-10 gap-4 bg-white/90 backdrop-blur dark:bg-slate-950/90 rounded-sm",
        }}
      >
        <Input
          placeholder={t("enter_search_keyword")}
          className="w-full max-w-[240px]"
          value={searchParams.search}
          onChange={(event) =>
            setSearchParams((prev) => ({
              ...prev,
              search: event.currentTarget.value,
              page: PAGINATION_PARAMS.DEFAULT.page,
            }))
          }
        />
        {canManageMembers && <ButtonAdd onClick={handleOpenAddModal} />}
      </PageHeader>

      <PageContentWrapper>
        {renderContent()}

        {totalPages > 1 && (
          <PaginationCustom
            value={searchParams.page}
            total={totalPages}
            onChange={handleChangePage}
          />
        )}
      </PageContentWrapper>

      <OrganizationMemberFormModal
        opened={addMemberModal.isOpen}
        onClose={handleCloseAddModal}
        organizationId={currentOrganization?.id}
        organizationName={currentOrganization?.name}
        onSuccess={handleSuccessAdd}
      />

      <UserDetailModal
        opened={detailModal.isOpen && Boolean(selectedMember)}
        onClose={handleCloseDetail}
        user={selectedMember}
        membershipStatus={selectedMemberStatus ?? undefined}
      />
    </Box>
  );
};
