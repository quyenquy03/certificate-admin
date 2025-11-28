import { CERTIFICATE_REQUEST_STATUSES, CERTIFICATE_STATUSES } from "@/enums";

export type CertificateRequestType = {
  id: string;
  requestType: CERTIFICATE_STATUSES;
  status: CERTIFICATE_REQUEST_STATUSES;
  requestedTime: string;
  rejectionReason: string;
  organizationId: string;
  certificateId: string;
};
