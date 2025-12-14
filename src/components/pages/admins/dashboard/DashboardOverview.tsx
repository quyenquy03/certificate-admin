"use client";

import { ReactNode, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Flex,
  Loader,
  Paper,
  SimpleGrid,
  Stack,
  Text,
} from "@mantine/core";
import {
  HiOutlineBuildingOffice2,
  HiOutlineClipboardDocumentCheck,
  HiOutlineRectangleStack,
  HiOutlineUserGroup,
} from "react-icons/hi2";

import { certificateApis, organizationApis, userApis } from "@/apis";
import {
  BaseResponseType,
  CertificateCategoryType,
  CertificateResponseType,
  OrganizationResponseType,
  UserResponseType,
} from "@/types";

type OverviewCounts = {
  users: number;
  organizations: number;
  certificateTypes: number;
  certificates: number;
};

type OverviewItem = {
  key: keyof OverviewCounts;
  label: string;
  icon: ReactNode;
  cardClass: string;
  iconClass: string;
};

const surfaceClasses =
  "border border-slate-200/70 bg-white/95 dark:border-slate-800/80 dark:bg-slate-900/85";

const getTotalFromResponse = <T,>(
  response:
    | BaseResponseType<T[] | undefined>
    | BaseResponseType<T[]>
    | T[]
    | undefined
): number => {
  if (!response) return 0;

  const pagination = (response as BaseResponseType<T[]>)?.pagination;
  if (pagination?.totalPage) return pagination.totalPage;

  const data =
    (response as BaseResponseType<T[]>)?.data ??
    (response as any)?.data ??
    response;

  return Array.isArray(data) ? data.length : 0;
};

export const DashboardOverview = () => {
  const [counts, setCounts] = useState<OverviewCounts>({
    users: 0,
    organizations: 0,
    certificateTypes: 0,
    certificates: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const overviewItems: OverviewItem[] = useMemo(
    () => [
      {
        key: "users",
        label: "Người dùng",
        cardClass:
          "bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-slate-900 dark:via-slate-950 dark:to-indigo-950",
        iconClass:
          "bg-blue-200 text-blue-800 shadow-sm ring-2 ring-blue-300/80 dark:bg-indigo-700/80 dark:text-white dark:ring-indigo-500/60",
        icon: <HiOutlineUserGroup className="h-6 w-6" />,
      },
      {
        key: "organizations",
        label: "Tổ chức",
        cardClass:
          "bg-gradient-to-br from-violet-50 via-white to-fuchsia-50 dark:from-slate-900 dark:via-slate-950 dark:to-fuchsia-950",
        iconClass:
          "bg-violet-200 text-violet-800 shadow-sm ring-2 ring-violet-300/80 dark:bg-fuchsia-700/80 dark:text-white dark:ring-fuchsia-500/60",
        icon: <HiOutlineBuildingOffice2 className="h-6 w-6" />,
      },
      {
        key: "certificateTypes",
        label: "Loại chứng chỉ",
        cardClass:
          "bg-gradient-to-br from-amber-50 via-white to-orange-50 dark:from-slate-900 dark:via-slate-950 dark:to-amber-950",
        iconClass:
          "bg-amber-200 text-amber-800 shadow-sm ring-2 ring-amber-300/80 dark:bg-amber-700/80 dark:text-white dark:ring-amber-500/60",
        icon: <HiOutlineRectangleStack className="h-6 w-6" />,
      },
      {
        key: "certificates",
        label: "Chứng chỉ",
        cardClass:
          "bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-slate-900 dark:via-slate-950 dark:to-teal-950",
        iconClass:
          "bg-emerald-200 text-emerald-800 shadow-sm ring-2 ring-emerald-300/80 dark:bg-teal-700/80 dark:text-white dark:ring-teal-500/60",
        icon: <HiOutlineClipboardDocumentCheck className="h-6 w-6" />,
      },
    ],
    []
  );

  useEffect(() => {
    let isMounted = true;

    const fetchCounts = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const [
          usersRes,
          organizationsRes,
          certificateTypesRes,
          certificatesRes,
        ] = await Promise.all([
          userApis.getAllUsers({ page: 1, limit: 1 }),
          organizationApis.getOrganizations({ page: 1, limit: 1 }),
          certificateApis.getCertificateTypes({ page: 1, limit: 1 }),
          certificateApis.getCertificates({ page: 1, limit: 1 }),
        ]);

        if (!isMounted) return;

        setCounts({
          users: getTotalFromResponse<UserResponseType>(usersRes),
          organizations:
            getTotalFromResponse<OrganizationResponseType>(organizationsRes),
          certificateTypes:
            getTotalFromResponse<CertificateCategoryType>(certificateTypesRes),
          certificates:
            getTotalFromResponse<CertificateResponseType>(certificatesRes),
        });
      } catch (err: any) {
        if (isMounted) {
          setError(
            err?.message
              ? `Failed to load overview stats: ${err.message}`
              : "Failed to load overview stats"
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchCounts();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <Paper radius="sm" shadow="md" className={`${surfaceClasses} p-5`}>
      <Stack gap="sm">
        <Box>
          <Text className="text-lg font-semibold text-slate-900 dark:text-white">
            System overview
          </Text>
          <Text className="text-sm text-slate-500 dark:text-slate-400">
            Quick totals for users, organizations, certificate types, and
            certificates
          </Text>
        </Box>

        {error && (
          <Alert color="red" variant="light">
            {error}
          </Alert>
        )}

        <SimpleGrid
          cols={{ base: 1, sm: 2, lg: 4 }}
          spacing="md"
          className="w-full"
        >
          {overviewItems.map((item) => {
            const value = counts[item.key] ?? 0;
            return (
              <Box
                key={item.key}
                className={`relative flex flex-col items-center gap-4 overflow-hidden rounded-lg border border-slate-100/70 bg-gradient-to-br p-5 text-center shadow-md backdrop-blur transition hover:-translate-y-[3px] hover:shadow-lg dark:border-slate-800 ${item.cardClass}`}
              >
                <Box className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/60 via-transparent to-white/15 dark:from-white/0 dark:via-transparent dark:to-white/0" />
                <Box
                  className={`relative z-10 flex h-12 w-12 items-center justify-center rounded-full ${item.iconClass}`}
                >
                  {item.icon}
                </Box>
                <Flex
                  direction="column"
                  gap={6}
                  className="relative z-10 items-center"
                >
                  <Text className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300">
                    {item.label}
                  </Text>
                  {isLoading ? (
                    <Loader size="sm" color="blue" />
                  ) : (
                    <Text className="text-3xl font-black leading-tight text-slate-900 drop-shadow-sm dark:text-white">
                      {value.toLocaleString("vi-VN")}
                    </Text>
                  )}
                </Flex>
              </Box>
            );
          })}
        </SimpleGrid>
      </Stack>
    </Paper>
  );
};
