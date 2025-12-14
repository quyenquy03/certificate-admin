"use client";

import { ButtonAdd } from "@/components/buttons";
import { PageHeader } from "@/components/headers";
import { Box, Input } from "@mantine/core";
import { useTranslations } from "next-intl";
import React from "react";

import { CertificateDailyStatsChart } from "./CertificateDailyStatsChart";
import { DashboardOverview } from "./DashboardOverview";
import { DashboardAdditionalStats } from "./DashboardAdditionalStats";
import { PageContentWrapper } from "@/components/wrappers";

export const Dashboard = () => {
  const t = useTranslations();
  return (
    <Box className="w-full relative flex flex-col">
      <PageHeader
        title={t("dashboard")}
        classNames={{ wrapper: "relative z-10 gap-4" }}
      >
        <Input
          placeholder={t("enter_search_keyword")}
          className="w-full max-w-[200px]"
        />
        <ButtonAdd />
      </PageHeader>

      <PageContentWrapper className="flex flex-col gap-4">
        <DashboardOverview />
        <CertificateDailyStatsChart />
        <DashboardAdditionalStats />
      </PageContentWrapper>
    </Box>
  );
};
