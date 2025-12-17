"use client";

import { CreateUpdateCertificate } from "@/components/organizationCertificates";
import { stores } from "@/stores";
import React from "react";

type OrganizationUpdateCertificateProps = {
  certificateId: string;
};
export const OrganizationUpdateCertificate = ({
  certificateId,
}: OrganizationUpdateCertificateProps) => {
  const { currentOrganization } = stores.organization();

  return (
    <CreateUpdateCertificate
      certificateId={certificateId}
      currentOrganization={currentOrganization}
    />
  );
};
