"use client";

import {
  ButtonAdd,
  OrganizationDetailModal,
  OrganizationItem,
  PageContentWrapper,
  PageHeader,
  RegistrationItemSkeleton,
} from "@/components";
import { removeNoneCharacters, useDebounce, useDisclose } from "@/hooks";
import { useQueryGetAllOrganizations } from "@/queries";
import { OrganizationResponseType } from "@/types";
import { Box, Grid, Input, Text } from "@mantine/core";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

export const OrganizationsManagement = () => {
  const t = useTranslations();
  const router = useRouter();
  const detailModal = useDisclose();
  const [mounted, setMounted] = useState(false);

  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedOrganization, setSelectedOrganization] =
    useState<OrganizationResponseType | null>(null);

  useEffect(() => setMounted(true), []);

  const debouncedSearch = useDebounce(searchKeyword, 500);
  const normalizedKeyword = removeNoneCharacters(
    debouncedSearch ?? ""
  ).toLowerCase();

  const { data, isFetching, isLoading } = useQueryGetAllOrganizations();

  const organizations = data?.data ?? [];

  const filteredOrganizations = useMemo(() => {
    if (!normalizedKeyword.length) return organizations;

    return organizations.filter((organization) => {
      const searchableContent = [organization.name, organization.description]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableContent.includes(normalizedKeyword);
    });
  }, [organizations, normalizedKeyword]);

  const handleOpenDetailModal = (organization: OrganizationResponseType) => {
    setSelectedOrganization(organization);
    detailModal.onOpen();
  };

  const handleCloseDetailModal = () => {
    setSelectedOrganization(null);
    detailModal.onClose();
  };

  const handleNavigateMembers = (organization: OrganizationResponseType) => {
    router.push(`/admins/organizations/${organization.id}/members`);
  };

  const handleNavigateCertificates = (
    organization: OrganizationResponseType
  ) => {
    router.push(`/admins/organizations/${organization.id}/certificates`);
  };

  const hasOrganizations = filteredOrganizations.length > 0;
  const isLoadingOrganizations = isFetching || isLoading;

  if (!mounted) return null;

  return (
    <Box className="w-full relative flex h-full flex-col">
      <PageHeader
        title={t("organizations_management")}
        classNames={{
          wrapper:
            "bg-white/90 backdrop-blur dark:bg-slate-950/90 rounded-sm gap-4",
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
        {isLoadingOrganizations ? (
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
                  onShowDetail={handleOpenDetailModal}
                  onViewMembers={handleNavigateMembers}
                  onViewCertificates={handleNavigateCertificates}
                />
              </Grid.Col>
            ))}
          </Grid>
        ) : (
          <Box className="flex h-full w-full items-center justify-center">
            <Text className="text-sm text-gray-500 dark:text-gray-300">
              {t("organization_not_found")}
            </Text>
          </Box>
        )}
      </PageContentWrapper>

      <OrganizationDetailModal
        opened={detailModal.isOpen && Boolean(selectedOrganization)}
        onClose={handleCloseDetailModal}
        organization={selectedOrganization}
      />
    </Box>
  );
};
