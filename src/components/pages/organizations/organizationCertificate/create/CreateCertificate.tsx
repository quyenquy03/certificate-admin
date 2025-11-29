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
} from "@/components";
import { PAGE_URLS } from "@/constants";
import { CERTIFICATE_ADDITIONAL_FIELD, COUNTRIES, FORM_MODES } from "@/enums";
import { useCreateCertificate } from "@/mutations";
import { useQueryGetAllCertificateTypes } from "@/queries";
import { BaseErrorType, CertificateItemFormType } from "@/types";
import { Box, Flex, Grid, Group, Paper, Stack, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { isAxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { FiArrowLeft } from "react-icons/fi";
import { stores } from "@/stores";
import { useDisclose } from "@/hooks";

type CreateCertificateFormValues = {
  validFrom: Date | null;
  validTo: Date | null;
  certificateTypeId: string;
  organizationId: string;

  [CERTIFICATE_ADDITIONAL_FIELD.ADDRESS]?: string;
  [CERTIFICATE_ADDITIONAL_FIELD.SIGNER]?: string;
};

const DEFAULT_VALUES: CreateCertificateFormValues = {
  validFrom: null,
  validTo: null,
  certificateTypeId: "",
  organizationId: "",
};

export const CreateCertificate = () => {
  const t = useTranslations();
  const router = useRouter();
  const certificateItemModal = useDisclose();
  const importCertificateModal = useDisclose();

  const [listCertificates, setListCertificates] = useState<
    CertificateItemFormType[]
  >([]);
  const [currentCertificate, setCurrentCertificate] =
    useState<CertificateItemFormType | null>(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateCertificateFormValues>({
    defaultValues: DEFAULT_VALUES,
  });

  const watchValidFrom = watch("validFrom");
  const watchValidTo = watch("validTo");
  const formRef = useRef<HTMLFormElement | null>(null);
  const { currentOrganization } = stores.organization();

  const {
    data: certificateTypesResponse,
    isFetching: isLoadingCertificateTypes,
  } = useQueryGetAllCertificateTypes(undefined, {
    enabled: true,
  } as any);

  const certificateTypeOptions = useMemo(() => {
    return (certificateTypesResponse?.data ?? []).map((type) => {
      const trimmedName = type.name?.trim() ?? "";
      const trimmedCode = type.code?.trim() ?? "";

      return {
        value: type.id,
        label:
          trimmedName.length > 0
            ? trimmedName
            : trimmedCode.length > 0
            ? trimmedCode
            : t("not_updated"),
        code: trimmedCode,
      };
    });
  }, [certificateTypesResponse?.data, t]);

  const { mutate: createCertificate, isPending: isCreating } =
    useCreateCertificate({
      onSuccess: () => {
        notifications.show({
          title: "Certificate created",
          message: "You created the certificate successfully.",
          color: "green",
        });
        reset(DEFAULT_VALUES);
        router.push(PAGE_URLS.ORGANIZATIONS_CERTIFICATES);
      },
      onError: (error) => {
        if (isAxiosError<BaseErrorType>(error)) {
          const code = error.response?.data?.code ?? "common_error_message";
          notifications.show({
            title: "Create certificate failed",
            message: t(code as any),
            color: "red",
          });
          return;
        }

        notifications.show({
          title: "Create certificate failed",
          message: t("common_error_message"),
          color: "red",
        });
      },
    });

  const isProcessing = isSubmitting || isCreating;

  const handleSubmitFromHeader = () => {
    if (isProcessing) return;
    formRef.current?.requestSubmit();
  };

  const onSubmit: SubmitHandler<CreateCertificateFormValues> = (values) => {
    console.log(values);
  };

  const handleBack = () => {
    router.push(PAGE_URLS.ORGANIZATIONS_CERTIFICATES);
  };

  const handleCloseCertificateItemModal = () => {
    setCurrentCertificate(null);
    certificateItemModal.onClose();
  };

  const handleCreateCertificate = () => {
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
        title: "Add certificate item fail",
        message: t("common_error_message"),
        color: "red",
      });
      return;
    }

    if (action === FORM_MODES.CREATE) {
      setListCertificates((prev) => [...prev, certificateItem]);

      notifications.show({
        title: "Add certificate item success",
        message: "Da them thanh cong mot chung chi moi",
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
      title: "Update certificate item success",
      message: "Da chinh sua thanh cong mot chung chi",
      color: "green",
    });
  };

  useEffect(() => {
    if (currentOrganization?.id) {
      setValue("organizationId", currentOrganization.id, {
        shouldDirty: true,
      });
    }
  }, [currentOrganization?.id, setValue]);

  return (
    <Box className="w-full relative flex h-full flex-col">
      <PageHeader
        title="Create certificate"
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
            Cancel
          </Button>
          <Button
            type="button"
            size="sm"
            className="px-6"
            onClick={handleSubmitFromHeader}
            disabled={isProcessing}
          >
            {isProcessing ? "Processing..." : "Save"}
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
                      Certificate details
                    </Text>
                    <Text className="text-sm text-slate-500 dark:text-slate-400">
                      Fill in the basic information for the new certificate.
                    </Text>
                  </Stack>

                  <Grid gutter="md">
                    <Grid.Col span={{ base: 12, sm: 6 }}>
                      <FormDatePicker
                        name="validFrom"
                        name_label="Valid from"
                        name_placeholder="Select start date"
                        errors={errors}
                        control={control as any}
                        isTranslate={false}
                        maxDate={watchValidTo ?? undefined}
                        rules={{
                          required: t("required_field"),
                        }}
                      />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, sm: 6 }}>
                      <FormDatePicker
                        name="validTo"
                        name_label="Valid to"
                        name_placeholder="Select end date"
                        errors={errors}
                        control={control as any}
                        isTranslate={false}
                        minDate={watchValidFrom ?? undefined}
                        rules={{
                          required: t("required_field"),
                        }}
                      />
                    </Grid.Col>
                    <Grid.Col span={12}>
                      <FormSelect
                        name="certificateTypeId"
                        name_label="Certificate type"
                        name_placeholder="Select certificate type"
                        control={control as any}
                        errors={errors}
                        data={certificateTypeOptions}
                        isTranslate={false}
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
                        name_label={t("signer_label")}
                        name_placeholder={t("signer_placeholder")}
                        register={register as any}
                        errors={errors}
                        isTranslate={false}
                        rules={{
                          required: t("required_field"),
                        }}
                      />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12 }}>
                      <FormInput
                        name={CERTIFICATE_ADDITIONAL_FIELD.ADDRESS}
                        name_label={t("address_label")}
                        name_placeholder={t("address_placeholder")}
                        register={register as any}
                        errors={errors}
                        isTranslate={false}
                        rules={{
                          required: t("required_field"),
                        }}
                      />
                    </Grid.Col>
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
                    List certificates
                  </Text>
                  <Group>
                    <ButtonImport onClick={importCertificateModal.onOpen} />
                    <ButtonAdd onClick={handleCreateCertificate} />
                  </Group>
                </Flex>

                <Box
                  className="h-[calc(100vh-150px)] overflow-y-auto scrollbar"
                  px={16}
                  py={10}
                >
                  {listCertificates.length === 0 ? (
                    <NoData />
                  ) : (
                    <Grid gutter="md">
                      {listCertificates.map((certificate) => (
                        <Grid.Col
                          span={{ base: 12, md: 6 }}
                          key={certificate.authorIdCard}
                        >
                          <AddCertificateItem
                            certificate={certificate}
                            onUpdate={handleEditCertificate}
                            onDelete={handleDeleteCertificate}
                          />
                        </Grid.Col>
                      ))}
                    </Grid>
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
      />

      <ImportCertificateModal
        opened={importCertificateModal.isOpen}
        onClose={importCertificateModal.onClose}
      />
    </Box>
  );
};
