"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ActionIcon,
  Alert,
  Box,
  Flex,
  Input,
  Loader,
  Paper,
  Stack,
  Table,
  Text,
  useMantineColorScheme,
} from "@mantine/core";
import { useMantineTheme } from "@mantine/core";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts";
import { HiOutlineChartBar, HiOutlineTableCells } from "react-icons/hi2";
import { useTranslations } from "next-intl";

import { certificateApis } from "@/apis";
import { BaseResponseType, CertificateResponseType } from "@/types";

type CertificateWithOptionalDates = Partial<CertificateResponseType> & {
  signedAt?: string | null;
  expiresAt?: string | null;
  revokedAt?: string | null;
  createdAt?: string | null;
  approvedAt?: string | null;
  validTo?: string | null;
};

type StatsRow = {
  date: string; // YYYY-MM-DD
  createdCount: number;
  revokedCount: number;
  signedCount: number;
  expiredCount: number;
};

type CertificateStatChartProps = {
  organizationId?: string | null;
};

const DEFAULT_LIMIT = 1000;

const toDateKey = (value?: unknown): string | null => {
  if (!value || typeof value !== "string") return null;
  const parsed = new Date(value as string);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toISOString().slice(0, 10);
};

const toUtcDate = (value: string): Date => {
  if (!value) return new Date("");
  const [year, month, day] = value.split("-").map(Number);
  return new Date(Date.UTC(year, (month ?? 1) - 1, day ?? 1));
};

const formatDateInput = (value: Date) => value.toISOString().slice(0, 10);

const getDefaultDateRange = () => {
  const end = new Date();
  const start = new Date(end);
  start.setDate(end.getDate() - 6);

  return {
    startDate: formatDateInput(start),
    endDate: formatDateInput(end),
  };
};

