"use client";

import { useEffect, useState } from "react";
import { Alert, Box, Flex, Loader, Paper, Stack, Text } from "@mantine/core";

import { organizationApis } from "@/apis";
import { ORGANIZATION_STATUSES } from "@/enums";
import { RegistrationResponseType } from "@/types";

import { extractData, surfaceClasses } from "./DashboardStatsHelpers";
import { StatCard } from "./StatCard";

type RegistrationStats = {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
};

export const RegistrationStatsBox = () => {
  const [registrationStats, setRegistrationStats] = useState<RegistrationStats>(
    {
      total: 0,
      pending: 0,
      approved: 0,
      rejected: 0,
    }
  );
  const [registrationLoading, setRegistrationLoading] = useState(false);
  const [registrationError, setRegistrationError] = useState<string | null>(
    null
  );

  useEffect(() => {
    let isMounted = true;

    const fetchRegistrationStats = async () => {
      setRegistrationLoading(true);
      setRegistrationError(null);

      try {
        const allRes = await organizationApis.getRegistrations({
          page: 1,
          limit: 1000,
        });

        if (!isMounted) return;

        const registrationsPayload =
          extractData<RegistrationResponseType>(allRes);
        const registrations = Array.isArray(registrationsPayload)
          ? registrationsPayload
          : [];

        const counts = registrations.reduce(
          (acc, item) => {
            acc.total += 1;
            if (item.status === ORGANIZATION_STATUSES.PENDING) acc.pending += 1;
            else if (item.status === ORGANIZATION_STATUSES.APPROVED)
              acc.approved += 1;
            else if (item.status === ORGANIZATION_STATUSES.REJECTED)
              acc.rejected += 1;
            return acc;
          },
          {
            total: 0,
            pending: 0,
            approved: 0,
            rejected: 0,
          }
        );

        setRegistrationStats({
          total: counts.total,
          pending: counts.pending,
          approved: counts.approved,
          rejected: counts.rejected,
        });
      } catch (err: any) {
        if (isMounted) {
          setRegistrationError(
            err?.message
              ? `Không thể tải thống kê đăng ký tổ chức: ${err.message}`
              : "Không thể tải thống kê đăng ký tổ chức"
          );
        }
      } finally {
        if (isMounted) setRegistrationLoading(false);
      }
    };

    fetchRegistrationStats();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <Paper
      radius="sm"
      shadow="md"
      className={`${surfaceClasses} h-full p-5 bg-gradient-to-br from-white via-emerald-50 to-teal-100 dark:from-slate-900 dark:via-slate-900 dark:to-teal-900`}
    >
      <Stack gap="sm">
        <Box>
          <Text className="text-lg font-semibold text-slate-900 dark:text-white">
            Yêu cầu đăng ký cơ quan, tổ chức
          </Text>
          <Text className="text-sm text-slate-500 dark:text-slate-400">
            Tổng số yêu cầu, đang chờ duyệt, đã duyệt và đã từ chối
          </Text>
        </Box>

        {registrationError && (
          <Alert color="red" variant="light">
            {registrationError}
          </Alert>
        )}

        {registrationLoading ? (
          <Flex align="center" justify="center" className="py-6">
            <Loader color="blue" />
          </Flex>
        ) : (
          <Stack gap="sm">
            <StatCard
              label="Tổng số yêu cầu"
              value={registrationStats.total}
              accentClass="from-slate-50 to-white dark:from-slate-900 dark:to-slate-900"
            />
            <StatCard
              label="Đang chờ duyệt"
              value={registrationStats.pending}
              accentClass="from-amber-50 to-yellow-50 dark:from-amber-950 dark:to-slate-900"
            />
            <StatCard
              label="Đã duyệt"
              value={registrationStats.approved}
              accentClass="from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-slate-900"
            />
            <StatCard
              label="Đã từ chối"
              value={registrationStats.rejected}
              accentClass="from-rose-50 to-red-50 dark:from-rose-950 dark:to-slate-900"
            />
          </Stack>
        )}
      </Stack>
    </Paper>
  );
};
