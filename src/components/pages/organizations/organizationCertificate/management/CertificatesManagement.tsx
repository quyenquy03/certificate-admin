"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ButtonAdd,
  CertificateItem,
  CertificateItemSkeleton,
  CertificateDetailModal,
  PageHeader,
  PaginationCustom,
  NoData,
  PageContentWrapper,
} from "@/components";
import { Box, Grid, Group, Input, Select, Stack, Text } from "@mantine/core";
import { useTranslations } from "next-intl";
import { useDebounce, useDisclose } from "@/hooks";
import { useQueryGetOrganizationCertificates } from "@/queries";
import {
  BasePaginationParams,
  CertificateResponseType,
  SubmitCertificateRequestType,
} from "@/types";
import {
  CERTIFICATE_REQUEST_TYPES,
  CERTIFICATE_STATUSES,
  SORTS,
} from "@/enums";
import { PAGINATION_PARAMS, PAGE_URLS } from "@/constants";
import { stores } from "@/stores";
import { useRouter } from "next/navigation";

export const CertificatesManagement = () => {
  const t = useTranslations();
  const router = useRouter();
  const { currentOrganization } = stores.organization();
  const headerRef = useRef<HTMLDivElement | null>(null);
  const detailModal = useDisclose();
  const [selectedCertificate, setSelectedCertificate] =
    useState<CertificateResponseType | null>(null);

  const [searchParams, setSearchParams] = useState<BasePaginationParams>({
    page: PAGINATION_PARAMS.GET_CERTIFICATES.page,
    limit: PAGINATION_PARAMS.GET_CERTIFICATES.limit,
    search: "",
    sort: { createdAt: SORTS.DESC },
    filters: undefined,
  });

  const debouncedSearch = useDebounce(searchParams.search ?? "", 500);

  const statusOptions = useMemo(
    () =>
      Object.values(CERTIFICATE_STATUSES).map((status) => ({
        value: status,
        label: t(status),
      })),
    [t]
  );

  const {
    data: certificatesResponse,
    isFetching,
    isLoading,
    refetch,
  } = useQueryGetOrganizationCertificates(
    {
      id: currentOrganization?.id ?? "",
      page: searchParams.page,
      limit: searchParams.limit,
      search: debouncedSearch.trim() || undefined,
      sort: searchParams.sort,
      filters: searchParams.filters,
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
    debouncedSearch,
    searchParams.page,
    searchParams.limit,
    searchParams.filters,
    refetch,
  ]);

  const handleSearchChange = (value: string) => {
    setSearchParams((prev) => ({
      ...prev,
      search: value,
      page: PAGINATION_PARAMS.DEFAULT.page,
    }));
  };

  const handleStatusChange = (value: string | null) => {
    setSearchParams((prev) => {
      const filters = { ...(prev.filters ?? {}) };
      if (value) {
        filters.status = { eq: value };
      } else {
        delete filters.status;
      }

      return {
        ...prev,
        filters: Object.keys(filters).length ? filters : undefined,
        page: PAGINATION_PARAMS.DEFAULT.page,
      };
    });
  };

  const handlePageChange = (page: number) => {
    setSearchParams((prev) => ({ ...prev, page }));
    headerRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const certificates = certificatesResponse?.data ?? [];
  const totalPages = certificatesResponse?.pagination?.totalPage ?? 0;

  const isEmptyState = !isFetching && certificates.length === 0;

  const handleShowCertificateDetail = (
    certificate: CertificateResponseType
  ) => {
    setSelectedCertificate(certificate);
    detailModal.onOpen();
  };

  const handleCloseCertificateDetail = () => {
    detailModal.onClose();
    setSelectedCertificate(null);
  };

  const handleUpdateCertificate = (certificate: CertificateResponseType) => {
    console.log("Update certificate", certificate.id);
  };

  const handleDeleteCertificate = (certificate: CertificateResponseType) => {
    console.log("Delete certificate", certificate.id);
  };

  const handleSignSuccess = () => {
    detailModal.onClose();
    refetch();
  };

  return (
    <Box className="w-full relative flex h-full flex-col">
      <PageHeader
        title={t("certificates")}
        classNames={{
          wrapper: "bg-white/90 backdrop-blur dark:bg-slate-950/90 rounded-sm",
        }}
      >
        <Group wrap="nowrap">
          <Select
            placeholder={t("status")}
            data={statusOptions}
            value={(searchParams.filters?.status?.eq as string | null) ?? null}
            onChange={handleStatusChange}
            className="w-full max-w-[180px] hidden lg:block"
            allowDeselect
          />

          <Input
            placeholder={t("enter_search_keyword")}
            value={searchParams.search}
            onChange={(event) => handleSearchChange(event.currentTarget.value)}
            className="w-full max-w-[240px] hidden lg:block"
          />

          <ButtonAdd
            onClick={() =>
              router.push(PAGE_URLS.ORGANIZATION_CREATE_CERTIFICATE)
            }
          />
        </Group>
      </PageHeader>
      <PageContentWrapper>
        <div ref={headerRef}></div>
        {isLoading ? (
          <Grid gutter="md">
            {Array.from({ length: searchParams.limit }).map((_, index) => (
              <Grid.Col key={index} span={{ base: 12, md: 6, xl: 4 }}>
                <CertificateItemSkeleton />
              </Grid.Col>
            ))}
          </Grid>
        ) : isEmptyState ? (
          <NoData />
        ) : (
          <Grid gutter="md">
            {certificates.map((certificate) => (
              <Grid.Col key={certificate.id} span={{ base: 12, md: 6, xl: 4 }}>
                <CertificateItem
                  certificate={certificate}
                  onShowDetail={handleShowCertificateDetail}
                  onUpdate={handleUpdateCertificate}
                  onDelete={handleDeleteCertificate}
                />
              </Grid.Col>
            ))}
          </Grid>
        )}

        {totalPages > 1 && (
          <PaginationCustom
            value={searchParams.page}
            total={totalPages}
            onChange={handlePageChange}
          />
        )}

        <CertificateDetailModal
          opened={detailModal.isOpen}
          onClose={handleCloseCertificateDetail}
          certificate={selectedCertificate}
          onSignSuccess={handleSignSuccess}
        />
      </PageContentWrapper>
    </Box>
  );
};
