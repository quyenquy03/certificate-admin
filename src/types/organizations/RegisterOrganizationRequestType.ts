export type RegisterOrganizationRequestType = {
  walletAddress: string;
  ownerFirstName: string;
  ownerLastName: string;
  email: string;
  phoneNumber: string;
  organizationName: string;
  organizationDescription: string;
  website: string;
  countryCode: string;
  additionalInfo?: string;
};
