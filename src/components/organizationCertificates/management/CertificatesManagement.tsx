"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ButtonAdd,
  CertificateItem,
  CertificateItemSkeleton,
  CertificateDetailModal,
  UserDetailModal,
  PageHeader,
  PaginationCustom,
  NoData,
  PageContentWrapper,
  ConfirmationModal,
  RevokeCertificateModal,
  SignCertificateModal,
} from "@/components";
import { Box, Grid, Group, Input, Select } from "@mantine/core";
import { useTranslations } from "next-intl";
import { useDebounce, useDisclose } from "@/hooks";
import { useQueryGetOrganizationCertificates } from "@/queries";
import {
  BasePaginationParams,
  CertificateResponseType,
  BaseErrorType,
  UserResponseType,
  OrganizationResponseType,
} from "@/types";
import { CERTIFICATE_STATUSES, SORTS } from "@/enums";
import { PAGINATION_PARAMS, PAGE_URLS } from "@/constants";
import { stores } from "@/stores";
import { useRouter } from "next/navigation";
import { useApproveCertificate, useRevokeCertificate } from "@/mutations";
import { notifications } from "@mantine/notifications";
import { isAxiosError } from "axios";

type CertificatesManagementProps = {
  currentOrganization: OrganizationResponseType | null;
  isAdmin?: boolean;
};
export const CertificatesManagement = ({
  currentOrganization,
  isAdmin,
}: CertificatesManagementProps) => {
  const t = useTranslations();
  const router = useRouter();
  const { currentUser } = stores.account();
  const headerRef = useRef<HTMLDivElement | null>(null);
  const detailModal = useDisclose();
  const issuerDetailModal = useDisclose();
  const confirmationModal = useDisclose();
  const revokeModal = useDisclose();
  const signModal = useDisclose();
  const [selectedCertificate, setSelectedCertificate] =
    useState<CertificateResponseType | null>(null);
  const [selectedIssuer, setSelectedIssuer] = useState<UserResponseType | null>(
    null
  );
  const [actionCertificate, setActionCertificate] =
    useState<CertificateResponseType | null>(null);

  const [searchParams, setSearchParams] = useState<BasePaginationParams>({
    page: PAGINATION_PARAMS.GET_CERTIFICATES.page,
    limit: PAGINATION_PARAMS.GET_CERTIFICATES.limit,
    search: "",
    sort: { createdAt: SORTS.DESC },
    filters: undefined,
  });

  const debouncedSearch = useDebounce(searchParams.search ?? "", 500);

  const statusOptions = useMemo(
    () =>
      Object.values(CERTIFICATE_STATUSES).map((status) => ({
        value: status,
        label: t(status),
      })),
    [t]
  );

  const issuerFilterOptions = useMemo(
    () => [
      { value: "me", label: t("issuer_filter_me") },
      { value: "all", label: t("issuer_filter_all") },
    ],
    [t]
  );

  const issuerFilterInitialized = useRef(isAdmin ?? false);

  const {
    data: certificatesResponse,
    isFetching,
    isLoading,
    refetch,
  } = useQueryGetOrganizationCertificates(
    {
      id: currentOrganization?.id ?? "",
      page: searchParams.page,
      limit: searchParams.limit,
      search: debouncedSearch.trim() || undefined,
      sort: searchParams.sort,
      filters: searchParams.filters,
    },
    {
      enabled: Boolean(
        currentOrganization?.id &&
          currentUser?.id &&
          issuerFilterInitialized.current
      ),
    } as any
  );

  useEffect(() => {
    if (!currentUser?.id || issuerFilterInitialized.current || isAdmin) return;
    setSearchParams((prev) => {
      if (prev.filters?.issuerId?.eq === currentUser.id) return { ...prev };
      return {
        ...prev,
        filters: {
          ...(prev.filters ?? {}),
          issuerId: { eq: currentUser.id },
        },
      };
    });
    issuerFilterInitialized.current = true;
  }, [currentUser?.id, isAdmin]);

  useEffect(() => {
    if (isAdmin && !issuerFilterInitialized.current) {
      issuerFilterInitialized.current = true;
    }
  }, [isAdmin]);

  const handleMutationError = (error: unknown, failKey: string) => {
    let message = t("common_error_message");

    if (isAxiosError<BaseErrorType>(error)) {
      const code = error.response?.data?.code;
      message = t(code || "common_error_message");
    }

    notifications.show({
      title: t(failKey),
      message,
      color: "red",
    });
  };

  const handleCloseActionModals = () => {
    confirmationModal.onClose();
    signModal.onClose();
    revokeModal.onClose();
    setActionCertificate(null);
  };

  const { mutate: approveCertificateMutate, isPending: isApproving } =
    useApproveCertificate({
      onSuccess: () => {
        notifications.show({
          title: t("approve_certificate_success_title"),
          message: t("approve_certificate_success_desc", {
            code: actionCertificateCode || t("not_updated"),
          }),
          color: "green",
        });
        handleCloseActionModals();
        handleCloseCertificateDetail();
        refetch();
      },
      onError: (error) =>
        handleMutationError(error, "approve_certificate_fail"),
    });

  const { mutate: revokeCertificateMutate, isPending: isRevoking } =
    useRevokeCertificate({
      onSuccess: () => {
        notifications.show({
          title: t("revoke_certificate_success_title"),
          message: t("revoke_certificate_success_desc", {
            code: actionCertificateCode || t("not_updated"),
          }),
          color: "green",
        });
        handleCloseActionModals();
        handleCloseCertificateDetail();
        refetch();
      },
      onError: (error) => handleMutationError(error, "revoke_certificate_fail"),
    });

  const handleOpenApproveModal = (certificate: CertificateResponseType) => {
    setActionCertificate(certificate);
    confirmationModal.onOpen();
  };

  const handleOpenRevokeModal = (certificate: CertificateResponseType) => {
    setActionCertificate(certificate);
    revokeModal.onOpen();
  };

  const handleSearchChange = (value: string) => {
    setSearchParams((prev) => ({
      ...prev,
      search: value,
      page: PAGINATION_PARAMS.DEFAULT.page,
    }));
  };

  const handleStatusChange = (value: string | null) => {
    setSearchParams((prev) => {
      const filters = { ...(prev.filters ?? {}) };
      if (value) {
        filters.status = { eq: value };
      } else {
        delete filters.status;
      }

      return {
        ...prev,
        filters: Object.keys(filters).length ? filters : undefined,
        page: PAGINATION_PARAMS.DEFAULT.page,
      };
    });
  };

  const handleIssuerFilterChange = (value: string | null) => {
    setSearchParams((prev) => {
      const filters = { ...(prev.filters ?? {}) };
      if (value === "me") {
        if (!currentUser?.id) return prev;
        filters.issuerId = { eq: currentUser.id };
      } else {
        delete filters.issuerId;
      }

      return {
        ...prev,
        filters: Object.keys(filters).length ? filters : undefined,
        page: PAGINATION_PARAMS.DEFAULT.page,
      };
    });
  };

  const handlePageChange = (page: number) => {
    setSearchParams((prev) => ({ ...prev, page }));
    headerRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const certificates = certificatesResponse?.data ?? [];
  const totalPages = certificatesResponse?.pagination?.totalPage ?? 0;

  const isIssuerFilterReady = issuerFilterInitialized.current;
  const isEmptyState =
    isIssuerFilterReady && !isFetching && certificates.length === 0;
  const isLoadingCertificates = isLoading || !isIssuerFilterReady;

  useEffect(() => {
    if (!currentOrganization?.id || !currentUser?.id || !isIssuerFilterReady) {
      return;
    }
    refetch();
  }, [
    currentOrganization?.id,
    currentUser?.id,
    isIssuerFilterReady,
    searchParams.filters,
    searchParams.sort,
    searchParams.page,
    searchParams.limit,
    debouncedSearch,
    refetch,
  ]);

  const isOrganizationOwner = currentOrganization?.isOwner ?? false;
  const canApproveCertificate = isOrganizationOwner;
  const canRevokeCertificate = isOrganizationOwner;

  const canSignSelectedCertificate = useMemo(() => {
    if (!selectedCertificate) return false;
    const isIssuer = currentUser?.id === selectedCertificate.issuerId;
    return isOrganizationOwner || isIssuer;
  }, [currentUser?.id, isOrganizationOwner, selectedCertificate]);

  const actionCertificateCode = useMemo(() => {
    if (!actionCertificate) return "";
    return actionCertificate.code?.trim() || "";
  }, [actionCertificate]);

  const handleShowCertificateDetail = (
    certificate: CertificateResponseType
  ) => {
    setSelectedCertificate(certificate);
    detailModal.onOpen();
  };

  const handleCloseCertificateDetail = () => {
    detailModal.onClose();
    setSelectedCertificate(null);
  };

  const handleSignFromItem = (certificate: CertificateResponseType) => {
    setSelectedCertificate(certificate);
    setActionCertificate(certificate);
    signModal.onOpen();
  };

  const handleSignFromDetail = () => {
    if (!selectedCertificate) return;
    setActionCertificate(selectedCertificate);
    signModal.onOpen();
  };

  const handleApproveFromDetail = () => {
    if (!selectedCertificate) return;
    handleOpenApproveModal(selectedCertificate);
  };

  const handleRevokeFromDetail = () => {
    if (!selectedCertificate) return;
    handleOpenRevokeModal(selectedCertificate);
  };

  const handleShowIssuerDetail = (issuer: UserResponseType) => {
    setSelectedIssuer(issuer);
    issuerDetailModal.onOpen();
  };

  const handleCloseIssuerDetail = () => {
    issuerDetailModal.onClose();
    setSelectedIssuer(null);
  };

  const handleConfirmApprove = () => {
    if (!canApproveCertificate || !actionCertificate?.id) return;
    approveCertificateMutate(actionCertificate.id);
  };

  const handleConfirmRevoke = (reason: string) => {
    if (!canRevokeCertificate || !actionCertificate?.id) return;
    revokeCertificateMutate({
      id: actionCertificate.id,
      data: { revokeReason: reason },
    });
  };

  const handleUpdateCertificate = (certificate: CertificateResponseType) => {
    console.log("Update certificate", certificate.id);
  };

  const handleDeleteCertificate = (certificate: CertificateResponseType) => {
    console.log("Delete certificate", certificate.id);
  };

  const handleSignSuccess = () => {
    detailModal.onClose();
    signModal.onClose();
    refetch();
  };

  return (
    <Box className="w-full relative flex h-full flex-col">
      <PageHeader
        showBackButton={isAdmin}
        title={t("certificates")}
        classNames={{
          wrapper: "bg-white/90 backdrop-blur dark:bg-slate-950/90 rounded-sm",
        }}
      >
        <Group wrap="nowrap">
          {!isAdmin && (
            <Select
              placeholder={t("issuer_filter_placeholder")}
              data={issuerFilterOptions}
              value={
                searchParams.filters?.issuerId?.eq
                  ? "me"
                  : ("all" as string | null)
              }
              onChange={handleIssuerFilterChange}
              checkIconPosition="right"
              classNames={{
                wrapper:
                  "w-full max-w-[180px] hidden lg:block text-color-light",
                option: "text-color-light dark:text-color-dark",
              }}
              allowDeselect={false}
            />
          )}
          <Select
            placeholder={t("status")}
            data={statusOptions}
            value={(searchParams.filters?.status?.eq as string | null) ?? null}
            onChange={handleStatusChange}
            checkIconPosition="right"
            classNames={{
              wrapper: "w-full max-w-[180px] hidden lg:block text-color-light",
              option: "text-color-light dark:text-color-dark",
            }}
            allowDeselect
          />

          <Input
            placeholder={t("enter_search_keyword")}
            value={searchParams.search}
            onChange={(event) => handleSearchChange(event.currentTarget.value)}
            className="w-full max-w-[240px] hidden lg:block"
          />

          <ButtonAdd
            onClick={() =>
              router.push(PAGE_URLS.ORGANIZATION_CREATE_CERTIFICATE)
            }
          />
        </Group>
      </PageHeader>
      <PageContentWrapper>
        <div ref={headerRef}></div>
        {isLoadingCertificates ? (
          <Grid gutter="md">
            {Array.from({ length: searchParams.limit }).map((_, index) => (
              <Grid.Col key={index} span={{ base: 12, md: 6, xl: 4 }}>
                <CertificateItemSkeleton />
              </Grid.Col>
            ))}
          </Grid>
        ) : isEmptyState ? (
          <NoData />
        ) : (
          <Grid gutter="md">
            {certificates.map((certificate) => (
              <Grid.Col key={certificate.id} span={{ base: 12, md: 6, xl: 4 }}>
                <CertificateItem
                  certificate={certificate}
                  onShowDetail={handleShowCertificateDetail}
                  onUpdate={handleUpdateCertificate}
                  onDelete={handleDeleteCertificate}
                  onShowIssuerDetail={handleShowIssuerDetail}
                  onApprove={
                    isOrganizationOwner ? handleOpenApproveModal : undefined
                  }
                  onRevoke={
                    isOrganizationOwner ? handleOpenRevokeModal : undefined
                  }
                  onSign={handleSignFromItem}
                  canSign={
                    (isOrganizationOwner ||
                      currentUser?.id === certificate.issuerId) &&
                    certificate.status === CERTIFICATE_STATUSES.CREATED
                  }
                  canApprove={
                    isOrganizationOwner &&
                    certificate.status === CERTIFICATE_STATUSES.SIGNED
                  }
                  canRevoke={
                    isOrganizationOwner &&
                    certificate.status === CERTIFICATE_STATUSES.VERIFIED
                  }
                />
              </Grid.Col>
            ))}
          </Grid>
        )}

        {totalPages > 1 && (
          <PaginationCustom
            value={searchParams.page}
            total={totalPages}
            onChange={handlePageChange}
          />
        )}

        <ConfirmationModal
          type="approve_certificate"
          opened={confirmationModal.isOpen}
          onClose={handleCloseActionModals}
          onConfirm={handleConfirmApprove}
          isLoading={isApproving}
          itemName={actionCertificateCode || t("not_updated")}
          description={t("approve_certificate_confirmation", {
            code: actionCertificateCode || t("not_updated"),
          })}
          zIndex={2100}
        />
        <SignCertificateModal
          opened={signModal.isOpen}
          onClose={handleCloseActionModals}
          certificate={actionCertificate}
          onSignSuccess={handleSignSuccess}
          zIndex={2100}
        />
        <RevokeCertificateModal
          opened={revokeModal.isOpen}
          onClose={handleCloseActionModals}
          onConfirm={handleConfirmRevoke}
          isLoading={isRevoking}
          certificateCode={actionCertificateCode}
          zIndex={2100}
        />

        <CertificateDetailModal
          opened={detailModal.isOpen}
          onClose={handleCloseCertificateDetail}
          certificate={selectedCertificate}
          onSignSuccess={handleSignSuccess}
          canSign={canSignSelectedCertificate}
          canApprove={canApproveCertificate}
          canRevoke={canRevokeCertificate}
          onApproveCertificate={handleApproveFromDetail}
          onRevokeCertificate={handleRevokeFromDetail}
          onSignCertificate={handleSignFromDetail}
        />
        <UserDetailModal
          opened={issuerDetailModal.isOpen && Boolean(selectedIssuer)}
          onClose={handleCloseIssuerDetail}
          user={selectedIssuer}
        />
      </PageContentWrapper>
    </Box>
  );
};
