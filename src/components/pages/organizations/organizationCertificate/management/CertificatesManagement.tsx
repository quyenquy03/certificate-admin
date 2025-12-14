"use client";

import { CertificatesManagement } from "@/components";
import { stores } from "@/stores";

export const OrganizationCertificateManagement = () => {
  const { currentOrganization } = stores.organization();
  return <CertificatesManagement currentOrganization={currentOrganization} />;
};
