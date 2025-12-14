"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Flex,
  Loader,
  Paper,
  ActionIcon,
  Select,
  Stack,
  Text,
  Input,
  Table,
  useMantineColorScheme,
} from "@mantine/core";
import { useMantineTheme } from "@mantine/core";
import {
  Line,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { HiOutlineChartBar, HiOutlineTableCells } from "react-icons/hi2";

import { certificateApis } from "@/apis";
import { useQueryGetAllOrganizations } from "@/queries";
import {
  BaseResponseType,
  CertificateResponseType,
  OrganizationResponseType,
} from "@/types";

type CertificateWithOptionalDates = Partial<CertificateResponseType> & {
  signedAt?: string | null;
  expiresAt?: string | null;
  revokedAt?: string | null;
  createdAt?: string | null;
  approvedAt?: string | null;
  validTo?: string | null;
};

export type StatsRow = {
  date: string; // YYYY-MM-DD
  createdCount: number;
  revokedCount: number;
  signedCount: number;
  expiredCount: number;
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

export const buildDateRange = (
  startDate: string,
  endDate: string
): string[] => {
  if (!startDate || !endDate) return [];

  const start = toUtcDate(startDate);
  const end = toUtcDate(endDate);

  if (
    start > end ||
    Number.isNaN(start.getTime()) ||
    Number.isNaN(end.getTime())
  )
    return [];

  const dates: string[] = [];
  const cursor = new Date(start);

  while (cursor <= end) {
    dates.push(cursor.toISOString().slice(0, 10));
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  return dates;
};

export const groupStatsByDay = (
  certificates: CertificateWithOptionalDates[],
  days: string[]
): StatsRow[] => {
  const statsMap = new Map<string, StatsRow>();

  days.forEach((day) => {
    statsMap.set(day, {
      date: day,
      createdCount: 0,
      revokedCount: 0,
      signedCount: 0,
      expiredCount: 0,
    });
  });

  certificates.forEach((certificate) => {
    const createdKey = toDateKey(certificate.createdAt);
    const revokedKey = toDateKey(certificate.revokedAt);
    const signedKey = toDateKey(certificate.signedAt);
    const expiredKey = toDateKey(certificate.expiresAt);

    if (createdKey && statsMap.has(createdKey)) {
      statsMap.get(createdKey)!.createdCount += 1;
    }
    if (revokedKey && statsMap.has(revokedKey)) {
      statsMap.get(revokedKey)!.revokedCount += 1;
    }
    if (signedKey && statsMap.has(signedKey)) {
      statsMap.get(signedKey)!.signedCount += 1;
    }
    if (expiredKey && statsMap.has(expiredKey)) {
      statsMap.get(expiredKey)!.expiredCount += 1;
    }
  });

  return days.map((day) => statsMap.get(day)!);
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

export const CertificateDailyStatsChart = () => {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === "dark";

  const defaultRange = useMemo(() => getDefaultDateRange(), []);
  const [startDate, setStartDate] = useState(defaultRange.startDate);
  const [endDate, setEndDate] = useState(defaultRange.endDate);
  const [organizationId, setOrganizationId] = useState<string | null>("all");
  const [stats, setStats] = useState<StatsRow[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"chart" | "table">("chart");

  const { data: organizationsResponse, isFetching: isOrganizationsFetching } =
    useQueryGetAllOrganizations({ page: 1, limit: 1000 });

  const organizationsPayload =
    (organizationsResponse as BaseResponseType<OrganizationResponseType[]>)
      ?.data ??
    (organizationsResponse as any)?.data ??
    organizationsResponse;

  const organizations: OrganizationResponseType[] = Array.isArray(
    organizationsPayload
  )
    ? organizationsPayload
    : [];

  const organizationOptions =
    organizations?.map((org) => ({
      value: org.id,
      label: org.name || (org as any).organizationName || "Unnamed",
    })) ?? [];

  const hasInvalidRange = useMemo(() => {
    if (!startDate || !endDate) return false;
    return toUtcDate(endDate) < toUtcDate(startDate);
  }, [endDate, startDate]);

  useEffect(() => {
    let isMounted = true;

    const fetchStats = async () => {
      if (!startDate || !endDate) {
        setError("Please select a valid date range");
        setStats([]);
        return;
      }

      if (hasInvalidRange) {
        setError("End date must be on or after start date");
        setStats([]);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Call 4 APIs separately to get daily stats by each date field
        const orgFilter =
          organizationId && organizationId !== "all"
            ? { organizationId: { eq: organizationId } }
            : undefined;

        const requestPayload = (dateKey: string) => ({
          page: 1,
          limit: DEFAULT_LIMIT,
          filters: {
            ...(orgFilter ? orgFilter : {}),
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

        const days = buildDateRange(startDate, endDate);
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
          setError(
            err?.message
              ? `Failed to load certificate stats: ${err.message}`
              : "Failed to load certificate stats"
          );
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
  }, [endDate, hasInvalidRange, organizationId, startDate]);

  const chartLines = [
    {
      key: "createdCount",
      stroke: theme.colors.blue[5] ?? "#0EA5E9",
      label: "Created",
    },
    {
      key: "signedCount",
      stroke: theme.colors.green[5] ?? "#22C55E",
      label: "Signed",
    },
    {
      key: "revokedCount",
      stroke: theme.colors.orange[5] ?? "#F97316",
      label: "Revoked",
    },
    {
      key: "expiredCount",
      stroke: theme.colors.violet[5] ?? "#A855F7",
      label: "Expired",
    },
  ] as const;

  const axisColor = isDark ? theme.colors.gray[4] : theme.colors.gray[7];
  const gridColor = isDark ? "#1f2937" : "#E5E7EB";
  const surfaceClasses =
    "border border-slate-200/70 bg-white/95 dark:border-slate-800/70 dark:bg-slate-900/70";

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
          No data in this range
        </Flex>
      );
    }

    return (
      <ResponsiveContainer width="100%" height={500}>
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
          No data in this range
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
            <Table.Th className="font-semibold text-center">Date</Table.Th>
            <Table.Th className="font-semibold text-center">Created</Table.Th>
            <Table.Th className="font-semibold text-center">Signed</Table.Th>
            <Table.Th className="font-semibold text-center">Revoked</Table.Th>
            <Table.Th className="font-semibold text-center">Expired</Table.Th>
            <Table.Th className="font-semibold text-center">
              Total / day
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
            <Table.Th className="text-center">Total</Table.Th>
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
    <Paper radius="sm" shadow="md" className={`${surfaceClasses} p-5`}>
      <Stack gap="md">
        <Flex align="center" justify="space-between" gap={12} wrap="wrap">
          <Box>
            <Text className="text-lg font-semibold text-slate-900 dark:text-white">
              Certificate Daily Stats
            </Text>
            <Text className="text-sm text-slate-500 dark:text-slate-400">
              Daily counts for created, signed, revoked, and expired
              certificates
            </Text>
          </Box>
          <Flex gap={8}>
            <ActionIcon
              variant={viewMode === "chart" ? "filled" : "default"}
              color="blue"
              onClick={() => setViewMode("chart")}
              title="View chart"
              aria-label="View chart"
            >
              <HiOutlineChartBar className="h-5 w-5" />
            </ActionIcon>
            <ActionIcon
              variant={viewMode === "table" ? "filled" : "default"}
              color="blue"
              onClick={() => setViewMode("table")}
              title="View table"
              aria-label="View table"
            >
              <HiOutlineTableCells className="h-5 w-5" />
            </ActionIcon>
          </Flex>
        </Flex>

        <Flex gap={12} wrap="wrap">
          <Box className="flex flex-col gap-1">
            <Text className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
              Start date
            </Text>
            <Input
              type="date"
              value={startDate}
              onChange={(event) => setStartDate(event.currentTarget.value)}
              className="w-full min-w-[180px]"
            />
          </Box>

          <Box className="flex flex-col gap-1">
            <Text className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
              End date
            </Text>
            <Input
              type="date"
              value={endDate}
              onChange={(event) => setEndDate(event.currentTarget.value)}
              className="w-full min-w-[180px]"
            />
          </Box>

          <Box className="flex flex-col gap-1">
            <Text className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
              Organization
            </Text>
            <Select
              data={[
                { value: "all", label: "All organizations" },
                ...(organizationOptions ?? []),
              ]}
              value={organizationId}
              onChange={setOrganizationId}
              placeholder="All organizations"
              searchable
              nothingFoundMessage={
                isOrganizationsFetching ? "Loading..." : "No organizations"
              }
              className="w-full min-w-[220px]"
              disabled={isOrganizationsFetching}
            />
          </Box>
        </Flex>

        {hasInvalidRange && (
          <Alert color="red" variant="light">
            End date must be on or after start date
          </Alert>
        )}

        {error && (
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
