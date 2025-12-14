"use client";

import { CertificatesManagement, LoadingOverlay } from "@/components";
import { useQueryGetOrganization } from "@/queries";
import { Box } from "@mantine/core";
import React, { useEffect, useState } from "react";

type OrganizationCertificatesProps = {
  organizationId: string;
};
export const AdminOrganizationCertificates = ({
  organizationId,
}: OrganizationCertificatesProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const {
    data: organizationResponse,
    isFetching,
    isLoading,
  } = useQueryGetOrganization(organizationId, {
    enabled: Boolean(organizationId),
  } as any);

  const organization = organizationResponse?.data ?? null;

  if (!mounted) return null;

  return (
    <Box className="relative w-full h-full">
      <LoadingOverlay
        visible={isFetching || isLoading}
        overlayProps={{ blur: 1 }}
      />
      <CertificatesManagement isAdmin currentOrganization={organization} />
    </Box>
  );
};
