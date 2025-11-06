import { CertificateAuthorProfileType } from "./certificateAuthorProfileType";

export type CreateCertificateRequestType = {
  validFrom: string;
  validTo: string;
  certificateTypeId: string;
  organizationId: string;
  authorProfile: CertificateAuthorProfileType;
};
