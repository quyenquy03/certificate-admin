import { CertificateAuthorProfileType } from "./certificateAuthorProfileType";

export type ImportCertificateItem = {
  validFrom: string;
  validTo: string;
  authorProfile: CertificateAuthorProfileType;
};

export type ImportCertificateRequestType = {
  certificateTypeId: string;
  organizationId: string;
  certificates: ImportCertificateItem[];
};
