"use client";

import { PageHeader, ButtonAdd } from "@/components";
import { useQueryGetAllOrganizations } from "@/queries";
import { Box, Input } from "@mantine/core";
import { useTranslations } from "next-intl";

export const OrganizationsManagement = () => {
  const t = useTranslations();

  const { data } = useQueryGetAllOrganizations();
  console.log("Organizations data:", data);
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
