"use client";

import { useEffect, useMemo, useState } from "react";
import { Alert, Box, Flex, Loader, Paper, Stack, Text } from "@mantine/core";

import { userApis } from "@/apis";
import { USER_ROLES } from "@/enums";
import { UserResponseType } from "@/types";

import { extractData, surfaceClasses } from "./DashboardStatsHelpers";
import { StatCard } from "./StatCard";

type UserStats = {
  roles: Record<USER_ROLES, number>;
  active: number;
  locked: number;
};

export const UserStatsBox = () => {
  const [userStats, setUserStats] = useState<UserStats>({
    roles: {
      [USER_ROLES.ADMIN]: 0,
      [USER_ROLES.ORGANIZATION]: 0,
      [USER_ROLES.MANAGER]: 0,
    },
    active: 0,
    locked: 0,
  });
  const [userLoading, setUserLoading] = useState(false);
  const [userError, setUserError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchUserStats = async () => {
      setUserLoading(true);
      setUserError(null);

      try {
        const usersRes = await userApis.getAllUsers({
          page: 1,
          limit: 1000,
        });

        if (!isMounted) return;

        const usersPayload = extractData<UserResponseType>(usersRes);
        const users = Array.isArray(usersPayload) ? usersPayload : [];

        const totals = users.reduce(
          (acc, user) => {
            if (user.role === USER_ROLES.ADMIN) acc.roles[USER_ROLES.ADMIN] += 1;
            else if (user.role === USER_ROLES.ORGANIZATION)
              acc.roles[USER_ROLES.ORGANIZATION] += 1;
            else if (user.role === USER_ROLES.MANAGER)
              acc.roles[USER_ROLES.MANAGER] += 1;

            if (user.isLocked) acc.locked += 1;
            else acc.active += 1;

            return acc;
          },
          {
            roles: {
              [USER_ROLES.ADMIN]: 0,
              [USER_ROLES.ORGANIZATION]: 0,
              [USER_ROLES.MANAGER]: 0,
            },
            active: 0,
            locked: 0,
          } as UserStats
        );

        setUserStats(totals);
      } catch (err: any) {
        if (isMounted) {
          setUserError(
            err?.message
              ? `Không thể tải thống kê người dùng: ${err.message}`
              : "Không thể tải thống kê người dùng"
          );
        }
      } finally {
        if (isMounted) setUserLoading(false);
      }
    };

    fetchUserStats();

    return () => {
      isMounted = false;
    };
  }, []);

  const userRoleCards = useMemo(
    () => [
      {
        label: "Admin",
        value: userStats.roles[USER_ROLES.ADMIN],
        accentClass:
          "from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-indigo-950",
      },
      {
        label: "Tổ chức",
        value: userStats.roles[USER_ROLES.ORGANIZATION],
        accentClass:
          "from-violet-50 to-fuchsia-50 dark:from-slate-900 dark:to-fuchsia-950",
      },
      {
        label: "Quản lý",
        value: userStats.roles[USER_ROLES.MANAGER],
        accentClass:
          "from-emerald-50 to-teal-50 dark:from-slate-900 dark:to-teal-950",
      },
    ],
    [userStats.roles]
  );

  return (
    <Paper
      radius="sm"
      shadow="md"
      className={`${surfaceClasses} h-full p-5 bg-gradient-to-br from-white via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-900`}
    >
      <Stack gap="sm">
        <Box>
          <Text className="text-lg font-semibold text-slate-900 dark:text-white">
            Người dùng
          </Text>
          <Text className="text-sm text-slate-500 dark:text-slate-400">
            Số lượng theo từng vai trò và trạng thái tài khoản
          </Text>
        </Box>

        {userError && (
          <Alert color="red" variant="light">
            {userError}
          </Alert>
        )}

        {userLoading ? (
          <Flex align="center" justify="center" className="py-6">
            <Loader color="blue" />
          </Flex>
        ) : (
          <Stack gap="sm">
            <Stack gap="sm">
              {userRoleCards.map((card) => (
                <StatCard
                  key={card.label}
                  label={card.label}
                  value={card.value}
                  accentClass={card.accentClass}
                />
              ))}
            </Stack>

            <Stack gap="sm">
              <StatCard
                label="Đang hoạt động"
                value={userStats.active}
                accentClass="from-emerald-50 to-white dark:from-emerald-950 dark:to-slate-900"
              />
              <StatCard
                label="Đã bị khóa"
                value={userStats.locked}
                accentClass="from-rose-50 to-white dark:from-rose-950 dark:to-slate-900"
              />
            </Stack>
          </Stack>
        )}
      </Stack>
    </Paper>
  );
};
