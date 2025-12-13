import { CERTIFICATE_STATUSES } from "@/enums";
import { CertificateCategoryType } from "./certificateCategoryType";
import { CertificateAuthorProfileType } from "./certificateAuthorProfileType";
import { UserResponseType } from "../users";

export type CertificateResponseType = {
  id: string;
  createdAt: string;
  updatedAt: string;
  code: string;
  certificateHash: string;
  status: CERTIFICATE_STATUSES;
  validFrom: string;
  validTo: string;
  certificateTypeId: string;
  organizationId: string;
  issuerId: string;
  issuer: UserResponseType;
  approvedAt: string;
  revokedAt: string;
  signedTxHash: string;
  approvedTxHash: string;
  revokedTxHash: string;
  certificateType: CertificateCategoryType;
  authorProfile?: CertificateAuthorProfileType;
};
