import { CertificateAuthorProfileType } from "./certificateAuthorProfileType";

export type CreateEditCertificateRequestType = {
  id?: string;
  validFrom: string;
  validTo: string;
  certificateTypeId: string;
  organizationId: string;
  authorProfile: CertificateAuthorProfileType;
};
