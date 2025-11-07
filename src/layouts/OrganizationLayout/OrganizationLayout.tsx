"use client";

import { ReactNode, useEffect } from "react";
import { useQueryGetMyOrganizations } from "@/queries";
import { stores } from "@/stores";
import { LOCAL_STORAGE_KEYS } from "@/constants";

type OrganizationLayoutProps = {
  children: ReactNode;
};

export const OrganizationLayout = ({ children }: OrganizationLayoutProps) => {
  const { setCurrentOrganization, setOrganizations, setIsLoading } =
    stores.organization();

  const { data: organizationsResponse, isFetching } =
    useQueryGetMyOrganizations();

  useEffect(() => {
    setIsLoading(isFetching);
  }, [isFetching, setIsLoading]);

  useEffect(() => {
    if (isFetching) return;

    if (!organizationsResponse?.data?.length) {
      setOrganizations([]);
      setCurrentOrganization(null);
      localStorage.removeItem(LOCAL_STORAGE_KEYS.CURRENT_ORGANIZATION);
      return;
    }

    const organizationList = organizationsResponse.data;

    setOrganizations(organizationList);

    const storedOrganizationId = localStorage.getItem(
      LOCAL_STORAGE_KEYS.CURRENT_ORGANIZATION
    );

    let nextOrganization = organizationList[0];

    if (storedOrganizationId) {
      const matchedOrganization = organizationList.find(
        (organizationItem) => organizationItem.id === storedOrganizationId
      );

      if (matchedOrganization) {
        nextOrganization = matchedOrganization;
      }
    }

    localStorage.setItem(
      LOCAL_STORAGE_KEYS.CURRENT_ORGANIZATION,
      nextOrganization.id
    );
    setCurrentOrganization(nextOrganization);
  }, [
    organizationsResponse,
    setCurrentOrganization,
    setOrganizations,
    isFetching,
  ]);

  return children;
};
