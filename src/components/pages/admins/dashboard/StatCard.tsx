import { Box, Text } from "@mantine/core";

type StatCardProps = {
  label: string;
  value: number | string;
  accentClass?: string;
};

export const StatCard = ({ label, value, accentClass }: StatCardProps) => (
  <Box
    className={`rounded-lg border border-slate-100/70 bg-gradient-to-br from-white via-slate-50 to-white p-4 shadow-sm dark:border-slate-800 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 ${accentClass}`}
  >
    <Text className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
      {label}
    </Text>
    <Text className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
      {typeof value === "number"
        ? value.toLocaleString("vi-VN")
        : value || "0"}
    </Text>
  </Box>
);
