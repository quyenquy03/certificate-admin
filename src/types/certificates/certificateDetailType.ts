import { CERTIFICATE_ADDITIONAL_FIELD, COUNTRIES } from "@/enums";
import { CertificateAuthorProfileType } from "./certificateAuthorProfileType";

export type AdditionalInfoType = {
  [K in CERTIFICATE_ADDITIONAL_FIELD]?: unknown;
};

export type AuthorProfileType = {
  authorName: string;
  authorIdCard: string;
  authorDob: string;
  authorEmail: string;
  authorImage: string;
  authorDocuments: string[];
  authorCountryCode: COUNTRIES;
  grantLevel: number;
  domain?: string;
  additionalInfo?: AdditionalInfoType;
};

export type CertificateDetailType = {
  certificateCode: string;
  organizationName: string;
  certificateType: string;
  authorProfile: CertificateAuthorProfileType;
  validFrom: string;
  validTo: string;
};
