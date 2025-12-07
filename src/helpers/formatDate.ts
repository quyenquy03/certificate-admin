import moment from "moment";

type FormatDate = "YYYY/MM/DD" | "DD/MM/YYYY";

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
  // 25569 là số ngày từ 1/1/1900 đến 1/1/1970
  const utc_days = Math.floor(serial - 25569);
  const utc_value = utc_days * 86400;
  const date_info = new Date(utc_value * 1000);
  return date_info;
};
