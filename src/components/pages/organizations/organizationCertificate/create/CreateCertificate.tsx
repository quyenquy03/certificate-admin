"use client";

import { CreateCertificate } from "@/components";
import { stores } from "@/stores";
import React from "react";

export const OrganizationCreateCertificate = () => {
  const { currentOrganization } = stores.organization();
  return <CreateCertificate currentOrganization={currentOrganization} />;
};
