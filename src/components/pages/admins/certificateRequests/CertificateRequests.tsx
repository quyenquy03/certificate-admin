"use client";

import { PageHeader } from "@/components";
import { useQueryGetAllCertificateRequests } from "@/queries";
import { Box, Input, Select } from "@mantine/core";
import { useTranslations } from "next-intl";
import React from "react";

export const CertificateRequests = () => {
  const t = useTranslations();
  const { data, refetch } = useQueryGetAllCertificateRequests();
  console.log(data);
  return (
    <Box className="w-full relative">
      <PageHeader
        title={t("certificate_requests_management")}
        classNames={{ wrapper: "relative z-10 gap-4" }}
      ></PageHeader>

      <Box className="overflow-y-auto h-[calc(100vh-56px)] p-4"></Box>
    </Box>
  );
};
