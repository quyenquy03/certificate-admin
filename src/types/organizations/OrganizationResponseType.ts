import { COUNTRIES, ORGANIZATION_STATUSES } from "@/enums";

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
  countryCode: COUNTRIES;
  status: ORGANIZATION_STATUSES;
  rejectReason?: string | null;
  createdAt: string;
  updatedAt: string;
};
