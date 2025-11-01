"use client";

import { PageHeader, ButtonAdd } from "@/components";
import { Box, Input } from "@mantine/core";
import { useTranslations } from "next-intl";

export const OrganizationsManagement = () => {
  const t = useTranslations();

  return (
    <Box className="w-full relative">
      <PageHeader
        title={t("organizations_management")}
        classNames={{ wrapper: "relative z-10 gap-4" }}
      >
        <Input
          placeholder={t("enter_search_keyword")}
          className="w-full max-w-[200px]"
        />
        <ButtonAdd />
      </PageHeader>
    </Box>
  );
};
