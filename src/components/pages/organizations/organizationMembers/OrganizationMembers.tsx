"use client";

import { OrganizationMembers } from "@/components";
import { stores } from "@/stores";
import React from "react";

export const OrganizationMembersManagement = () => {
  const { currentOrganization } = stores.organization();
  return <OrganizationMembers currentOrganization={currentOrganization} />;
};
