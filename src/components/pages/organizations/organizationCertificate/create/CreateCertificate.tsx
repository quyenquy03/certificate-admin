"use client";

import {
  Button,
  FormDatePicker,
  FormInput,
  FormSelect,
  PageContentWrapper,
  PageHeader,
} from "@/components";
import { COUNTRY_OPTIONS, PAGE_URLS } from "@/constants";
import { CERTIFICATE_ADDITIONAL_FIELD, COUNTRIES } from "@/enums";
import { useCreateCertificate, useUploadAuthorImage } from "@/mutations";
import { useQueryGetAllCertificateTypes } from "@/queries";
import { BaseErrorType, CreateCertificateRequestType } from "@/types";
import { Box, Grid, Group, Paper, Stack, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { isAxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { ChangeEvent, useEffect, useMemo, useRef } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { FiArrowLeft } from "react-icons/fi";
import { stores } from "@/stores";

type CreateCertificateFormValues = {
  validFrom: Date | null;
  validTo: Date | null;
  certificateTypeId: string;
  organizationId: string;
  authorName: string;
  authorIdCard: string;
  authorDob: Date | null;
  authorEmail: string;
  authorImage: string;
  authorCountryCode: COUNTRIES;
  grantLevel: number;
  domain?: string;
  [CERTIFICATE_ADDITIONAL_FIELD.ADDRESS]?: string;
  [CERTIFICATE_ADDITIONAL_FIELD.SIGNER]?: string;
  [CERTIFICATE_ADDITIONAL_FIELD.SERIAL_NUMBER]?: string;
  [CERTIFICATE_ADDITIONAL_FIELD.REG_NO]?: string;
};

const DEFAULT_VALUES: CreateCertificateFormValues = {
  validFrom: null,
  validTo: null,
  certificateTypeId: "",
  organizationId: "",
  authorName: "",
  authorIdCard: "",
  authorDob: null,
  authorEmail: "",
  authorImage: "",
  authorCountryCode: COUNTRIES.VIETNAM,
  grantLevel: 0,
};

export const CreateCertificate = () => {
  const t = useTranslations();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    setError,
    setValue,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<CreateCertificateFormValues>({
    defaultValues: DEFAULT_VALUES,
  });

  const watchValidFrom = watch("validFrom");
  const watchValidTo = watch("validTo");
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const watchAuthorImage = watch("authorImage");
  const formRef = useRef<HTMLFormElement | null>(null);
  const { currentOrganization } = stores.organization();
  const { mutateAsync: uploadAuthorImage, isPending: isUploadingAuthorImage } =
    useUploadAuthorImage();

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

  const countryOptions = useMemo(
    () =>
      COUNTRY_OPTIONS.map((option) => ({
        value: option.value,
        label: t(option.label),
      })),
    [t]
  );

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

  const isProcessing = isSubmitting || isCreating || isUploadingAuthorImage;

  const handleSubmitFromHeader = () => {
    if (isProcessing) return;
    formRef.current?.requestSubmit();
  };

  useEffect(() => {
    if (currentOrganization?.id) {
      setValue("organizationId", currentOrganization.id, {
        shouldDirty: true,
      });
    }
  }, [currentOrganization?.id, setValue]);

  const onSubmit: SubmitHandler<CreateCertificateFormValues> = (values) => {
    if (!currentOrganization?.id) {
      notifications.show({
        title: "No organization selected",
        message: "Please choose an organization before creating a certificate.",
        color: "red",
      });
      return;
    }

    if (!values.validFrom || !values.validTo) {
      notifications.show({
        title: "Invalid validity period",
        message: "Please select both start and end dates.",
        color: "red",
      });
      return;
    }

    if (!values.authorDob) {
      notifications.show({
        title: "Missing author information",
        message: "Author date of birth is required.",
        color: "red",
      });
      return;
    }

    if (!values.authorImage?.trim()) {
      setError("authorImage", {
        type: "manual",
        message: "Please upload a 3x4 portrait.",
      });
      notifications.show({
        title: "Missing author image",
        message: "Please upload the author's 3x4 portrait photo.",
        color: "red",
      });
      return;
    }

    if (values.validFrom && values.validTo) {
      const start = values.validFrom.getTime();
      const end = values.validTo.getTime();
      if (end < start) {
        notifications.show({
          title: "Invalid validity period",
          message: "End date must be after start date.",
          color: "red",
        });
        return;
      }
    }

    const certificateType = certificateTypeOptions.find(
      (item) => item.value === values.certificateTypeId.trim()
    );

    const additionalInformation = {
      [CERTIFICATE_ADDITIONAL_FIELD.ADDRESS]:
        values[CERTIFICATE_ADDITIONAL_FIELD.ADDRESS]?.trim(),
      [CERTIFICATE_ADDITIONAL_FIELD.SIGNER]:
        values[CERTIFICATE_ADDITIONAL_FIELD.SIGNER]?.trim(),
      [CERTIFICATE_ADDITIONAL_FIELD.SERIAL_NUMBER]:
        values[CERTIFICATE_ADDITIONAL_FIELD.SERIAL_NUMBER]?.trim(),
      [CERTIFICATE_ADDITIONAL_FIELD.REG_NO]:
        values[CERTIFICATE_ADDITIONAL_FIELD.REG_NO]?.trim(),
      [CERTIFICATE_ADDITIONAL_FIELD.CERTIFICATE_TYPE]: certificateType?.code,
    };

    const payload: CreateCertificateRequestType = {
      validFrom: values.validFrom.toISOString(),
      validTo: values.validTo.toISOString(),
      certificateTypeId: values.certificateTypeId.trim(),
      organizationId: currentOrganization.id,
      authorProfile: {
        authorName: values.authorName.trim(),
        authorIdCard: values.authorIdCard.trim(),
        authorDob: values.authorDob.toISOString(),
        authorEmail: values.authorEmail.trim(),
        authorImage: values.authorImage.trim(),
        authorDocuments: [],
        authorCountryCode: values.authorCountryCode,
        grantLevel: Number(values.grantLevel ?? 0),
        additionalInfo: JSON.stringify(additionalInformation),
        domain: values.domain?.trim(),
      },
    };

    createCertificate(payload);
  };

  const handleTriggerImageUpload = () => {
    imageInputRef.current?.click();
  };

  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const resetInput = () => {
      event.target.value = "";
    };

    if (!file.type.startsWith("image/")) {
      notifications.show({
        title: "Invalid file",
        message: "Please upload an image file.",
        color: "red",
      });
      setError("authorImage", {
        type: "manual",
        message: "Please upload a valid image file.",
      });
      resetInput();
      return;
    }

    try {
      const { accessUrl } = await uploadAuthorImage({ file });

      setValue("authorImage", accessUrl, {
        shouldDirty: true,
        shouldValidate: true,
      });
      clearErrors("authorImage");
    } catch (error) {
      let message = "Unable to upload author image.";
      if (isAxiosError(error) && error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error instanceof Error && error.message) {
        message = error.message;
      }
      console.error("uploadAuthorImage error", error);
      notifications.show({
        title: "Upload failed",
        message,
        color: "red",
      });
      setError("authorImage", {
        type: "manual",
        message,
      });
    } finally {
      resetInput();
    }
  };

  const handleRemoveImage = () => {
    setValue("authorImage", "", {
      shouldDirty: true,
      shouldValidate: true,
    });
    clearErrors("authorImage");
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  };

  const handleBack = () => {
    router.push(PAGE_URLS.ORGANIZATIONS_CERTIFICATES);
  };

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
          className="flex flex-col gap-6"
        >
          <Grid gutter="xl" align="stretch">
            <Grid.Col span={{ base: 12, lg: 7 }}>
              <Paper
                withBorder
                radius="lg"
                shadow="sm"
                className="p-6 bg-white/80 dark:bg-slate-950/80 h-full"
              >
                <Stack gap="lg">
                  <Stack gap="xs">
                    <Text className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      Author profile
                    </Text>
                    <Text className="text-sm text-slate-500 dark:text-slate-400">
                      Provide the author details for this certificate.
                    </Text>
                  </Stack>

                  <Grid gutter="lg">
                    <Grid.Col span={{ base: 12, md: 7 }}>
                      <Stack gap="md">
                        <FormInput
                          name="authorName"
                          name_label="Author name"
                          name_placeholder="Enter author name"
                          register={register as any}
                          errors={errors}
                          isTranslate={false}
                          rules={{
                            required: t("required_field"),
                            validate: (value: string) =>
                              value.trim().length > 0 || t("required_field"),
                          }}
                        />
                        <FormInput
                          name="authorIdCard"
                          name_label="Author ID card"
                          name_placeholder="Enter author ID number"
                          register={register as any}
                          errors={errors}
                          isTranslate={false}
                          rules={{
                            required: t("required_field"),
                            validate: (value: string) =>
                              value.trim().length > 0 || t("required_field"),
                          }}
                        />
                        <FormDatePicker
                          name="authorDob"
                          name_label="Author date of birth"
                          name_placeholder="Select date of birth"
                          errors={errors}
                          control={control as any}
                          isTranslate={false}
                          maxDate={new Date()}
                          rules={{
                            required: t("required_field"),
                          }}
                        />
                        <FormInput
                          name="authorEmail"
                          name_label="Author email"
                          name_placeholder="Enter author email"
                          type="email"
                          register={register as any}
                          errors={errors}
                          isTranslate={false}
                          rules={{
                            required: t("required_field"),
                            pattern: {
                              value:
                                /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/i,
                              message: "Please enter a valid email address.",
                            },
                          }}
                        />
                        <FormSelect
                          name="authorCountryCode"
                          name_label="Author country"
                          name_placeholder="Select author country"
                          control={control as any}
                          errors={errors}
                          data={countryOptions}
                          isTranslate={false}
                          allowDeselect={false}
                          defaultValue={DEFAULT_VALUES.authorCountryCode}
                          rules={{
                            required: t("required_field"),
                          }}
                        />
                        <FormInput
                          name="grantLevel"
                          name_label="Grant level"
                          name_placeholder="Enter grant level (0 - 4)"
                          type="number"
                          min={0}
                          max={4}
                          step={1}
                          register={register as any}
                          errors={errors}
                          isTranslate={false}
                          rules={{
                            required: t("required_field"),
                            valueAsNumber: true,
                            min: {
                              value: 0,
                              message: "Grant level must be at least 0.",
                            },
                            max: {
                              value: 4,
                              message: "Grant level cannot be greater than 4.",
                            },
                          }}
                        />
                      </Stack>
                    </Grid.Col>

                    <Grid.Col span={{ base: 12, md: 5 }}>
                      <Stack gap="md">
                        <div className="rounded-lg border border-dashed border-slate-300 bg-slate-100/60 p-4 text-center dark:border-slate-700 dark:bg-slate-900/60">
                          <input
                            type="hidden"
                            {...(register("authorImage") as any)}
                          />
                          <div
                            className="mx-auto mb-3 h-28 w-24 rounded-md border border-slate-300 bg-white shadow-inner dark:border-slate-600 dark:bg-slate-800"
                            style={
                              watchAuthorImage?.trim()
                                ? {
                                    backgroundImage: `url(${watchAuthorImage})`,
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                  }
                                : undefined
                            }
                          />
                          <Text className="text-sm font-medium text-slate-700 dark:text-slate-200">
                            Upload 3x4 portrait
                          </Text>
                          <Text className="text-xs text-slate-500 dark:text-slate-400">
                            Choose a portrait photo (ratio 3x4). We will attach
                            it to the certificate.
                          </Text>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            ref={imageInputRef}
                            onChange={handleImageChange}
                          />
                          <Group justify="center" gap="sm" className="mt-4">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="px-4"
                              onClick={handleTriggerImageUpload}
                              disabled={isUploadingAuthorImage}
                            >
                              {isUploadingAuthorImage
                                ? "Uploading..."
                                : "Choose image"}
                            </Button>
                            {watchAuthorImage?.trim() && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="text-rose-500 hover:text-rose-400"
                                onClick={handleRemoveImage}
                              >
                                Remove
                              </Button>
                            )}
                          </Group>
                          {errors?.authorImage?.message && (
                            <Text className="mt-2 text-xs text-rose-500">
                              {String(errors.authorImage?.message)}
                            </Text>
                          )}
                        </div>
                      </Stack>
                    </Grid.Col>
                  </Grid>
                </Stack>
              </Paper>
            </Grid.Col>

            <Grid.Col span={{ base: 12, lg: 5 }}>
              <Paper
                withBorder
                radius="lg"
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

                    <Grid.Col span={12}>
                      <FormInput
                        name="domain"
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
                  </Grid>
                </Stack>
              </Paper>
              <Paper
                withBorder
                radius="lg"
                shadow="sm"
                className="p-6 bg-white/80 dark:bg-slate-950/80 mt-6"
              >
                <Stack gap="lg">
                  <Stack gap="xs">
                    <Text className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      Additions information
                    </Text>
                    <Text className="text-sm text-slate-500 dark:text-slate-400">
                      Fill in the basic information for the new certificate.
                    </Text>
                  </Stack>

                  <Grid gutter="md">
                    <Grid.Col span={{ base: 12, sm: 6 }}>
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
                    <Grid.Col span={{ base: 12, sm: 6 }}>
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
                    <Grid.Col span={{ base: 12, sm: 6 }}>
                      <FormInput
                        name={CERTIFICATE_ADDITIONAL_FIELD.SERIAL_NUMBER}
                        name_label={t("serial_number_label")}
                        name_placeholder={t("serial_number_placeholder")}
                        register={register as any}
                        errors={errors}
                        isTranslate={false}
                        rules={{
                          required: t("required_field"),
                        }}
                      />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, sm: 6 }}>
                      <FormInput
                        name={CERTIFICATE_ADDITIONAL_FIELD.REG_NO}
                        name_label={t("reg_no_label")}
                        name_placeholder={t("reg_no_placeholder")}
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
          </Grid>
        </form>
      </PageContentWrapper>
    </Box>
  );
};
