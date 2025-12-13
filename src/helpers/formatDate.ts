import moment from "moment";

type FormatDate = "YYYY/MM/DD" | "DD/MM/YYYY" | "DD/MMM/YYYY";

export const formatDate = (date: string, format: FormatDate = "DD/MM/YYYY") => {
  if (!date || date?.trim() === "") return "Invalid date";
  return moment(date).format(format);
};

export const formatFullDate = (date: string, locale: "en" | "vi" = "vi") => {
  if (!date || date?.trim() === "") return "Invalid date";

  const d = moment(date);

  if (!d.isValid()) return "Invalid date";

  if (locale === "en") {
    return d.format("MMMM DD, YYYY");
  }

  return `ngày ${d.format("DD")} tháng ${d.format("MM")} năm ${d.format(
    "YYYY"
  )}`;
};

export const excelDateToJSDate = (serial: number) => {
  const utc_days = Math.floor(serial - 25569);
  const utc_value = utc_days * 86400;
  const date_info = new Date(utc_value * 1000);
  return date_info;
};

export const calculateEndDate = (
  startDate: Date | string | null | undefined,
  durationYears: number | string | null | undefined
): string => {
  if (!startDate || durationYears === undefined || durationYears === null) {
    return "";
  }

  const parsedDuration = Number(durationYears);
  if (Number.isNaN(parsedDuration)) return "";

  const start = new Date(startDate);
  if (Number.isNaN(start.getTime())) return "";

  const months = Math.round(parsedDuration * 12);
  const end = new Date(start);
  end.setMonth(end.getMonth() + months);

  return end.toISOString();
};
