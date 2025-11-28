import { CERTIFICATE_REQUEST_TYPES } from "@/enums";

export type SubmitCertificateRequestType = {
  requestType: CERTIFICATE_REQUEST_TYPES;
  revokeReason: string;
  certificateId: string;
};
