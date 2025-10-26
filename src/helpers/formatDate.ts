import moment from "moment";

type FormatDate = "YYYY/MM/DD" | "DD/MM/YYYY";

export const formatDate = (date: string, format: FormatDate = "DD/MM/YYYY") => {
  if (!date || date?.trim() === "") return "Invalid date";
  return moment(date).format(format);
};
