"use client";

import { CertificatesManagement } from "@/components";
import { stores } from "@/stores";

export const OrganizationCertificateManagement = () => {
  const { currentOrganization } = stores.organization();
  console.log("currentOrganization", currentOrganization);
  return <CertificatesManagement currentOrganization={currentOrganization} />;
};
