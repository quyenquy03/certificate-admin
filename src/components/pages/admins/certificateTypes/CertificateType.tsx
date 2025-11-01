"use client";

import {
  PageHeader,
  ButtonAdd,
  PaginationCustom,
  CertificateTypeItemSkeleton,
  CertificateTypeItem,
  CertificateTypeFormModal,
  CertificateTypeDetailModal,
} from "@/components";
import { PAGINATION_PARAMS } from "@/constants";
import { SORTS } from "@/enums";
import { removeNoneCharacters, useDebounce, useDisclose } from "@/hooks";
import {
  useQueryGetAllCertificateTypes,
  useQueryGetCertificateType,
} from "@/queries";
import { BasePaginationParams, CertificateCategoryType } from "@/types";
import { Box, Grid, Input } from "@mantine/core";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

export const CertificateTypesManagement = () => {
  const t = useTranslations();
  const detailModal = useDisclose();
  const createModal = useDisclose();
  const [selectedCertificateType, setSelectedCertificateType] =
    useState<CertificateCategoryType | null>(null);
  const [selectedCertificateTypeId, setSelectedCertificateTypeId] = useState<
    string | null
  >(null);

  const [searchParams, setSearchParams] = useState<BasePaginationParams>({
    page: PAGINATION_PARAMS.GET_CERTIFICATE_TYPES.page,
    limit: PAGINATION_PARAMS.GET_CERTIFICATE_TYPES.limit,
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
    data: certificateTypesData,
    isFetching,
    refetch: refetchListCertificateTypes,
  } = useQueryGetAllCertificateTypes({
    ...searchParams,
    search: removeNoneCharacters(searchDebouncedValue),
  });

  const {
    data: certificateTypeDetail,
    isFetching: isFetchingCertificateTypeDetail,
  } = useQueryGetCertificateType(selectedCertificateTypeId ?? "", {
    enabled: detailModal.isOpen && !!selectedCertificateTypeId,
  } as any);

  const certificateTypeDetailData =
    (Array.isArray(certificateTypeDetail?.data)
      ? certificateTypeDetail?.data?.[0]
      : certificateTypeDetail?.data) ?? selectedCertificateType;
  const isCertificateTypeLoading =
    isFetchingCertificateTypeDetail && !certificateTypeDetailData;

  useEffect(() => {
    refetchListCertificateTypes();
  }, [
    refetchListCertificateTypes,
    searchParams.limit,
    searchParams.page,
    searchParams.filters,
    searchDebouncedValue,
  ]);

  const handleOpenCreateModal = () => {
    setSelectedCertificateType(null);
    setSelectedCertificateTypeId(null);
    createModal.onOpen();
  };

  const handleCloseCreateModal = () => {
    createModal.onClose();
    setSelectedCertificateType(null);
    setSelectedCertificateTypeId(null);
  };

  const handleSuccessCreate = () => {
    refetchListCertificateTypes();
  };

  const handleViewDetail = (certificateType: CertificateCategoryType) => {
    setSelectedCertificateType(certificateType);
    setSelectedCertificateTypeId(certificateType.id);
    detailModal.onOpen();
  };

  const handleCloseDetailModal = () => {
    detailModal.onClose();
    setSelectedCertificateType(null);
    setSelectedCertificateTypeId(null);
  };

  return (
    <Box className="w-full relative">
      <PageHeader
        title={t("certificate_types_management")}
        classNames={{ wrapper: "relative z-10 gap-4" }}
      >
        <Input
          placeholder={t("enter_search_keyword")}
          className="w-full max-w-[200px]"
          value={searchParams?.search ?? ""}
          onChange={(event) =>
            setSearchParams((prev) => ({
              ...prev,
              search: event.target.value,
            }))
          }
        />
        <ButtonAdd onClick={handleOpenCreateModal} />
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
                  <CertificateTypeItemSkeleton />
                </Grid.Col>
              ))}
          </Grid>
        ) : certificateTypesData &&
          certificateTypesData.data &&
          certificateTypesData.data?.length > 0 ? (
          <Grid gutter="md">
            {certificateTypesData?.data.map((item) => (
              <Grid.Col
                key={item.id}
                span={{
                  base: 12,
                  sm: 12,
                  md: 6,
                  xl: 4,
                }}
              >
                <CertificateTypeItem
                  certificateType={item}
                  onViewDetail={handleViewDetail}
                />
              </Grid.Col>
            ))}
          </Grid>
        ) : (
          <div>no user</div>
        )}
        {certificateTypesData &&
          certificateTypesData?.pagination &&
          certificateTypesData?.pagination?.totalPage > 1 && (
            <PaginationCustom
              value={searchParams?.page}
              total={certificateTypesData?.pagination?.totalPage ?? 0}
              onChange={(page) =>
                setSearchParams((prev) => ({ ...prev, page }))
              }
            />
          )}
      </Box>
      <CertificateTypeFormModal
        opened={createModal.isOpen}
        onClose={handleCloseCreateModal}
        onSuccess={handleSuccessCreate}
      />
      <CertificateTypeDetailModal
        opened={detailModal.isOpen}
        onClose={handleCloseDetailModal}
        certificateType={certificateTypeDetailData ?? null}
        isLoading={isCertificateTypeLoading}
        size="lg"
      />
    </Box>
  );
};
