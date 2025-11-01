import { COUNTRIES } from "@/enums";

export const COUNTRY_LABELS = {
  [COUNTRIES.VIETNAM]: "country_vietnam",
  [COUNTRIES.UNITED_STATES]: "country_united_states",
  [COUNTRIES.UNITED_KINGDOM]: "country_united_kingdom",
  [COUNTRIES.JAPAN]: "country_japan",
  [COUNTRIES.SOUTH_KOREA]: "country_south_korea",
  [COUNTRIES.CHINA]: "country_china",
  [COUNTRIES.FRANCE]: "country_france",
  [COUNTRIES.GERMANY]: "country_germany",
  [COUNTRIES.CANADA]: "country_canada",
  [COUNTRIES.AUSTRALIA]: "country_australia",
  [COUNTRIES.SINGAPORE]: "country_singapore",
  [COUNTRIES.THAILAND]: "country_thailand",
  [COUNTRIES.INDONESIA]: "country_indonesia",
  [COUNTRIES.MALAYSIA]: "country_malaysia",
  [COUNTRIES.PHILIPPINES]: "country_philippines",
  [COUNTRIES.INDIA]: "country_india",
};

export const COUNTRY_OPTIONS = Object.values(COUNTRIES).map((country) => ({
  value: country,
  label: COUNTRY_LABELS[country],
}));