export const CertificateStatChart = ({
  organizationId,
}: CertificateStatChartProps) => {
  const t = useTranslations();
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === "dark";

  const defaultRange = useMemo(() => getDefaultDateRange(), []);
  const [startDate, setStartDate] = useState(defaultRange.startDate);
  const [endDate, setEndDate] = useState(defaultRange.endDate);
  const [stats, setStats] = useState<StatsRow[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"chart" | "table">("chart");

  const hasInvalidRange = useMemo(() => {
    if (!startDate || !endDate) return false;
    return toUtcDate(endDate) < toUtcDate(startDate);
  }, [endDate, startDate]);

  useEffect(() => {
    let isMounted = true;

    const fetchStats = async () => {
      if (!organizationId) {
        setStats([]);
        setError(null);
        return;
      }

      if (!startDate || !endDate) {
        setError(t("organization_dashboard_certificate_stats_invalid_range"));
        setStats([]);
        return;
      }

      if (hasInvalidRange) {
        setError(t("organization_dashboard_certificate_stats_invalid_range"));
        setStats([]);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const requestPayload = (dateKey: string) => ({
          page: 1,
          limit: DEFAULT_LIMIT,
          filters: {
            organizationId: { eq: organizationId },
            [dateKey]: {
              gte: startDate,
              lte: endDate,
            },
          },
        });

        const [createdRes, revokedRes, signedRes, expiredRes] =
          await Promise.all([
            certificateApis.getCertificates(requestPayload("createdAt")),
            certificateApis.getCertificates(requestPayload("revokedAt")),
            certificateApis.getCertificates(requestPayload("approvedAt")),
            certificateApis.getCertificates(requestPayload("validTo")),
          ]);

        const normalize = (
          response:
            | BaseResponseType<CertificateResponseType[]>
            | CertificateWithOptionalDates[]
        ) => {
          const payload =
            (response as BaseResponseType<CertificateResponseType[]>)?.data ??
            (response as any)?.data ??
            response;
          return Array.isArray(payload) ? payload : [];
        };

        const createdCertificates = normalize(createdRes);
        const revokedCertificates = normalize(revokedRes);
        const signedCertificates = normalize(signedRes);
        const expiredCertificates = normalize(expiredRes);

        const days: string[] = [];
        const start = toUtcDate(startDate);
        const end = toUtcDate(endDate);
        const cursor = new Date(start);

        while (cursor <= end) {
          days.push(cursor.toISOString().slice(0, 10));
          cursor.setUTCDate(cursor.getUTCDate() + 1);
        }

        const baseStats = days.map<StatsRow>((day) => ({
          date: day,
          createdCount: 0,
          revokedCount: 0,
          signedCount: 0,
          expiredCount: 0,
        }));

        const incrementByDay = (
          items: CertificateWithOptionalDates[],
          dateField:
            | "createdAt"
            | "revokedAt"
            | "signedAt"
            | "approvedAt"
            | "validTo"
            | "expiresAt",
          key: "createdCount" | "revokedCount" | "signedCount" | "expiredCount"
        ) => {
          items.forEach((item) => {
            const dateKey = toDateKey(item?.[dateField]);
            if (!dateKey) return;
            const row = baseStats.find((stat) => stat.date === dateKey);
            if (row) row[key] += 1;
          });
        };

        incrementByDay(createdCertificates, "createdAt", "createdCount");
        incrementByDay(revokedCertificates, "revokedAt", "revokedCount");
        incrementByDay(signedCertificates, "approvedAt", "signedCount");
        incrementByDay(expiredCertificates, "validTo", "expiredCount");

        if (isMounted) {
          setStats(baseStats);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(t("organization_dashboard_certificate_stats_error"));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchStats();

    return () => {
      isMounted = false;
    };
  }, [endDate, hasInvalidRange, organizationId, startDate, t]);

  const chartLines = useMemo(
    () => [
      {
        key: "createdCount",
        stroke: theme.colors.blue[5] ?? "#0EA5E9",
        label: t("created"),
      },
      {
        key: "signedCount",
        stroke: theme.colors.green[5] ?? "#22C55E",
        label: t("signed"),
      },
      {
        key: "revokedCount",
        stroke: theme.colors.orange[5] ?? "#F97316",
        label: t("revoked"),
      },
      {
        key: "expiredCount",
        stroke: theme.colors.violet[5] ?? "#A855F7",
        label: t("expired"),
      },
    ],
    [t, theme]
  );

  const axisColor = isDark ? theme.colors.gray[4] : theme.colors.gray[7];
  const gridColor = isDark ? "#1f2937" : "#E5E7EB";
  const surfaceClasses =
    "rounded-sm border border-slate-200/70 bg-white/95 p-5 dark:border-slate-800/70 dark:bg-slate-900/70";

  const renderChart = () => {
    if (isLoading) {
      return (
        <Flex align="center" justify="center" className="h-[320px]">
          <Loader color="blue" />
        </Flex>
      );
    }

    if (!stats.length) {
      return (
        <Flex
          align="center"
          justify="center"
          className="h-[320px] rounded-lg border border-dashed border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400"
        >
          {organizationId
            ? t("organization_dashboard_certificate_stats_no_data")
            : t("organization_dashboard_certificate_stats_no_org")}
        </Flex>
      );
    }

    return (
      <ResponsiveContainer width="100%" height={420}>
        <LineChart
          data={stats}
          margin={{ top: 8, right: 8, left: -8, bottom: 8 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis dataKey="date" tick={{ fontSize: 12, fill: axisColor }} />
          <YAxis
            allowDecimals={false}
            tick={{ fontSize: 12, fill: axisColor }}
          />
          <RechartsTooltip />
          <Legend />
          {chartLines.map((line) => (
            <Line
              key={line.key}
              type="monotone"
              dataKey={line.key}
              stroke={line.stroke}
              strokeWidth={2}
              dot={false}
              name={line.label}
              isAnimationActive={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    );
  };

  const renderTable = () => {
    if (isLoading) {
      return (
        <Flex align="center" justify="center" className="h-[240px]">
          <Loader color="blue" />
        </Flex>
      );
    }

    if (!stats.length) {
      return (
        <Flex
          align="center"
          justify="center"
          className="h-[240px] rounded-lg border border-dashed border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400"
        >
          {organizationId
            ? t("organization_dashboard_certificate_stats_no_data")
            : t("organization_dashboard_certificate_stats_no_org")}
        </Flex>
      );
    }

    const totals = stats.reduce(
      (acc, curr) => {
        acc.createdCount += curr.createdCount;
        acc.signedCount += curr.signedCount;
        acc.revokedCount += curr.revokedCount;
        acc.expiredCount += curr.expiredCount;
        return acc;
      },
      { createdCount: 0, signedCount: 0, revokedCount: 0, expiredCount: 0 }
    );

    return (
      <Table
        striped
        highlightOnHover
        withTableBorder
        withColumnBorders
        className="text-sm text-center"
      >
        <Table.Thead className="bg-slate-100 text-slate-700 dark:bg-slate-800/50 dark:text-slate-100">
          <Table.Tr>
            <Table.Th className="font-semibold text-center">
              {t("organization_dashboard_certificate_stats_date")}
            </Table.Th>
            <Table.Th className="font-semibold text-center">
              {t("created")}
            </Table.Th>
            <Table.Th className="font-semibold text-center">
              {t("signed")}
            </Table.Th>
            <Table.Th className="font-semibold text-center">
              {t("revoked")}
            </Table.Th>
            <Table.Th className="font-semibold text-center">
              {t("expired")}
            </Table.Th>
            <Table.Th className="font-semibold text-center">
              {t("organization_dashboard_certificate_stats_total_per_day")}
            </Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {stats.map((row) => {
            const rowTotal =
              row.createdCount +
              row.signedCount +
              row.revokedCount +
              row.expiredCount;
            return (
              <Table.Tr
                key={row.date}
                className="text-slate-700 dark:text-slate-200"
              >
                <Table.Td className="font-medium text-slate-900 dark:text-white">
                  {row.date}
                </Table.Td>
                <Table.Td className="text-slate-700 dark:text-slate-200">
                  {row.createdCount}
                </Table.Td>
                <Table.Td className="text-slate-700 dark:text-slate-200">
                  {row.signedCount}
                </Table.Td>
                <Table.Td className="text-slate-700 dark:text-slate-200">
                  {row.revokedCount}
                </Table.Td>
                <Table.Td className="text-slate-700 dark:text-slate-200">
                  {row.expiredCount}
                </Table.Td>
                <Table.Td className="font-semibold text-slate-900 dark:text-white">
                  {rowTotal}
                </Table.Td>
              </Table.Tr>
            );
          })}
        </Table.Tbody>
        <Table.Tfoot className="bg-slate-200 text-slate-800 dark:bg-slate-900/70 dark:text-white">
          <Table.Tr className="font-semibold">
            <Table.Th className="text-center">
              {t("total")}
            </Table.Th>
            <Table.Th className="text-center">{totals.createdCount}</Table.Th>
            <Table.Th className="text-center">{totals.signedCount}</Table.Th>
            <Table.Th className="text-center">{totals.revokedCount}</Table.Th>
            <Table.Th className="text-center">{totals.expiredCount}</Table.Th>
            <Table.Th className="text-center">
              {totals.createdCount +
                totals.signedCount +
                totals.revokedCount +
                totals.expiredCount}
            </Table.Th>
          </Table.Tr>
        </Table.Tfoot>
      </Table>
    );
  };

  return (
    <Paper radius="sm" shadow="md" className={surfaceClasses}>
      <Stack gap="md">
        <Flex align="center" justify="space-between" gap={12} wrap="wrap">
          <Box>
            <Text className="text-base font-semibold text-slate-900 dark:text-white">
              {t("organization_dashboard_certificate_stats_title")}
            </Text>
            <Text className="text-sm text-slate-500 dark:text-slate-400">
              {t("organization_dashboard_certificate_stats_desc")}
            </Text>
          </Box>
          <Flex gap={8}>
            <ActionIcon
              variant={viewMode === "chart" ? "filled" : "default"}
              color="blue"
              onClick={() => setViewMode("chart")}
              title={t("organization_dashboard_certificate_stats_view_chart")}
              aria-label={t("organization_dashboard_certificate_stats_view_chart")}
            >
              <HiOutlineChartBar className="h-5 w-5" />
            </ActionIcon>
            <ActionIcon
              variant={viewMode === "table" ? "filled" : "default"}
              color="blue"
              onClick={() => setViewMode("table")}
              title={t("organization_dashboard_certificate_stats_view_table")}
              aria-label={t("organization_dashboard_certificate_stats_view_table")}
            >
              <HiOutlineTableCells className="h-5 w-5" />
            </ActionIcon>
          </Flex>
        </Flex>

        <Flex gap={12} wrap="wrap">
          <Box className="flex flex-col gap-1">
            <Text className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
              {t("organization_dashboard_certificate_stats_start_date")}
            </Text>
            <Input
              type="date"
              value={startDate}
              onChange={(event) => setStartDate(event.currentTarget.value)}
              className="w-full min-w-[180px]"
              disabled={!organizationId}
            />
          </Box>

          <Box className="flex flex-col gap-1">
            <Text className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
              {t("organization_dashboard_certificate_stats_end_date")}
            </Text>
            <Input
              type="date"
              value={endDate}
              onChange={(event) => setEndDate(event.currentTarget.value)}
              className="w-full min-w-[180px]"
              disabled={!organizationId}
            />
          </Box>
        </Flex>

        {hasInvalidRange && (
          <Alert color="red" variant="light">
            {t("organization_dashboard_certificate_stats_invalid_range")}
          </Alert>
        )}

        {error && !hasInvalidRange && (
          <Alert color="red" variant="light">
            {error}
          </Alert>
        )}

        <Box className="w-full">
          {viewMode === "chart" ? renderChart() : renderTable()}
        </Box>
      </Stack>
    </Paper>
  );
};
