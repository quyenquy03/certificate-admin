import { COUNTRIES } from "@/enums";

export type OrganizationResponseType = {
  id: string;
  name: string;
  description: string;
  website: string;
  countryCode: COUNTRIES;
  changeOwnerTxHash: string | null;
  initTxHash: string | null;
  isActive: boolean;
  isOwner: boolean;
  createdAt: string;
  updatedAt: string;
};
