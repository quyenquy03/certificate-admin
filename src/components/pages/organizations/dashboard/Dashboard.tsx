"use client";

import {
  ButtonAdd,
  CertificateDetailModal,
  OrganizationStatusCard,
  PageHeader,
} from "@/components";
import { PAGE_URLS } from "@/constants";
import { CERTIFICATE_STATUSES, SORTS } from "@/enums";
import { useDisclose } from "@/hooks";
import { useQueryGetOrganizationCertificates } from "@/queries";
import { stores } from "@/stores";
import { CertificateResponseType } from "@/types";
import {
  Badge,
  Box,
  Button,
  Flex,
  Grid,
  Paper,
  Skeleton,
  Stack,
  Text,
  ThemeIcon,
} from "@mantine/core";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  HiOutlineBuildingLibrary,
  HiOutlineClipboardDocumentList,
  HiOutlineEnvelope,
  HiOutlineGlobeAlt,
  HiOutlinePhone,
  HiOutlineSparkles,
  HiOutlineUsers,
  HiOutlineWallet,
  HiOutlineCalendarDays,
} from "react-icons/hi2";
import { CertificateStatChart } from "./CertificateStatChart";

const CERTIFICATE_STATUS_COLORS: Partial<Record<CERTIFICATE_STATUSES, string>> =
  {
    [CERTIFICATE_STATUSES.CREATED]: "#2563EB",
  };

const RECENT_CERTIFICATES_LIMIT = 5;

