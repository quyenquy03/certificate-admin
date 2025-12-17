"use client";

import { CreateUpdateCertificate } from "@/components";
import { stores } from "@/stores";
import React from "react";

export const OrganizationCreateCertificate = () => {
  const { currentOrganization } = stores.organization();
  return (
    <CreateUpdateCertificate
      certificateId={null}
      currentOrganization={currentOrganization}
    />
  );
};
