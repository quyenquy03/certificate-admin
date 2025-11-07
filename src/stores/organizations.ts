import { OrganizationResponseType } from "@/types";
import { create } from "zustand";

type OrganizationStoreState = {
  // states type
  currentOrganization: OrganizationResponseType | null;

  // methods
  setCurrentOrganization: (
    organization: OrganizationResponseType | null
  ) => void;
};

export const organization = create<OrganizationStoreState>((set) => ({
  currentOrganization: null,

  setCurrentOrganization: (
    currentOrganization: OrganizationResponseType | null
  ) =>
    set({
      currentOrganization,
    }),
}));
