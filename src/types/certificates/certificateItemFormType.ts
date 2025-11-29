import { CERTIFICATE_ADDITIONAL_FIELD, COUNTRIES } from "@/enums";

export type CertificateItemFormType = {
  authorName: string;
  authorIdCard: string;
  authorDob: Date | null | string;
  authorEmail: string;
  authorCountryCode: COUNTRIES;
  grantLevel: number;
  domain?: string;

  // additional field
  [CERTIFICATE_ADDITIONAL_FIELD.SERIAL_NUMBER]?: string;
  [CERTIFICATE_ADDITIONAL_FIELD.REG_NO]?: string;
};
