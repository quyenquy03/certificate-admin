import { CERTIFICATE_TYPE_ADDITIONAL_FIELD } from "@/enums";

export type CertificateCategoryAdditionalInfoType = {
  [K in CERTIFICATE_TYPE_ADDITIONAL_FIELD]?: unknown;
};

export type CertificateCategoryRequestType = {
  id?: string;
  code: string;
  name: string;
  description?: string;
  additionalInfo?: string;
};
