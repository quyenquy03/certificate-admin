"use client";

import {
  PageHeader,
  ButtonAdd,
  PaginationCustom,
  CertificateTypeItemSkeleton,
  CertificateTypeItem,
  CertificateTypeFormModal,
  CertificateTypeDetailModal,
  ConfirmationModal,
} from "@/components";
import { PAGINATION_PARAMS } from "@/constants";
import { FORM_MODES, SORTS } from "@/enums";
import { removeNoneCharacters, useDebounce, useDisclose } from "@/hooks";
import {
  useQueryGetAllCertificateTypes,
  useQueryGetCertificateType,
} from "@/queries";
import {
  BaseErrorType,
  BasePaginationParams,
  CertificateCategoryType,
} from "@/types";
import {
  useActivateCertificateType,
  useDeactivateCertificateType,
  useDeleteCertificateType,
} from "@/mutations";
import { Box, Grid, Input } from "@mantine/core";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { notifications } from "@mantine/notifications";
import { isAxiosError } from "axios";
import type { ConfirmationModalType } from "@/components";

export const CertificateTypesManagement = () => {
  const t = useTranslations();
  const detailModal = useDisclose();
  const formModal = useDisclose();
  const confirmationModal = useDisclose();
  const [formMode, setFormMode] = useState<FORM_MODES>(FORM_MODES.CREATE);
  const [selectedCertificateType, setSelectedCertificateType] =
    useState<CertificateCategoryType | null>(null);
  const [selectedCertificateTypeId, setSelectedCertificateTypeId] = useState<
    string | null
  >(null);
  const [confirmationType, setConfirmationType] =
    useState<ConfirmationModalType | null>(null);
  const [confirmationTarget, setConfirmationTarget] =
    useState<CertificateCategoryType | null>(null);

  const [searchParams, setSearchParams] = useState<BasePaginationParams>({
    page: PAGINATION_PARAMS.GET_CERTIFICATE_TYPES.page,
    limit: PAGINATION_PARAMS.GET_CERTIFICATE_TYPES.limit,
    search: "",
    sort: {
      createdAt: SORTS.DESC,
    },
  });

  const searchDebouncedValue = useDebounce(
    searchParams.search?.trim() ?? "",
    700
  );

  const {
    data: certificateTypesData,
    isFetching,
    refetch: refetchListCertificateTypes,
  } = useQueryGetAllCertificateTypes({
    ...searchParams,
    search: removeNoneCharacters(searchDebouncedValue),
  });

  const {
    data: certificateTypeDetail,
    isFetching: isFetchingCertificateTypeDetail,
    refetch: refetchCertificateTypeDetail,
  } = useQueryGetCertificateType(selectedCertificateTypeId ?? "", {
    enabled: detailModal.isOpen && !!selectedCertificateTypeId,
  } as any);

  const certificateTypeDetailData =
    (Array.isArray(certificateTypeDetail?.data)
      ? certificateTypeDetail?.data?.[0]
      : certificateTypeDetail?.data) ?? selectedCertificateType;
  const isCertificateTypeLoading =
    isFetchingCertificateTypeDetail && !certificateTypeDetailData;

  useEffect(() => {
    refetchListCertificateTypes();
  }, [
    refetchListCertificateTypes,
    searchParams.limit,
    searchParams.page,
    searchParams.filters,
    searchDebouncedValue,
  ]);

  const handleOpenCreateModal = () => {
    setFormMode(FORM_MODES.CREATE);
    setSelectedCertificateType(null);
    setSelectedCertificateTypeId(null);
    formModal.onOpen();
  };

  const handleCloseFormModal = () => {
    formModal.onClose();
    setSelectedCertificateType(null);
    setSelectedCertificateTypeId(null);
  };

  const handleSuccessForm = () => {
    refetchListCertificateTypes();
  };

  const handleOpenUpdateModal = (certificateType: CertificateCategoryType) => {
    setFormMode(FORM_MODES.UPDATE);
    setSelectedCertificateType(certificateType);
    setSelectedCertificateTypeId(certificateType.id);
    formModal.onOpen();
  };

  const handleViewDetail = (certificateType: CertificateCategoryType) => {
    setSelectedCertificateType(certificateType);
    setSelectedCertificateTypeId(certificateType.id);
    detailModal.onOpen();
  };

  const handleCloseDetailModal = () => {
    detailModal.onClose();
    setSelectedCertificateType(null);
    setSelectedCertificateTypeId(null);
  };

  const handleOpenConfirmationModal = (
    type: ConfirmationModalType,
    certificateType: CertificateCategoryType
  ) => {
    setConfirmationType(type);
    setConfirmationTarget(certificateType);
    confirmationModal.onOpen();
  };

  const handleCloseConfirmationModal = () => {
    confirmationModal.onClose();
    setConfirmationType(null);
    setConfirmationTarget(null);
  };

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

  const { mutate: deleteCertificateType, isPending: isDeletingCertificateType } =
    useDeleteCertificateType({
      onSuccess: (_data, id) => {
        notifications.show({
          title: t("delete_certificate_type_success_title"),
          message: t("delete_certificate_type_success_desc"),
          color: "green",
        });

        if (detailModal.isOpen && selectedCertificateTypeId === id) {
          handleCloseDetailModal();
        }

        handleCloseConfirmationModal();
        refetchListCertificateTypes();
      },
      onError: (error) =>
        handleMutationError(error, "delete_certificate_type_fail"),
    });

  const {
    mutate: activateCertificateType,
    isPending: isActivatingCertificateType,
  } = useActivateCertificateType({
    onSuccess: (_data, id) => {
      notifications.show({
        title: t("activate_certificate_type_success_title"),
        message: t("activate_certificate_type_success_desc"),
        color: "green",
      });
      handleCloseConfirmationModal();
      refetchListCertificateTypes();
      if (detailModal.isOpen && selectedCertificateTypeId === id) {
        refetchCertificateTypeDetail();
      }
    },
    onError: (error) =>
      handleMutationError(error, "activate_certificate_type_fail"),
  });

  const {
    mutate: deactivateCertificateType,
    isPending: isDeactivatingCertificateType,
  } = useDeactivateCertificateType({
    onSuccess: (_data, id) => {
      notifications.show({
        title: t("deactivate_certificate_type_success_title"),
        message: t("deactivate_certificate_type_success_desc"),
        color: "green",
      });
      handleCloseConfirmationModal();
      refetchListCertificateTypes();
      if (detailModal.isOpen && selectedCertificateTypeId === id) {
        refetchCertificateTypeDetail();
      }
    },
    onError: (error) =>
      handleMutationError(error, "deactivate_certificate_type_fail"),
  });

  const isConfirmationProcessing =
    isDeletingCertificateType ||
    isActivatingCertificateType ||
    isDeactivatingCertificateType;

  const handleConfirmAction = () => {
    if (!confirmationType || !confirmationTarget?.id) {
      return;
    }

    const targetId = confirmationTarget.id;

    if (confirmationType === "delete") {
      deleteCertificateType(targetId);
      return;
    }

    if (confirmationType === "activate") {
      activateCertificateType(targetId);
      return;
    }

    if (confirmationType === "deactivate") {
      deactivateCertificateType(targetId);
    }
  };

  return (
    <Box className="w-full relative">
      <PageHeader
        title={t("certificate_types_management")}
        classNames={{ wrapper: "relative z-10 gap-4" }}
      >
        <Input
          placeholder={t("enter_search_keyword")}
          className="w-full max-w-[200px]"
          value={searchParams?.search ?? ""}
          onChange={(event) =>
            setSearchParams((prev) => ({
              ...prev,
              search: event.target.value,
            }))
          }
        />
        <ButtonAdd onClick={handleOpenCreateModal} />
      </PageHeader>

      <Box className="overflow-y-auto h-[calc(100vh-56px)] p-4">
        {isFetching ? (
          <Grid gutter="md">
            {new Array(PAGINATION_PARAMS.GET_USERS.limit)
              .fill(0)
              .map((_, index) => (
                <Grid.Col
                  key={index}
                  span={{
                    base: 12,
                    sm: 12,
                    md: 6,
                    xl: 4,
                  }}
                >
                  <CertificateTypeItemSkeleton />
                </Grid.Col>
              ))}
          </Grid>
        ) : certificateTypesData &&
          certificateTypesData.data &&
          certificateTypesData.data?.length > 0 ? (
          <Grid gutter="md">
            {certificateTypesData?.data.map((item) => (
              <Grid.Col
                key={item.id}
                span={{
                  base: 12,
                  sm: 12,
                  md: 6,
                  xl: 4,
                }}
              >
                <CertificateTypeItem
                  certificateType={item}
                  onViewDetail={handleViewDetail}
                  onUpdate={handleOpenUpdateModal}
                  onActivate={(certificateType) =>
                    handleOpenConfirmationModal("activate", certificateType)
                  }
                  onDeactivate={(certificateType) =>
                    handleOpenConfirmationModal("deactivate", certificateType)
                  }
                  onDelete={(certificateType) =>
                    handleOpenConfirmationModal("delete", certificateType)
                  }
                />
              </Grid.Col>
            ))}
          </Grid>
        ) : (
          <div>no user</div>
        )}
        {certificateTypesData &&
          certificateTypesData?.pagination &&
          certificateTypesData?.pagination?.totalPage > 1 && (
            <PaginationCustom
              value={searchParams?.page}
              total={certificateTypesData?.pagination?.totalPage ?? 0}
              onChange={(page) =>
                setSearchParams((prev) => ({ ...prev, page }))
              }
            />
          )}
      </Box>
      <CertificateTypeFormModal
        mode={formMode}
        opened={formModal.isOpen}
        onClose={handleCloseFormModal}
        onSuccess={handleSuccessForm}
        certificateType={selectedCertificateType}
      />
      <CertificateTypeDetailModal
        opened={detailModal.isOpen}
        onClose={handleCloseDetailModal}
        certificateType={certificateTypeDetailData ?? null}
        isLoading={isCertificateTypeLoading}
        size="lg"
      />
      <ConfirmationModal
        type={confirmationType ?? "delete"}
        title={
          confirmationType
            ? t("certificate_type_confirmation_title", {
                type: confirmationType,
              })
            : ""
        }
        description={
          confirmationType
            ? t("certificate_type_confirmation_desc", {
                type: confirmationType,
                name: (() => {
                  const trimmed = confirmationTarget?.name?.trim() ?? "";
                  return trimmed.length > 0 ? trimmed : t("not_updated");
                })(),
              })
            : ""
        }
        itemName={confirmationTarget?.name?.trim() ?? ""}
        opened={confirmationModal.isOpen}
        onClose={handleCloseConfirmationModal}
        onConfirm={handleConfirmAction}
        isLoading={isConfirmationProcessing}
      />
    </Box>
  );
};
