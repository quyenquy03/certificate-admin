import { CERTIFICATE_LEVELS, IELTS_CEFRS } from "@/enums";
import { IeltsScoreType } from "@/types";

export const getDegreeClassfication = (score: number): CERTIFICATE_LEVELS => {
  if (!Number.isFinite(score)) return CERTIFICATE_LEVELS.POOR;

  if (score >= 3.6) return CERTIFICATE_LEVELS.EXCELLENT;
  if (score >= 3.2) return CERTIFICATE_LEVELS.VERY_GOOD;
  if (score >= 2.5) return CERTIFICATE_LEVELS.GOOD;
  if (score >= 2.25) return CERTIFICATE_LEVELS.FAIR;
  if (score >= 2.5) return CERTIFICATE_LEVELS.AVERAGE;

  return CERTIFICATE_LEVELS.POOR;
};

export const calculateIELTSOverall = (data: IeltsScoreType) => {
  const raw =
    (data.listening + data.reading + data.writing + data.speaking) / 4;

  const rounded = (() => {
    const decimal = raw - Math.floor(raw);

    if (decimal < 0.25) return Math.floor(raw);
    if (decimal < 0.75) return Math.floor(raw) + 0.5;
    return Math.floor(raw) + 1;
  })();

  // Mapping overall → CEFR
  let cefr: IELTS_CEFRS;

  if (rounded <= 3.5) cefr = IELTS_CEFRS.A2;
  else if (rounded <= 5.0) cefr = IELTS_CEFRS.B1;
  else if (rounded <= 6.5) cefr = IELTS_CEFRS.B2;
  else if (rounded <= 8.0) cefr = IELTS_CEFRS.C1;
  else cefr = IELTS_CEFRS.C2;

  return { overall: rounded, cefr };
};

export const formatScore = (value: string | number) => {
  if (value === null || value === undefined) return "";

  const str = String(value).trim();

  if (str.includes(".")) return str;

  return `${str}.0`;
};
