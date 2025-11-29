import {
  CERTIFICATE_REQUEST_STATUSES,
  CERTIFICATE_REQUEST_TYPES,
} from "@/enums";
import { CertificateDetailType } from "./certificateDetailType";
import { OrganizationResponseType } from "../organizations";

export type CertificateRequestType = {
  id: string;
  requestType: CERTIFICATE_REQUEST_TYPES;
  status: CERTIFICATE_REQUEST_STATUSES;
  requestedTime: string;
  rejectionReason: string;
  organizationId: string;
  certificateId: string;
  certificate: CertificateDetailType;
  organization: OrganizationResponseType;
};
