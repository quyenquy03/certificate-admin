import { COUNTRIES } from "@/enums";

export type CertificateAuthorProfileType = {
  authorName: string;
  authorIdCard: string;
  authorDob: string;
  authorEmail: string;
  authorImage: string;
  authorDocuments: string[];
  authorCountryCode: COUNTRIES;
  grantLevel: number;
};
