"use client";

import {
  Button,
  ButtonAdd,
  ButtonImport,
  AddCertificateItem,
  CreateEditCertificateModal,
  FormDatePicker,
  FormInput,
  FormSelect,
  NoData,
  PageContentWrapper,
  PageHeader,
  ImportCertificateModal,
  PaginationCustom,
} from "@/components";
import { PAGE_URLS, DEFAULT_CERTIFICATE_DURATION_YEARS } from "@/constants";
import {
  CERTIFICATE_ADDITIONAL_FIELD,
  CERTIFICATE_TYPE_ADDITIONAL_FIELD,
  CERTIFICATE_TEMPLATES,
  FORM_MODES,
  CERTIFICATE_STATUSES,
  COUNTRIES,
} from "@/enums";
import { useImportCertificates, useUpdateCertificate } from "@/mutations";
import {
  useQueryGetAllCertificateTypes,
  useQueryGetCertificate,
} from "@/queries";
import {
  AdditionalInfoType,
  BaseErrorType,
  CertificateItemFormType,
  ImportCertificateItem,
  CertificateCategoryAdditionalInfoType,
  CreateEditCertificateRequestType,
  OrganizationResponseType,
} from "@/types";
import { calculateEndDate } from "@/helpers/formatDate";
import {
  Box,
  Flex,
  Grid,
  Group,
  Input,
  Loader,
  Paper,
  Stack,
  Text,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { isAxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { FiArrowLeft } from "react-icons/fi";
import { useDebounce, useDisclose } from "@/hooks";

type CreateCertificateFormValues = {
  validFrom: Date | null;
  certificateTypeId: string;
  organizationId: string;

  [CERTIFICATE_ADDITIONAL_FIELD.ADDRESS]?: string;
  [CERTIFICATE_ADDITIONAL_FIELD.SIGNER]?: string;
  [CERTIFICATE_ADDITIONAL_FIELD.CENTRE_NUMBER]?: string;
};

type CreateUpdateCertificateProps = {
  currentOrganization: OrganizationResponseType | null;
  certificateId?: string | null;
};

const DEFAULT_VALUES: CreateCertificateFormValues = {
  validFrom: null,
  certificateTypeId: "",
  organizationId: "",
};

type CertificateTypeOption = {
  value: string;
  label: string;
  code: string;
  additionalInfo?: CertificateCategoryAdditionalInfoType;
};

const parseCertificateTypeAdditionalInfo = (
  additionalInfo?: string | null
): CertificateCategoryAdditionalInfoType => {
  if (!additionalInfo) return {};

  try {
    const parsedInfo = JSON.parse(additionalInfo);
    if (parsedInfo && typeof parsedInfo === "object") {
      return parsedInfo as CertificateCategoryAdditionalInfoType;
    }
    return {};
  } catch (error) {
    console.error("Failed to parse certificate type additional info", error);
    return {};
  }
};

const parseCertificateAdditionalInfo = (
  additionalInfo?: string | null
): AdditionalInfoType => {
  if (!additionalInfo) return {};

  try {
    const parsedInfo = JSON.parse(additionalInfo);
    if (parsedInfo && typeof parsedInfo === "object") {
      return parsedInfo as AdditionalInfoType;
    }
    return {};
  } catch (error) {
    console.error("Failed to parse certificate additional info", error);
    return {};
  }
};

export const CreateUpdateCertificate = ({
  currentOrganization,
  certificateId,
}: CreateUpdateCertificateProps) => {
  const t = useTranslations();
  const router = useRouter();
  const certificateItemModal = useDisclose();
  const importCertificateModal = useDisclose();
  const isUpdateMode = Boolean(certificateId);

  const [listCertificates, setListCertificates] = useState<
    CertificateItemFormType[]
  >([]);
  const [currentCertificate, setCurrentCertificate] =
    useState<CertificateItemFormType | null>(null);

  const [searchParams, setSearchParams] = useState({
    pageSize: 10,
    page: 1,
    search: "",
  });
  const debouncedSearch = useDebounce(searchParams.search.trim(), 300);

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    setValue,
    trigger,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<CreateCertificateFormValues>({
    defaultValues: DEFAULT_VALUES,
  });

  const certificateTypeId = watch("certificateTypeId");
  const formRef = useRef<HTMLFormElement | null>(null);

  const {
    data: certificateDetailResponse,
    isFetching: isLoadingCertificate,
  } = useQueryGetCertificate(certificateId ?? "", {
    enabled: isUpdateMode,
    retry: 1,
    onError: () => {
      notifications.show({
        title: t("update_certificate_failed_title"),
        message: t("common_error_message"),
        color: "red",
      });
      router.push(PAGE_URLS.ORGANIZATIONS_CERTIFICATES);
    },
  } as any);

  const {
    data: certificateTypesResponse,
    isFetching: isLoadingCertificateTypes,
  } = useQueryGetAllCertificateTypes(undefined, {
    enabled: true,
  } as any);

  const certificateDetail = certificateDetailResponse?.data ?? null;

  const certificateAdditionalInfo = useMemo(
    () =>
      parseCertificateAdditionalInfo(
        certificateDetail?.authorProfile?.additionalInfo
      ),
    [certificateDetail?.authorProfile?.additionalInfo]
  );

  const certificateTypeOptions = useMemo<CertificateTypeOption[]>(() => {
    return (certificateTypesResponse?.data ?? []).map((type) => {
      const trimmedName = type.name?.trim() ?? "";
      const trimmedCode = type.code?.trim() ?? "";
      const parsedAdditionalInfo = parseCertificateTypeAdditionalInfo(
        type.additionalInfo
      );

      return {
        value: type.id,
        label:
          trimmedName.length > 0
            ? trimmedName
            : trimmedCode.length > 0
            ? trimmedCode
            : t("not_updated"),
        code: trimmedCode,
        additionalInfo: parsedAdditionalInfo,
      };
    });
  }, [certificateTypesResponse?.data, t]);

  const selectedCertificateType = useMemo(() => {
    if (!certificateTypeId || !certificateTypeOptions.length) return null;
    return (
      certificateTypeOptions.find((item) => item.value === certificateTypeId) ??
      null
    );
  }, [certificateTypeId, certificateTypeOptions]);

  const certificateCategory = useMemo(() => {
    if (!selectedCertificateType) return null;

    const template =
      selectedCertificateType.additionalInfo?.[
        CERTIFICATE_TYPE_ADDITIONAL_FIELD.CERTIFICATE_TEMPLATE
      ];

    if (!template) return null;

    return template as CERTIFICATE_TEMPLATES;
  }, [selectedCertificateType]);

  const durationYears = useMemo(() => {
    const rawDuration =
      selectedCertificateType?.additionalInfo?.[
        CERTIFICATE_TYPE_ADDITIONAL_FIELD.EXPIRED_YEAR
      ];
    const parsedDuration = Number(rawDuration);

    if (rawDuration === "" || rawDuration === null || rawDuration === undefined)
      return DEFAULT_CERTIFICATE_DURATION_YEARS;

    if (Number.isNaN(parsedDuration)) return DEFAULT_CERTIFICATE_DURATION_YEARS;

    return parsedDuration;
  }, [selectedCertificateType?.additionalInfo]);

  const { mutate: importCertificates, isPending: isImporting } =
    useImportCertificates({
      onSuccess: () => {
        notifications.show({
          title: t("create_certificate_success_title"),
          message: t("create_certificate_success_message"),
          color: "green",
        });
        reset(DEFAULT_VALUES);
        router.push(PAGE_URLS.ORGANIZATIONS_CERTIFICATES);
      },
      onError: (error) => {
        if (isAxiosError<BaseErrorType>(error)) {
          const code = error.response?.data?.code ?? "common_error_message";
          notifications.show({
            title: t("create_certificate_failed_title"),
            message: t(code as any),
            color: "red",
          });
          return;
        }

        notifications.show({
          title: t("create_certificate_failed_title"),
          message: t("common_error_message"),
          color: "red",
        });
      },
    });

  const { mutate: updateCertificate, isPending: isUpdating } =
    useUpdateCertificate({
      onSuccess: () => {
        notifications.show({
          title: t("update_certificate_item_success"),
          message: t("update_certificate_item_success_message"),
          color: "green",
        });
        router.push(PAGE_URLS.ORGANIZATIONS_CERTIFICATES);
      },
      onError: (error) => {
        if (isAxiosError<BaseErrorType>(error)) {
          const code = error.response?.data?.code ?? "common_error_message";
          notifications.show({
            title: t("update_certificate_failed_title"),
            message: t(code as any),
            color: "red",
          });
          return;
        }

        notifications.show({
          title: t("update_certificate_failed_title"),
          message: t("common_error_message"),
          color: "red",
        });
      },
    });

  const isProcessing =
    isSubmitting || isImporting || isUpdating || isLoadingCertificate;

  const handleSubmitFromHeader = () => {
    if (isProcessing) return;
    formRef.current?.requestSubmit();
  };

  const onSubmit: SubmitHandler<CreateCertificateFormValues> = (values) => {
    try {
      const organizationId =
        currentOrganization?.id ||
        certificateDetail?.organizationId ||
        values.organizationId;

      if (!organizationId) {
        notifications.show({
          title: isUpdateMode
            ? t("update_certificate_failed_title")
            : t("create_certificate_failed_title"),
          message: t("organization_not_found"),
          color: "red",
        });
        return;
      }
      const selectedCertificateType = certificateTypeOptions.find(
        (item) => item.value === values.certificateTypeId
      );
      if (!selectedCertificateType) {
        notifications.show({
          title: isUpdateMode
            ? t("update_certificate_failed_title")
            : t("create_certificate_failed_title"),
          message: t("certificate_type_not_found"),
          color: "red",
        });
        return;
      }

      if (isUpdateMode) {
        const certificateItem = listCertificates[0];
        if (!certificateItem || !certificateId) {
          notifications.show({
            title: t("update_certificate_failed_title"),
            message: t("common_error_message"),
            color: "red",
          });
          return;
        }

        const additionalInfo: AdditionalInfoType = {
          ...(certificateAdditionalInfo ?? {}),
          signer: values.signer,
          address: values.address,
          certificate_type: selectedCertificateType.code,
        };

        if (
          certificateCategory === CERTIFICATE_TEMPLATES.GRADUATION_CERTIFICATE
        ) {
          additionalInfo.reg_no = certificateItem.reg_no;
          additionalInfo.serial_number = certificateItem.serial_number;
        }

        if (certificateCategory === CERTIFICATE_TEMPLATES.IELTS) {
          additionalInfo.candidate_sex = certificateItem.candidate_sex;
          additionalInfo.candidate_number = certificateItem.candidate_number;
          additionalInfo.first_language = certificateItem.first_language;
          additionalInfo.test_report = certificateItem.test_report;
          additionalInfo.listening_result = certificateItem.listening_result;
          additionalInfo.reading_result = certificateItem.reading_result;
          additionalInfo.writing_result = certificateItem.writing_result;
          additionalInfo.speaking_result = certificateItem.speaking_result;
          additionalInfo.administrator_comments =
            certificateItem.administrator_comments;
          additionalInfo.centre_number =
            values[CERTIFICATE_ADDITIONAL_FIELD.CENTRE_NUMBER];
        }

        const payload: CreateEditCertificateRequestType = {
          id: certificateId ?? "",
          validFrom: values.validFrom?.toISOString() ?? "",
          validTo: calculateEndDate(values.validFrom, durationYears),
          certificateTypeId: selectedCertificateType.value,
          organizationId,
          authorProfile: {
            authorName: certificateItem.authorName,
            authorIdCard: certificateItem.authorIdCard,
            authorDob:
              typeof certificateItem.authorDob === "string"
                ? certificateItem.authorDob
                : certificateItem.authorDob instanceof Date
                ? certificateItem.authorDob.toISOString()
                : "",
            authorImage: certificateItem.authorImage,
            authorEmail: certificateItem.authorEmail,
            authorDocuments:
              certificateDetail?.authorProfile?.authorDocuments ?? [],
            authorCountryCode: certificateItem.authorCountryCode,
            grantLevel:
              typeof certificateItem.grantLevel === "number"
                ? certificateItem.grantLevel
                : Number(certificateItem.grantLevel),
            domain: certificateItem.domain?.trim()
              ? certificateItem.domain?.trim()
              : "private",
            additionalInfo: JSON.stringify(additionalInfo),
          },
        };

        updateCertificate(payload);
        return;
      }

      const certificates: ImportCertificateItem[] = listCertificates.map(
        (item) => {
          const additionalInfo: AdditionalInfoType = {
            signer: values.signer,
            address: values.address,
            certificate_type: selectedCertificateType.code,
          };

          if (
            certificateCategory === CERTIFICATE_TEMPLATES.GRADUATION_CERTIFICATE
          ) {
            additionalInfo.reg_no = item.reg_no;
            additionalInfo.serial_number = item.serial_number;
          }

          if (certificateCategory === CERTIFICATE_TEMPLATES.IELTS) {
            additionalInfo.candidate_sex = item.candidate_sex;
            additionalInfo.candidate_number = item.candidate_number;
            additionalInfo.first_language = item.first_language;
            additionalInfo.test_report = item.test_report;
            additionalInfo.listening_result = item.listening_result;
            additionalInfo.reading_result = item.reading_result;
            additionalInfo.writing_result = item.writing_result;
            additionalInfo.speaking_result = item.speaking_result;
            additionalInfo.administrator_comments = item.administrator_comments;
            additionalInfo.centre_number =
              values[CERTIFICATE_ADDITIONAL_FIELD.CENTRE_NUMBER];
          }

          return {
            validFrom: values.validFrom?.toISOString() ?? "",
            validTo: calculateEndDate(values.validFrom, durationYears),
            authorProfile: {
              authorName: item.authorName,
              authorIdCard: item.authorIdCard,
              authorDob:
                typeof item.authorDob === "string"
                  ? item.authorDob
                  : item.authorDob instanceof Date
                  ? item.authorDob.toISOString()
                  : "",
              authorImage: item.authorImage,
              authorEmail: item.authorEmail,
              authorDocuments: [],
              authorCountryCode: item.authorCountryCode,
              grantLevel:
                typeof item.grantLevel === "number"
                  ? item.grantLevel
                  : Number(item.grantLevel),
              domain: item.domain?.trim() ? item.domain?.trim() : "private",
              additionalInfo: JSON.stringify(additionalInfo),
            },
          };
        }
      );

      importCertificates({
        certificateTypeId: selectedCertificateType.value,
        organizationId,
        certificates,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleBack = () => {
    router.push(PAGE_URLS.ORGANIZATIONS_CERTIFICATES);
  };

  const handleCloseCertificateItemModal = () => {
    setCurrentCertificate(null);
    certificateItemModal.onClose();
  };

  const handleCreateCertificate = async () => {
    if (isUpdateMode) return;

    const checkCertificateCategory = await trigger(["certificateTypeId"]);
    if (!checkCertificateCategory || !certificateCategory) {
      notifications.show({
        title: t("cannot_add_certificate_item"),
        message: t("select_certificate_type_first"),
        color: "red",
      });
      return;
    }
    setCurrentCertificate(null);
    certificateItemModal.onOpen();
  };

  const handleEditCertificate = (certificateItem: CertificateItemFormType) => {
    setCurrentCertificate(certificateItem);
    certificateItemModal.onOpen();
  };

  const handleDeleteCertificate = (
    certificateItem: CertificateItemFormType
  ) => {
    if (isUpdateMode) return;

    setListCertificates((prev) =>
      prev.filter((item) => item.authorIdCard !== certificateItem.authorIdCard)
    );
  };

  const handleCheckExistAuthorCardId = (cardId: string, action: FORM_MODES) => {
    const certificateItem = listCertificates?.find(
      (item) => item.authorIdCard === cardId
    );
    if (!certificateItem) return false;

    if (action === FORM_MODES.CREATE) return true;

    if (certificateItem.authorIdCard !== currentCertificate?.authorIdCard)
      return true;

    return false;
  };

  const handleSaveCertificateItem = (
    certificateItem: CertificateItemFormType,
    action: FORM_MODES
  ) => {
    const isExistAuthor = handleCheckExistAuthorCardId(
      certificateItem.authorIdCard,
      action
    );

    if (isExistAuthor) {
      notifications.show({
        title: t("add_certificate_item_failed"),
        message: t("common_error_message"),
        color: "red",
      });
      return;
    }

    if (action === FORM_MODES.CREATE) {
      if (isUpdateMode) {
        setListCertificates([certificateItem]);
      } else {
        setListCertificates((prev) => [...prev, certificateItem]);
      }

      notifications.show({
        title: t("add_certificate_item_success"),
        message: t("add_certificate_item_success_message"),
        color: "green",
      });
      return;
    }

    const targetId =
      currentCertificate?.authorIdCard ?? certificateItem.authorIdCard;
    const newListCertificates = listCertificates.map((item) =>
      item.authorIdCard === targetId ? { ...item, ...certificateItem } : item
    );

    setListCertificates(newListCertificates);
    setCurrentCertificate(null);

    notifications.show({
      title: t("update_certificate_item_success"),
      message: t("update_certificate_item_success_message"),
      color: "green",
    });
  };

  const handleImportCertificates = (
    certificates: CertificateItemFormType[]
  ) => {
    if (isUpdateMode) return;

    setListCertificates((prev) => [...prev, ...certificates]);
  };

  const handleSearchCertificate = (keyword: string) => {
    setSearchParams((prev) => ({ ...prev, search: keyword, page: 1 }));
  };

  const handleChangePage = (page: number) => {
    setSearchParams((prev) => ({ ...prev, page }));
  };

  const isListLoading = isUpdateMode && isLoadingCertificate;

  const filteredCertificates = useMemo(() => {
    const keyword = debouncedSearch.toLowerCase();
    if (!keyword) return listCertificates;

    return listCertificates.filter((certificate) => {
      return [
        certificate.authorName,
        certificate.authorIdCard,
        certificate.authorEmail,
        certificate.domain,
        certificate.serial_number,
        certificate.reg_no,
      ]
        .filter(Boolean)
        .some((value) =>
          String(value).toLowerCase().includes(keyword.toLowerCase())
        );
    });
  }, [debouncedSearch, listCertificates]);

  const totalPages = useMemo(() => {
    const pages = Math.ceil(
      filteredCertificates.length / searchParams.pageSize
    );
    return pages < 1 ? 1 : pages;
  }, [filteredCertificates.length, searchParams.pageSize]);

  const paginatedCertificates = useMemo(() => {
    const start = (searchParams.page - 1) * searchParams.pageSize;
    return filteredCertificates.slice(start, start + searchParams.pageSize);
  }, [filteredCertificates, searchParams.page, searchParams.pageSize]);

  useEffect(() => {
    if (!isUpdateMode || !certificateDetail) return;

    if (certificateDetail.status !== CERTIFICATE_STATUSES.CREATED) {
      notifications.show({
        title: t("update_certificate_failed_title"),
        message: t("certificate_update_signed_error"),
        color: "red",
      });
      router.push(PAGE_URLS.ORGANIZATIONS_CERTIFICATES);
      return;
    }

    const validFromDate = certificateDetail.validFrom
      ? new Date(certificateDetail.validFrom)
      : null;

    const newCertificateItem: CertificateItemFormType = {
      authorName: certificateDetail.authorProfile?.authorName ?? "",
      authorIdCard: certificateDetail.authorProfile?.authorIdCard ?? "",
      authorDob: certificateDetail.authorProfile?.authorDob
        ? new Date(certificateDetail.authorProfile.authorDob)
        : null,
      authorEmail: certificateDetail.authorProfile?.authorEmail ?? "",
      authorCountryCode:
        certificateDetail.authorProfile?.authorCountryCode ?? COUNTRIES.VIETNAM,
      authorImage: certificateDetail.authorProfile?.authorImage ?? "",
      grantLevel: certificateDetail.authorProfile?.grantLevel ?? "",
      domain: certificateDetail.authorProfile?.domain ?? "",
      serial_number: certificateAdditionalInfo.serial_number as string,
      reg_no: certificateAdditionalInfo.reg_no as string,
      centre_number: certificateAdditionalInfo.centre_number as string,
      candidate_number: certificateAdditionalInfo.candidate_number as string,
      candidate_sex: certificateAdditionalInfo.candidate_sex as string,
      first_language: certificateAdditionalInfo.first_language as string,
      test_report: certificateAdditionalInfo.test_report as string,
      listening_result: certificateAdditionalInfo.listening_result as string,
      reading_result: certificateAdditionalInfo.reading_result as string,
      writing_result: certificateAdditionalInfo.writing_result as string,
      speaking_result: certificateAdditionalInfo.speaking_result as string,
      administrator_comments:
        certificateAdditionalInfo.administrator_comments as string,
    };

    setListCertificates([newCertificateItem]);
    reset({
      validFrom: validFromDate,
      certificateTypeId: certificateDetail.certificateTypeId ?? "",
      organizationId:
        certificateDetail.organizationId ?? currentOrganization?.id ?? "",
      signer:
        (certificateAdditionalInfo[
          CERTIFICATE_ADDITIONAL_FIELD.SIGNER
        ] as string) ?? "",
      address:
        (certificateAdditionalInfo[
          CERTIFICATE_ADDITIONAL_FIELD.ADDRESS
        ] as string) ?? "",
      [CERTIFICATE_ADDITIONAL_FIELD.CENTRE_NUMBER]:
        (certificateAdditionalInfo[
          CERTIFICATE_ADDITIONAL_FIELD.CENTRE_NUMBER
        ] as string) ?? "",
    });
  }, [
    certificateAdditionalInfo,
    certificateDetail,
    currentOrganization?.id,
    isUpdateMode,
    reset,
    router,
    t,
  ]);

  useEffect(() => {
    if (searchParams.page > totalPages) {
      setSearchParams((prev) => ({ ...prev, page: totalPages }));
    }
  }, [searchParams.page, totalPages]);

  useEffect(() => {
    if (isUpdateMode) return;

    if (currentOrganization?.id) {
      setValue("organizationId", currentOrganization.id, {
        shouldDirty: true,
      });
    }
  }, [currentOrganization?.id, isUpdateMode, setValue]);

  useEffect(() => {
    if (certificateTypeId) {
      clearErrors("certificateTypeId");
    }
  }, [certificateTypeId, clearErrors]);

  return (
    <Box className="w-full relative flex h-full flex-col">
      <PageHeader
        title={t(isUpdateMode ? "update_certificate" : "create_certificate")}
        classNames={{
          wrapper:
            "sticky top-0 z-20 gap-4 bg-white/90 backdrop-blur dark:bg-slate-950/90",
        }}
      >
        <Group gap="sm">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={handleBack}
            disabled={isProcessing}
          >
            <FiArrowLeft className="text-base" />
            {t("cancel")}
          </Button>
          <Button
            type="button"
            size="sm"
            className="px-6"
            onClick={handleSubmitFromHeader}
            disabled={isProcessing}
          >
            {isProcessing ? t("processing") : t("save")}
          </Button>
        </Group>
      </PageHeader>

      <PageContentWrapper>
        <form
          ref={formRef}
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <Grid gutter="lg" align="stretch">
            <Grid.Col span={{ base: 12, lg: 4 }}>
              <Paper
                withBorder
                radius="sm"
                shadow="sm"
                className="p-6 bg-white/80 dark:bg-slate-950/80"
              >
                <Stack gap="lg">
                  <Stack gap="xs">
                    <Text className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {t("certificate_details")}
                    </Text>
                    <Text className="text-sm text-slate-500 dark:text-slate-400">
                      {t("certificate_details_description")}
                    </Text>
                  </Stack>

                  <Grid gutter="md">
                    <Grid.Col span={{ base: 12, sm: 6 }}>
                      <FormDatePicker
                        name="validFrom"
                        name_label="valid_from"
                        name_placeholder="valid_from_placeholder"
                        errors={errors}
                        control={control as any}
                        isTranslate
                        rules={{
                          required: t("required_field"),
                        }}
                      />
                    </Grid.Col>
                    <Grid.Col span={12}>
                      <FormSelect
                        name="certificateTypeId"
                        name_label="certificate_type"
                        name_placeholder="certificate_type_placeholder"
                        control={control as any}
                        errors={errors}
                        data={certificateTypeOptions}
                        isTranslate
                        allowDeselect={false}
                        searchable
                        rightSection={
                          isLoadingCertificateTypes ? undefined : null
                        }
                        rules={{
                          required: t("required_field"),
                        }}
                      />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12 }}>
                      <FormInput
                        name={CERTIFICATE_ADDITIONAL_FIELD.SIGNER}
                        name_label="signer_label"
                        name_placeholder="signer_placeholder"
                        register={register as any}
                        errors={errors}
                        isTranslate
                        rules={{
                          required: t("required_field"),
                        }}
                      />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12 }}>
                      <FormInput
                        name={CERTIFICATE_ADDITIONAL_FIELD.ADDRESS}
                        name_label="address_label"
                        name_placeholder="address_placeholder"
                        register={register as any}
                        errors={errors}
                        isTranslate
                        rules={{
                          required: t("required_field"),
                        }}
                      />
                    </Grid.Col>
                    {certificateCategory === CERTIFICATE_TEMPLATES.IELTS && (
                      <Grid.Col span={{ base: 12 }}>
                        <FormInput
                          name={CERTIFICATE_ADDITIONAL_FIELD.CENTRE_NUMBER}
                          name_label="centre_number_label"
                          name_placeholder="centre_number_placeholder"
                          register={register as any}
                          errors={errors}
                          isTranslate
                          rules={{
                            required: t("required_field"),
                          }}
                        />
                      </Grid.Col>
                    )}
                  </Grid>
                </Stack>
              </Paper>
            </Grid.Col>

            <Grid.Col span={{ base: 12, lg: 8 }}>
              <Paper
                withBorder
                radius="sm"
                shadow="sm"
                className="bg-white/80 dark:bg-slate-950/80"
              >
                <Flex
                  align="center"
                  justify={"space-between"}
                  px={16}
                  py={10}
                  className="border-b-2"
                >
                  <Text className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                    {t("list_certificates")} ({filteredCertificates.length})
                  </Text>
                  <Group wrap="nowrap" gap={"xs"}>
                    <Input
                      placeholder={t("enter_search_keyword")}
                      className="w-full max-w-[150px]"
                      value={searchParams.search}
                      onChange={(event) =>
                        handleSearchCertificate(event.currentTarget.value)
                      }
                    />
                    {!isUpdateMode && (
                      <>
                        <ButtonImport onClick={importCertificateModal.onOpen} />
                        <ButtonAdd onClick={handleCreateCertificate} />
                      </>
                    )}
                  </Group>
                </Flex>

                <Box
                  className="relative h-[calc(100vh-150px)] overflow-y-auto scrollbar"
                  px={16}
                  py={10}
                >
                  {isListLoading ? (
                    <Flex justify="center" align="center" className="py-10">
                      <Loader />
                    </Flex>
                  ) : filteredCertificates.length === 0 ? (
                    <NoData />
                  ) : (
                    <Grid gutter="md">
                      {paginatedCertificates.map((certificate) => (
                        <Grid.Col
                            span={{ base: 12, md: 6 }}
                            key={certificate.authorIdCard}
                          >
                            <AddCertificateItem
                              certificate={certificate}
                              onUpdate={handleEditCertificate}
                              onDelete={
                                isUpdateMode ? undefined : handleDeleteCertificate
                              }
                              certificateCategory={certificateCategory}
                            />
                          </Grid.Col>
                      ))}
                    </Grid>
                  )}

                  {!isListLoading && totalPages > 1 && (
                    <PaginationCustom
                      value={searchParams.page}
                      total={totalPages}
                      onChange={handleChangePage}
                      customClassNames={{
                        paginationWrapper: "relative bottom-0 mt-3 opacity-80",
                      }}
                    />
                  )}
                </Box>
              </Paper>
            </Grid.Col>
          </Grid>
        </form>
      </PageContentWrapper>

      <CreateEditCertificateModal
        opened={certificateItemModal.isOpen}
        onClose={handleCloseCertificateItemModal}
        certificateItem={currentCertificate}
        onCheckExistedAuthorId={handleCheckExistAuthorCardId}
        onSaveCertificateItem={handleSaveCertificateItem}
        certificateCategory={certificateCategory}
      />

      <ImportCertificateModal
        opened={importCertificateModal.isOpen}
        onClose={importCertificateModal.onClose}
        onImportCertificate={handleImportCertificates}
      />
    </Box>
  );
};
