"use client";

import { LoadingOverlay, OrganizationMembers } from "@/components";
import { useQueryGetOrganization } from "@/queries";
import { Box } from "@mantine/core";

type OrganizationMembersManagementProps = {
  organizationId: string;
};
export const AdminOrganizationMembersManagement = ({
  organizationId,
}: OrganizationMembersManagementProps) => {
  const {
    data: organizationResponse,
    isFetching,
    isLoading,
  } = useQueryGetOrganization(organizationId, {
    enabled: Boolean(organizationId),
  } as any);

  const organization = organizationResponse?.data ?? null;

  console.log("organization", organization);

  return (
    <Box className="relative w-full h-full">
      <LoadingOverlay
        visible={isFetching || isLoading}
        overlayProps={{ blur: 1 }}
      />
      <OrganizationMembers isAdmin currentOrganization={organization} />
    </Box>
  );
};
