"use client";

import {
  ButtonAdd,
  PageHeader,
  OrganizationItem,
  RegistrationItemSkeleton,
  PageContentWrapper,
} from "@/components";
import { removeNoneCharacters, useDebounce } from "@/hooks";
import { stores } from "@/stores";
import { Box, Grid, Input, Text } from "@mantine/core";
import { useTranslations } from "next-intl";
import React, { useMemo, useState } from "react";

export const MyOrganization = () => {
  const t = useTranslations();
  const { organizations, isLoading, currentOrganization } =
    stores.organization();
  const [searchKeyword, setSearchKeyword] = useState("");

  const debouncedSearch = useDebounce(searchKeyword, 500);
  const normalizedKeyword = removeNoneCharacters(
    debouncedSearch ?? ""
  ).toLowerCase();

  const filteredOrganizations = useMemo(() => {
    if (!normalizedKeyword.length) {
      return organizations;
    }

    return organizations.filter((organization) => {
      const searchableContent = [organization.description, organization.name]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableContent.includes(normalizedKeyword);
    });
  }, [organizations, normalizedKeyword]);

  const hasOrganizations = filteredOrganizations.length > 0;

  return (
    <Box className="w-full relative flex h-full flex-col">
      <PageHeader
        title={t("my_organization")}
        classNames={{
          wrapper: "bg-white/90 backdrop-blur dark:bg-slate-950/90 rounded-sm",
        }}
      >
        <Input
          placeholder={t("enter_search_keyword")}
          className="w-full max-w-[240px]"
          value={searchKeyword}
          onChange={(event) => setSearchKeyword(event.currentTarget.value)}
        />
        <ButtonAdd />
      </PageHeader>

      <PageContentWrapper>
        {isLoading ? (
          <Grid gutter="md">
            {new Array(6).fill(0).map((_, index) => (
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
        ) : hasOrganizations ? (
          <Grid gutter="md">
            {filteredOrganizations.map((organization) => (
              <Grid.Col
                key={organization.id}
                span={{
                  base: 12,
                  sm: 12,
                  md: 6,
                  xl: 4,
                }}
              >
                <OrganizationItem
                  organization={organization}
                  isCurrent={organization.id === currentOrganization?.id}
                />
              </Grid.Col>
            ))}
          </Grid>
        ) : (
          <Box className="flex h-full w-full items-center justify-center">
            <Text className="text-sm text-gray-500 dark:text-gray-300">
              No organizations found
            </Text>
          </Box>
        )}
      </PageContentWrapper>
    </Box>
  );
};
