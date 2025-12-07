import { GENDERS } from "@/enums";

export const GENDER_LABELS = {
  [GENDERS.MALE]: "male",
  [GENDERS.FEMALE]: "female",
  [GENDERS.OTHER]: "other",
};

export const GENDER_OPTIONS = [
  { value: String(GENDERS.MALE), label: GENDER_LABELS[GENDERS.MALE] },
  { value: String(GENDERS.FEMALE), label: GENDER_LABELS[GENDERS.FEMALE] },
  { value: String(GENDERS.OTHER), label: GENDER_LABELS[GENDERS.OTHER] },
];
