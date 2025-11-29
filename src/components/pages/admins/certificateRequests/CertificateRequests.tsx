"use client";

import {
  CertificateItemSkeleton,
  CertificateRequestItem,
  NoData,
  PageHeader,
  PaginationCustom,
} from "@/components";
import { PAGINATION_PARAMS } from "@/constants";
import { SORTS } from "@/enums";
import { useQueryGetAllCertificateRequests } from "@/queries";
import { BasePaginationParams } from "@/types";
import { Box, Grid } from "@mantine/core";
import { useTranslations } from "next-intl";
import React, { useRef, useState } from "react";

export const CertificateRequests = () => {
  const t = useTranslations();
  const headerRef = useRef<HTMLDivElement | null>(null);

  const {
    data: certificatesResponse,
    isLoading,
  } = useQueryGetAllCertificateRequests();

  const [searchParams, setSearchParams] = useState<BasePaginationParams>({
    page: PAGINATION_PARAMS.DEFAULT.page,
    limit: PAGINATION_PARAMS.DEFAULT.limit,
    search: "",
    sort: { createdAt: SORTS.DESC },
    filters: undefined,
  });

  const certificateRequests = certificatesResponse?.data ?? [];
  const totalPages = certificatesResponse?.pagination?.totalPage ?? 0;

  const handlePageChange = (page: number) => {
    setSearchParams((prev) => ({ ...prev, page }));
    headerRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Box className="w-full relative">
      <PageHeader
        title={t("certificate_requests_management")}
        classNames={{ wrapper: "relative z-10 gap-4" }}
      ></PageHeader>

      <Box className="overflow-y-auto h-[calc(100vh-56px)] p-4">
        {isLoading ? (
          <Grid gutter="md">
            {Array.from({ length: searchParams.limit }).map((_, index) => (
              <Grid.Col key={index} span={{ base: 12, md: 6, xl: 4 }}>
                <CertificateItemSkeleton />
              </Grid.Col>
            ))}
          </Grid>
        ) : certificateRequests?.length === 0 ? (
          <NoData />
        ) : (
          <Grid gutter="md">
            {certificateRequests.map((certificateRequest) => (
              <Grid.Col
                key={certificateRequest.id}
                span={{ base: 12, md: 6, xl: 4 }}
              >
                <CertificateRequestItem
                  certificateRequest={certificateRequest}
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
      </Box>
    </Box>
  );
};
