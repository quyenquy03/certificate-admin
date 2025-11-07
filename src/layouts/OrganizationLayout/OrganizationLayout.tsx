"use client";

import { ReactNode, useEffect } from "react";
import { useQueryGetMyOrganizations } from "@/queries";
import { stores } from "@/stores";

type OrganizationLayoutProps = {
  children: ReactNode;
};

export const OrganizationLayout = ({ children }: OrganizationLayoutProps) => {
  const { setCurrentOrganization } = stores.organization();

  const { data: organizations } = useQueryGetMyOrganizations();

  useEffect(() => {
    if (!organizations?.data?.length) {
      setCurrentOrganization(null);
      return;
    }
    setCurrentOrganization(organizations.data[0]);
  }, [organizations, setCurrentOrganization]);

  return children;
};
