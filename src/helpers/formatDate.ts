import moment from "moment";

type FormatDate = "YYYY/MM/DD" | "DD/MM/YYYY";

export const formatDate = (date: string, format: FormatDate = "DD/MM/YYYY") => {
  console.log(date);
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
