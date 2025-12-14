"use client";

import { useEffect, useState } from "react";
import { Alert, Box, Flex, Loader, Paper, Stack, Text } from "@mantine/core";

import { certificateApis } from "@/apis";
import {
  CertificateCategoryType,
  CertificateResponseType,
} from "@/types";

import { extractData, surfaceClasses } from "./DashboardStatsHelpers";
import { StatCard } from "./StatCard";

type CertificateTypeStat = {
  type: CertificateCategoryType;
  total: number;
};

export const CertificateTypesBox = () => {
  const [certificateTypeStats, setCertificateTypeStats] = useState<
    CertificateTypeStat[]
  >([]);
  const [certificateTypeLoading, setCertificateTypeLoading] = useState(false);
  const [certificateTypeError, setCertificateTypeError] = useState<
    string | null
  >(null);

  useEffect(() => {
    let isMounted = true;

    const fetchCertificateTypeStats = async () => {
      setCertificateTypeLoading(true);
      setCertificateTypeError(null);

      try {
        const [typesResponse, certificatesResponse] = await Promise.all([
          certificateApis.getCertificateTypes({
            page: 1,
            limit: 1000,
          }),
          certificateApis.getCertificates({
            page: 1,
            limit: 1000,
          }),
        ]);

        const typesPayload =
          extractData<CertificateCategoryType>(typesResponse);
        const types = Array.isArray(typesPayload) ? typesPayload : [];

        const certificatesPayload =
          extractData<CertificateResponseType>(certificatesResponse);
        const certificates = Array.isArray(certificatesPayload)
          ? certificatesPayload
          : [];

        const countByType = certificates.reduce<Record<string, number>>(
          (acc, cert) => {
            if (cert.certificateTypeId) {
              acc[cert.certificateTypeId] =
                (acc[cert.certificateTypeId] ?? 0) + 1;
            }
            return acc;
          },
          {}
        );

        const stats = types.map((type) => ({
          type,
          total: countByType[type.id] ?? 0,
        }));

        if (!isMounted) return;

        setCertificateTypeStats(
          stats.sort((a, b) => a.type.name.localeCompare(b.type.name))
        );
      } catch (err: any) {
        if (isMounted) {
          setCertificateTypeError(
            err?.message
              ? `Không thể tải thống kê loại chứng chỉ: ${err.message}`
              : "Không thể tải thống kê loại chứng chỉ"
          );
        }
      } finally {
        if (isMounted) setCertificateTypeLoading(false);
      }
    };

    fetchCertificateTypeStats();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <Paper
      radius="sm"
      shadow="md"
      className={`${surfaceClasses} h-full p-5 bg-gradient-to-br from-white via-amber-50 to-orange-100 dark:from-slate-900 dark:via-slate-900 dark:to-amber-900`}
    >
      <Stack gap="sm">
        <Box>
          <Text className="text-lg font-semibold text-slate-900 dark:text-white">
            Loại chứng chỉ
          </Text>
          <Text className="text-sm text-slate-500 dark:text-slate-400">
            Thống kê số lượng chứng chỉ theo từng loại
          </Text>
        </Box>

        {certificateTypeError && (
          <Alert color="red" variant="light">
            {certificateTypeError}
          </Alert>
        )}

        {certificateTypeLoading ? (
          <Flex align="center" justify="center" className="py-6">
            <Loader color="blue" />
          </Flex>
        ) : certificateTypeStats.length === 0 ? (
          <Box className="rounded-md border border-dashed border-slate-200 bg-slate-50 p-4 text-center text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
            Chưa có dữ liệu loại chứng chỉ
          </Box>
        ) : (
          <Stack gap="sm">
            {certificateTypeStats.map((item) => (
              <StatCard
                key={item.type.id}
                label={item.type.name}
                value={item.total}
                accentClass="from-amber-50 to-orange-50 dark:from-amber-950 dark:to-slate-900"
              />
            ))}
          </Stack>
        )}
      </Stack>
    </Paper>
  );
};
