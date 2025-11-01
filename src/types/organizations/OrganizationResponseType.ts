import { ORGANIZATION_STATUSES } from "@/enums";

export type OrganizationResponseType = {
  id: string;
  walletAddress: string;
  ownerFirstName: string;
  ownerLastName: string;
  email: string;
  phoneNumber: string;
  organizationName: string;
  organizationDescription: string;
  website: string;
  countryCode: string;
  status: ORGANIZATION_STATUSES;
  createdAt: string;
  updatedAt: string;
};
