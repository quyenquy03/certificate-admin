import { ButtonAdd } from "@/components/buttons";
import { PageHeader } from "@/components/headers";
import { Box, Input } from "@mantine/core";
import { useTranslations } from "next-intl";
import React from "react";

export const MyOrganization = () => {
  const t = useTranslations();
  return (
    <Box className="w-full relative">
      <PageHeader
        title={t("my_organization")}
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