export const OrganizationDashboard = () => {
  const t = useTranslations();
  const router = useRouter();
  const { currentUser } = stores.account();
  const { currentOrganization, isLoading } = stores.organization();

  const [selectedCertificate, setSelectedCertificate] =
    useState<CertificateResponseType | null>(null);
  const detailModal = useDisclose();

  const { data: certificatesResponse, isFetching: isCertificatesFetching } =
    useQueryGetOrganizationCertificates(
      {
        id: currentOrganization?.id ?? "",
        page: 1,
        limit: RECENT_CERTIFICATES_LIMIT,
        sort: { createdAt: SORTS.DESC },
      },
      {
        enabled: Boolean(currentOrganization?.id),
      } as any
    );

  const recentCertificates = certificatesResponse?.data ?? [];
  const isCertificatesEmpty =
    !isCertificatesFetching && recentCertificates.length === 0;

  const canSignSelectedCertificate = useMemo(() => {
    if (!selectedCertificate) return false;
    const isOrgOwner = currentOrganization?.isOwner ?? false;
    const isIssuer = currentUser?.id === selectedCertificate.issuerId;
    return isOrgOwner || isIssuer;
  }, [currentOrganization?.isOwner, currentUser?.id, selectedCertificate]);

  const infoItems = useMemo(() => {
    const owner = currentOrganization?.owner;

    return [
      {
        key: "email",
        label: t("organization_dashboard_contact_email"),
        value: owner?.email ?? "",
        icon: <HiOutlineEnvelope className="h-4 w-4" />,
      },
      {
        key: "phone",
        label: t("organization_dashboard_contact_phone"),
        value: owner?.phone ?? "",
        icon: <HiOutlinePhone className="h-4 w-4" />,
      },
      {
        key: "website",
        label: t("organization_dashboard_contact_website"),
        value: currentOrganization?.website ?? "",
        icon: <HiOutlineGlobeAlt className="h-4 w-4" />,
      },
      {
        key: "wallet",
        label: t("organization_dashboard_wallet_label"),
        value: owner?.walletAddress ?? "",
        icon: <HiOutlineWallet className="h-4 w-4" />,
      },
    ];
  }, [
    currentOrganization?.website,
    currentOrganization?.owner?.email,
    currentOrganization?.owner?.phone,
    currentOrganization?.owner?.walletAddress,
    t,
  ]);

  const quickActions = [
    {
      id: "create",
      title: t("organization_dashboard_action_create_title"),
      description: t("organization_dashboard_action_create_desc"),
      icon: <HiOutlineSparkles className="h-5 w-5" />,
      onClick: () => router.push(PAGE_URLS.ORGANIZATION_CREATE_CERTIFICATE),
      accent:
        "bg-gradient-to-br from-blue-500/15 via-indigo-500/10 to-cyan-500/20 border-blue-400/40 dark:from-blue-500/10 dark:via-indigo-500/5 dark:to-cyan-500/15",
    },
    {
      id: "manage",
      title: t("organization_dashboard_action_manage_title"),
      description: t("organization_dashboard_action_manage_desc"),
      icon: <HiOutlineClipboardDocumentList className="h-5 w-5" />,
      onClick: () => router.push(PAGE_URLS.ORGANIZATIONS_CERTIFICATES),
      accent:
        "bg-gradient-to-br from-emerald-500/15 via-teal-500/10 to-green-500/20 border-emerald-400/40 dark:from-emerald-500/10 dark:via-teal-500/5 dark:to-green-500/15",
    },
    {
      id: "members",
      title: t("organization_dashboard_action_members_title"),
      description: t("organization_dashboard_action_members_desc"),
      icon: <HiOutlineUsers className="h-5 w-5" />,
      onClick: () => router.push(PAGE_URLS.ORGANIZATIONS_MEMBERS),
      accent:
        "bg-gradient-to-br from-purple-500/15 via-violet-500/10 to-fuchsia-500/20 border-purple-400/40 dark:from-purple-500/10 dark:via-violet-500/5 dark:to-fuchsia-500/15",
    },
    {
      id: "profile",
      title: t("organization_dashboard_action_profile_title"),
      description: t("organization_dashboard_action_profile_desc"),
      icon: <HiOutlineBuildingLibrary className="h-5 w-5" />,
      onClick: () => router.push(PAGE_URLS.MY_ORGANIZATIONS),
      accent:
        "bg-gradient-to-br from-orange-500/15 via-amber-500/10 to-yellow-500/20 border-orange-400/40 dark:from-orange-500/10 dark:via-amber-500/5 dark:to-yellow-500/15",
    },
  ];

  const handleOpenCertificateDetail = (
    certificate: CertificateResponseType
  ) => {
    setSelectedCertificate(certificate);
    detailModal.onOpen();
  };

  const handleCloseCertificateDetail = () => {
    detailModal.onClose();
    setSelectedCertificate(null);
  };

  const heroContent = () => {
    if (isLoading) {
      return <Skeleton height={180} radius="sm" />;
    }

    if (!currentOrganization) {
      return (
        <Flex
          direction="column"
          gap={12}
          className="rounded-sm border border-dashed border-white/40 bg-white/10 p-5 text-white"
        >
          <Text className="text-sm font-semibold uppercase tracking-wide text-white/70">
            {t("organization_dashboard_current_org")}
          </Text>
          <Text className="text-2xl font-semibold">
            {t("organization_dashboard_no_org_title")}
          </Text>
          <Text className="text-sm text-white/75">
            {t("organization_dashboard_no_org_description")}
          </Text>
          <Button
            variant="white"
            color="dark"
            className="mt-2 w-fit"
            onClick={() => router.push(PAGE_URLS.MY_ORGANIZATIONS)}
          >
            {t("my_organization")}
          </Button>
        </Flex>
      );
    }

    return (
      <Flex direction="column" gap={16} className="relative text-white">
        <Text className="text-sm font-semibold uppercase tracking-wide text-white/70">
          {t("organization_dashboard_overview_label")}
        </Text>
        <Flex gap={12} align="center" wrap="wrap">
        <Text className="text-3xl font-bold leading-tight">
          {currentOrganization.name || t("not_updated")}
        </Text>
        <OrganizationStatusCard status={currentOrganization.status} />
      </Flex>
        <Text className="text-base text-white/80">
          {currentOrganization.description || t("not_updated")}
        </Text>
        <Grid gutter="lg">
          {infoItems.map((item) => {
            const rawValue = typeof item.value === "string" ? item.value : "";
            const displayValue =
              rawValue.trim().length > 0 ? rawValue : t("not_updated");

            return (
              <Grid.Col key={item.key} span={{ base: 12, sm: 6, lg: 3 }}>
                <Flex
                  gap={10}
                  className="rounded-sm border border-white/20 bg-white/10 px-3 py-3 backdrop-blur"
                >
                  <Box className="flex h-10 w-10 items-center justify-center rounded-sm bg-white/15 text-white">
                    {item.icon}
                  </Box>
                  <Flex direction="column" className="min-w-0">
                    <Text className="text-xs font-semibold uppercase tracking-wide text-white/60">
                      {item.label}
                    </Text>
                    <Text className="truncate text-sm font-semibold text-white">
                      {displayValue}
                    </Text>
                  </Flex>
                </Flex>
              </Grid.Col>
            );
          })}
        </Grid>
      </Flex>
    );
  };

  return (
    <Box className="relative flex h-full w-full flex-col">
      <PageHeader
        title={t("dashboard")}
        classNames={{ wrapper: "relative z-20 gap-4" }}
      >
        <Button
          variant="light"
          color="blue"
          onClick={() => router.push(PAGE_URLS.ORGANIZATIONS_CERTIFICATES)}
        >
          {t("certificates")}
        </Button>
        <ButtonAdd
          tooltipLabel="create_certificate"
          onClick={() => router.push(PAGE_URLS.ORGANIZATION_CREATE_CERTIFICATE)}
        />
      </PageHeader>

      <Box className="flex-1 overflow-y-auto p-4">
        <Stack gap="lg">
          <Paper
            radius="sm"
            shadow="xl"
            className="relative overflow-hidden rounded-sm border border-slate-200/40 bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-800 p-6 text-white dark:border-slate-800/40 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950"
          >
            <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.25),_transparent_55%)]" />
            <Box className="relative">{heroContent()}</Box>
          </Paper>

          {currentOrganization && (
            <CertificateStatChart organizationId={currentOrganization.id} />
          )}

          <Box className="space-y-3">
            <Flex align="center" justify="space-between" wrap="wrap" gap={12}>
              <Box>
                <Text className="text-base font-semibold text-slate-900 dark:text-white">
                  {t("organization_dashboard_quick_actions")}
                </Text>
                <Text className="text-sm text-slate-500 dark:text-slate-400">
                  {t("organization_dashboard_stat_hint")}
                </Text>
              </Box>
            </Flex>
            <Grid gutter="lg">
              {quickActions.map((action) => (
                <Grid.Col key={action.id} span={{ base: 12, md: 6, xl: 3 }}>
                  <Paper
                    radius="sm"
                    shadow="lg"
                    onClick={action.onClick}
                    className={`group relative h-full cursor-pointer rounded-sm border bg-white/90 p-5 transition-all hover:-translate-y-1 hover:shadow-2xl dark:bg-slate-900/70 ${action.accent}`}
                  >
                    <Flex direction="column" gap={12}>
                      <ThemeIcon
                        size="xl"
                        radius="lg"
                        variant="light"
                        className="bg-white/60 text-slate-700 shadow-lg dark:bg-slate-800/60 dark:text-white"
                      >
                        {action.icon}
                      </ThemeIcon>
                      <Text className="text-lg font-semibold text-slate-900 dark:text-white">
                        {action.title}
                      </Text>
                      <Text className="text-sm text-slate-500 dark:text-slate-400">
                        {action.description}
                      </Text>
                    </Flex>
                  </Paper>
                </Grid.Col>
              ))}
            </Grid>
          </Box>

          <Grid gutter="lg">
            <Grid.Col span={{ base: 12 }}>
              <Paper
                radius="sm"
                shadow="md"
                className="h-full rounded-sm border border-slate-200/70 bg-white/95 p-5 dark:border-slate-800/70 dark:bg-slate-900/70"
              >
                <Flex
                  align="center"
                  justify="space-between"
                  gap={12}
                  wrap="wrap"
                >
                  <Box>
                    <Text className="text-base font-semibold text-slate-900 dark:text-white">
                      {t("organization_dashboard_recent_certificates")}
                    </Text>
                    <Text className="text-sm text-slate-500 dark:text-slate-400">
                      {t("organization_dashboard_stat_hint")}
                    </Text>
                  </Box>
                  <Button
                    variant="light"
                    color="blue"
                    size="xs"
                    onClick={() =>
                      router.push(PAGE_URLS.ORGANIZATIONS_CERTIFICATES)
                    }
                  >
                    {t("organization_dashboard_view_all_certificates")}
                  </Button>
                </Flex>

                <Stack gap="sm" className="mt-4">
                  {isCertificatesFetching ? (
                    Array.from({ length: RECENT_CERTIFICATES_LIMIT }).map(
                      (_, index) => (
                        <Skeleton key={index} height={76} radius="sm" />
                      )
                    )
                  ) : isCertificatesEmpty ? (
                    <Box className="rounded-sm border border-dashed border-slate-200 px-4 py-6 text-center dark:border-slate-700">
                      <Text className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                        {t("organization_dashboard_empty_certificates")}
                      </Text>
                      <Text className="text-xs text-slate-500 dark:text-slate-400">
                        {t("organization_dashboard_empty_certificates_desc")}
                      </Text>
                    </Box>
                  ) : (
                    recentCertificates.map((certificate) => {
                      const badgeColor =
                        CERTIFICATE_STATUS_COLORS[certificate.status] ??
                        "#0EA5E9";
                      const createdAt = certificate.createdAt
                        ? dayjs(certificate.createdAt).format("DD MMM YYYY")
                        : t("not_updated");

                      const authorName =
                        certificate.authorProfile?.authorName ||
                        t("not_updated");
                      const authorEmail =
                        certificate.authorProfile?.authorEmail ||
                        t("not_updated");

                      return (
                        <Paper
                          key={certificate.id}
                          withBorder
                          radius="sm"
                          shadow="xs"
                          onClick={() =>
                            handleOpenCertificateDetail(certificate)
                          }
                          className="cursor-pointer rounded-sm border border-slate-200/70 bg-white p-4 transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg dark:border-slate-800/60 dark:bg-slate-950"
                        >
                          <Flex
                            align="flex-start"
                            justify="space-between"
                            gap={12}
                          >
                            <Box className="min-w-0 flex-1">
                              <Text className="text-base font-semibold text-slate-900 dark:text-white">
                                {certificate.code || t("not_updated")}
                              </Text>
                              <Text className="text-sm text-slate-500 dark:text-slate-400">
                                {authorName}
                              </Text>
                            </Box>
                            <Badge
                              size="sm"
                              variant="light"
                              styles={{
                                root: {
                                  backgroundColor: `${badgeColor}1a`,
                                  color: badgeColor,
                                },
                              }}
                            >
                              {t(certificate.status as any)}
                            </Badge>
                          </Flex>
                          <Flex
                            gap={16}
                            align="center"
                            className="mt-4 text-xs text-slate-500 dark:text-slate-400"
                          >
                            <Flex gap={6} align="center" className="min-w-0">
                              <HiOutlineCalendarDays className="h-4 w-4" />
                              <span>{createdAt}</span>
                            </Flex>
                            <Flex gap={6} align="center" className="min-w-0">
                              <HiOutlineEnvelope className="h-4 w-4" />
                              <span className="truncate">{authorEmail}</span>
                            </Flex>
                          </Flex>
                        </Paper>
                      );
                    })
                  )}
                </Stack>
              </Paper>
            </Grid.Col>
          </Grid>
        </Stack>
      </Box>

      <CertificateDetailModal
        opened={detailModal.isOpen}
        onClose={handleCloseCertificateDetail}
        certificate={selectedCertificate}
        canSign={canSignSelectedCertificate}
        canApprove={false}
        canRevoke={false}
      />
    </Box>
  );
};
