import { OrganizationResponseType } from "@/types";
import { create } from "zustand";

type OrganizationStoreState = {
  // states type
  currentOrganization: OrganizationResponseType | null;
  organizations: OrganizationResponseType[];
  isLoading: boolean;

  // methods
  setCurrentOrganization: (
    organization: OrganizationResponseType | null
  ) => void;
  setOrganizations: (organizations: OrganizationResponseType[]) => void;
  setIsLoading: (isLoading: boolean) => void;
};

export const organization = create<OrganizationStoreState>((set) => ({
  currentOrganization: null,
  organizations: [],
  isLoading: false,

  setCurrentOrganization: (
    currentOrganization: OrganizationResponseType | null
  ) =>
    set({
      currentOrganization,
    }),
  setOrganizations: (organizations: OrganizationResponseType[]) =>
    set({ organizations }),
  setIsLoading: (isLoading: boolean) => set({ isLoading }),
}));
