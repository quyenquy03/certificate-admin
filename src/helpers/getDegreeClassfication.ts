import { CERTIFICATE_LEVELS } from "@/enums";

export const getDegreeClassfication = (score: number): CERTIFICATE_LEVELS => {
  if (!Number.isFinite(score)) return CERTIFICATE_LEVELS.POOR;

  if (score >= 3.6) return CERTIFICATE_LEVELS.EXCELLENT;
  if (score >= 3.2) return CERTIFICATE_LEVELS.VERY_GOOD;
  if (score >= 2.5) return CERTIFICATE_LEVELS.GOOD;
  if (score >= 2.25) return CERTIFICATE_LEVELS.FAIR;
  if (score >= 2.5) return CERTIFICATE_LEVELS.AVERAGE;

  return CERTIFICATE_LEVELS.POOR;
};
