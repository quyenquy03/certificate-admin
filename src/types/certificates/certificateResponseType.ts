import { CERTIFICATE_STATUSES } from "@/enums";

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
  approvedAt: string;
  revokedAt: string;
  signedTxHash: string;
  approvedTxHash: string;
  revokedTxHash: string;
};
