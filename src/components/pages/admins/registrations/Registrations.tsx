"use client";

import {
  PageHeader,
  ButtonAdd,
  PaginationCustom,
  RegistrationItemSkeleton,
  RegistrationItem,
  RegistrationDetailModal,
  RegistrationApproveModal,
  RegistrationRejectModal,
} from "@/components";
import { ORGANIZATION_STATUS_OPTIONS, PAGINATION_PARAMS } from "@/constants";
import { SORTS } from "@/enums";
import { removeNoneCharacters, useDebounce, useDisclose } from "@/hooks";
import {
  useQueryGetAllRegistrations,
  useQueryGetRegistration,
} from "@/queries";
import { BasePaginationParams, RegistrationResponseType } from "@/types";
import { Box, Grid, Input, Select } from "@mantine/core";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

export const RegistrationsManagement = () => {
  const t = useTranslations();
  const detailModal = useDisclose();
  const approveModal = useDisclose();
  const rejectModal = useDisclose();
  const [selectedRegistration, setSelectedRegistration] =
    useState<RegistrationResponseType | null>(null);
  const [selectedRegistrationId, setSelectedRegistrationId] = useState<
    string | null
  >(null);

  const [searchParams, setSearchParams] = useState<BasePaginationParams>({
    page: PAGINATION_PARAMS.GET_USERS.page,
    limit: PAGINATION_PARAMS.GET_USERS.limit,
    search: "",
    sort: {
      createdAt: SORTS.DESC,
    },
  });

  const searchDebouncedValue = useDebounce(
    searchParams.search?.trim() ?? "",
    700
  );

  const {
    data: registrationsData,
    isFetching,
    refetch: refetchListRegistrations,
  } = useQueryGetAllRegistrations({
    ...searchParams,
    search: removeNoneCharacters(searchDebouncedValue),
  });

  const { data: registrationDetail, isFetching: isFetchingRegistrationDetail } =
    useQueryGetRegistration(selectedRegistrationId ?? "", {
      enabled: detailModal.isOpen && !!selectedRegistrationId,
    } as any);

  const registrationDetailData = registrationDetail?.data ?? null;
  const isRegistrationLoading =
    isFetchingRegistrationDetail && !registrationDetailData;

  useEffect(() => {
    refetchListRegistrations();
  }, [
    refetchListRegistrations,
    searchParams.limit,
    searchParams.page,
    searchParams.filters,
    searchDebouncedValue,
  ]);

  const handleViewDetail = (registration: RegistrationResponseType) => {
    setSelectedRegistration(registration);
    setSelectedRegistrationId(registration.id);
    approveModal.onClose();
    rejectModal.onClose();
    detailModal.onOpen();
  };

  const handleCloseDetailModal = () => {
    detailModal.onClose();
    setSelectedRegistration(null);
    setSelectedRegistrationId(null);
  };

  const handleOpenApproveModal = (registration: RegistrationResponseType) => {
    setSelectedRegistration(registration);
    detailModal.onClose();
    rejectModal.onClose();
    approveModal.onOpen();
  };

  const handleCloseApproveModal = () => {
    approveModal.onClose();
    setSelectedRegistration(null);
  };

  const handleOpenRejectModal = (registration: RegistrationResponseType) => {
    setSelectedRegistration(registration);
    detailModal.onClose();
    approveModal.onClose();
    rejectModal.onOpen();
  };

  const handleCloseRejectModal = () => {
    rejectModal.onClose();
    setSelectedRegistration(null);
  };

  const handleChangeStatus = (value: string | null) => {
    setSearchParams((prev) => {
      const nextFilters = { ...(prev.filters ?? {}) };

      if (value) {
        nextFilters.status = { eq: value };
      } else {
        delete nextFilters.status;
      }

      const hasFilters = Object.keys(nextFilters).length > 0;

      return {
        ...prev,
        page: PAGINATION_PARAMS.GET_USERS.page,
        filters: hasFilters ? nextFilters : undefined,
      };
    });
  };

  return (
    <Box className="w-full relative">
      <PageHeader
        title={t("registrations_management")}
        classNames={{ wrapper: "relative z-10 gap-4" }}
      >
        <Select
          data={ORGANIZATION_STATUS_OPTIONS.map((item) => ({
            ...item,
            label: t(item.label),
          }))}
          checkIconPosition="right"
          allowDeselect
          placeholder={t("status")}
          classNames={{
            wrapper: "w-[140px]",
            input: "rounded-sm",
            option: "text-color-light",
          }}
          value={
            typeof searchParams.filters?.status?.eq === "string"
              ? searchParams.filters?.status?.eq
              : null
          }
          onChange={handleChangeStatus}
        />
        <Input
          placeholder={t("enter_search_keyword")}
          className="w-full max-w-[200px]"
        />
        <ButtonAdd />
      </PageHeader>

      <Box className="overflow-y-auto h-[calc(100vh-56px)] p-4">
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
                  <RegistrationItemSkeleton />
                </Grid.Col>
              ))}
          </Grid>
        ) : registrationsData &&
          registrationsData.data &&
          registrationsData.data?.length > 0 ? (
          <Grid gutter="md">
            {registrationsData?.data.map((item) => (
              <Grid.Col
                key={item.id}
                span={{
                  base: 12,
                  sm: 12,
                  md: 6,
                  xl: 4,
                }}
              >
                <RegistrationItem
                  registration={item}
                  onViewDetail={handleViewDetail}
                  onApprove={handleOpenApproveModal}
                  onReject={handleOpenRejectModal}
                />
              </Grid.Col>
            ))}
          </Grid>
        ) : (
          <div>no user</div>
        )}
        {registrationsData &&
          registrationsData?.pagination &&
          registrationsData?.pagination?.totalPage > 1 && (
            <PaginationCustom
              value={searchParams?.page}
              total={registrationsData?.pagination?.totalPage ?? 0}
              onChange={(page) =>
                setSearchParams((prev) => ({ ...prev, page }))
              }
            />
          )}

        <RegistrationDetailModal
          opened={detailModal.isOpen}
          onClose={handleCloseDetailModal}
          registration={registrationDetailData}
          isLoading={isRegistrationLoading}
          onApprove={handleOpenApproveModal}
          onReject={handleOpenRejectModal}
          size="lg"
        />
        <RegistrationApproveModal
          opened={approveModal.isOpen}
          onClose={handleCloseApproveModal}
          registration={selectedRegistration}
          refetchListRegistrations={refetchListRegistrations}
        />
        <RegistrationRejectModal
          opened={rejectModal.isOpen}
          onClose={handleCloseRejectModal}
          registration={selectedRegistration}
          refetchListRegistrations={refetchListRegistrations}
        />
      </Box>
    </Box>
  );
};
