"use client";

import { FormInput, FormSelect, FormTextArea } from "@/components";
import { BaseModalProps, Modal } from "@/components/modals/bases";
import {
  CERTIFICATE_TEMPLATES,
  CERTIFICATE_TYPE_ADDITIONAL_FIELD,
  FORM_MODES,
} from "@/enums";
import {
  useCreateCertificateType,
  useUpdateCertificateType,
} from "@/mutations";
import {
  BaseErrorType,
  CertificateCategoryAdditionalInfoType,
  CertificateCategoryRequestType,
  CertificateCategoryType,
} from "@/types";
import { notifications } from "@mantine/notifications";
import { isAxiosError } from "axios";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import {
  CERTIFICATE_DURATION_YEAR_OPTIONS,
  CERTIFICATE_TEMPLATES_OPTIONS,
  DEFAULT_CERTIFICATE_DURATION_YEARS,
  DEFAULT_CERTIFICATE_TEMPLATE,
} from "@/constants";

type CertificateTypeFormModalProps = {
  onSuccess?: () => void;
  mode?: FORM_MODES;
  certificateType?: CertificateCategoryType | null;
} & BaseModalProps;

type CertificateCategoryFormType = {
  name: string;
  code: string;
  description?: string;

  [CERTIFICATE_TYPE_ADDITIONAL_FIELD.EN_NAME]?: string;
  [CERTIFICATE_TYPE_ADDITIONAL_FIELD.EXPIRED_YEAR]?: string | number;
  [CERTIFICATE_TYPE_ADDITIONAL_FIELD.CERTIFICATE_TEMPLATE]?:
    | CERTIFICATE_TEMPLATES
    | "";
};

const DEFAULT_FORM_VALUES: CertificateCategoryFormType = {
  name: "",
  code: "",
  description: "",
  [CERTIFICATE_TYPE_ADDITIONAL_FIELD.EN_NAME]: "",
  [CERTIFICATE_TYPE_ADDITIONAL_FIELD.EXPIRED_YEAR]: String(
    DEFAULT_CERTIFICATE_DURATION_YEARS
  ),
  [CERTIFICATE_TYPE_ADDITIONAL_FIELD.CERTIFICATE_TEMPLATE]:
    DEFAULT_CERTIFICATE_TEMPLATE,
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

export const CertificateTypeFormModal = ({
  opened = false,
  onClose,
  onSuccess,
  mode = FORM_MODES.CREATE,
  certificateType = null,
  ...args
}: CertificateTypeFormModalProps) => {
  const t = useTranslations();
  const formRef = useRef<HTMLFormElement | null>(null);
  const isUpdateMode = mode === "update";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    control,
  } = useForm<CertificateCategoryFormType>({
    defaultValues: DEFAULT_FORM_VALUES,
  });

  const handleCloseModal = () => {
    onClose?.();
    reset(DEFAULT_FORM_VALUES);
  };

  const durationOptions = useMemo(
    () =>
      CERTIFICATE_DURATION_YEAR_OPTIONS.map((value) => ({
        value: String(value),
        label: t("certificate_duration_year_label", { value }),
      })),
    [t]
  );

  const templateOptions = useMemo(
    () =>
      CERTIFICATE_TEMPLATES_OPTIONS.map((option) => ({
        ...option,
        label: t(option.label),
      })),
    [t]
  );

  const { mutate: createCertificateType, isPending } = useCreateCertificateType(
    {
      onSuccess: () => {
        notifications.show({
          title: t("create_certificate_type_success_title"),
          message: t("create_certificate_type_success_desc"),
          color: "green",
        });
        handleCloseModal();
        onSuccess?.();
      },
      onError: (error) => {
        if (isAxiosError<BaseErrorType>(error)) {
          const code = error.response?.data?.code;
          notifications.show({
            title: t("create_certificate_type_fail"),
            message: t(code || "common_error_message"),
            color: "red",
          });
          return;
        }

        notifications.show({
          title: t("create_certificate_type_fail"),
          message: t("common_error_message"),
          color: "red",
        });
      },
    }
  );

  const { mutate: updateCertificateType, isPending: isUpdating } =
    useUpdateCertificateType({
      onSuccess: () => {
        notifications.show({
          title: t("update_certificate_type_success_title"),
          message: t("update_certificate_type_success_desc"),
          color: "green",
        });
        handleCloseModal();
        onSuccess?.();
      },
      onError: (error) => {
        if (isAxiosError<BaseErrorType>(error)) {
          const code = error.response?.data?.code;
          notifications.show({
            title: t("update_certificate_type_fail"),
            message: t(code || "common_error_message"),
            color: "red",
          });
          return;
        }

        notifications.show({
          title: t("update_certificate_type_fail"),
          message: t("common_error_message"),
          color: "red",
        });
      },
    });

  const onSubmit = (values: CertificateCategoryFormType) => {
    const trimmedName = (values.name ?? "").trim();
    const trimmedCode = (values.code ?? "").trim();
    const trimmedDescription = (values.description ?? "").trim();
    const englishName = (
      values[CERTIFICATE_TYPE_ADDITIONAL_FIELD.EN_NAME] ?? ""
    ).trim();
    const expiredYear = values[CERTIFICATE_TYPE_ADDITIONAL_FIELD.EXPIRED_YEAR];
    const certificateTemplate = values[
      CERTIFICATE_TYPE_ADDITIONAL_FIELD.CERTIFICATE_TEMPLATE
    ] as CERTIFICATE_TEMPLATES;

    if (!trimmedName || !trimmedCode) {
      return;
    }

    const payload: CertificateCategoryRequestType = {
      name: trimmedName,
      code: trimmedCode,
      description: trimmedDescription || undefined,
    };

    const parsedExistingAdditionalInfo = isUpdateMode
      ? parseCertificateTypeAdditionalInfo(certificateType?.additionalInfo)
      : {};
    const additionalInfo: CertificateCategoryAdditionalInfoType = {
      ...parsedExistingAdditionalInfo,
    };

    if (englishName) {
      additionalInfo[CERTIFICATE_TYPE_ADDITIONAL_FIELD.EN_NAME] = englishName;
    }

    if (
      expiredYear !== undefined &&
      expiredYear !== null &&
      `${expiredYear}`.trim() !== ""
    ) {
      const parsedExpiredYear = Number(expiredYear);
      additionalInfo[CERTIFICATE_TYPE_ADDITIONAL_FIELD.EXPIRED_YEAR] =
        Number.isNaN(parsedExpiredYear) ? expiredYear : parsedExpiredYear;
    }

    if (certificateTemplate) {
      additionalInfo[CERTIFICATE_TYPE_ADDITIONAL_FIELD.CERTIFICATE_TEMPLATE] =
        certificateTemplate;
    }

    if (Object.keys(additionalInfo).length > 0) {
      payload.additionalInfo = JSON.stringify(additionalInfo);
    }

    if (isUpdateMode) {
      if (!certificateType?.id) {
        notifications.show({
          title: t("update_certificate_type_fail"),
          message: t("common_error_message"),
          color: "red",
        });
        return;
      }

      updateCertificateType({
        ...payload,
        id: certificateType.id,
      });
      return;
    }

    createCertificateType(payload);
  };

  const isProcessing = isSubmitting || isPending || isUpdating;

  const handleSubmitForm = () => {
    if (!formRef.current || isProcessing) return;
    formRef.current.requestSubmit();
  };

  useEffect(() => {
    if (opened && isUpdateMode && certificateType) {
      const parsedAdditionalInfo = parseCertificateTypeAdditionalInfo(
        certificateType.additionalInfo
      );
      const viNameFromAdditionalInfo = (
        parsedAdditionalInfo as Record<string, unknown>
      )?.vi_name;
      const expiredYear =
        parsedAdditionalInfo[CERTIFICATE_TYPE_ADDITIONAL_FIELD.EXPIRED_YEAR];
      reset({
        ...DEFAULT_FORM_VALUES,
        name:
          typeof viNameFromAdditionalInfo === "string" &&
          viNameFromAdditionalInfo.trim().length > 0
            ? viNameFromAdditionalInfo
            : certificateType.name ?? "",
        code: certificateType.code ?? "",
        description: certificateType.description ?? "",
        [CERTIFICATE_TYPE_ADDITIONAL_FIELD.EN_NAME]:
          (parsedAdditionalInfo[
            CERTIFICATE_TYPE_ADDITIONAL_FIELD.EN_NAME
          ] as string) ?? "",
        [CERTIFICATE_TYPE_ADDITIONAL_FIELD.EXPIRED_YEAR]:
          expiredYear !== undefined && expiredYear !== null
            ? String(expiredYear)
            : DEFAULT_FORM_VALUES[
                CERTIFICATE_TYPE_ADDITIONAL_FIELD.EXPIRED_YEAR
              ],
        [CERTIFICATE_TYPE_ADDITIONAL_FIELD.CERTIFICATE_TEMPLATE]:
          (parsedAdditionalInfo[
            CERTIFICATE_TYPE_ADDITIONAL_FIELD.CERTIFICATE_TEMPLATE
          ] as CERTIFICATE_TEMPLATES) ??
          DEFAULT_FORM_VALUES[
            CERTIFICATE_TYPE_ADDITIONAL_FIELD.CERTIFICATE_TEMPLATE
          ],
      });
      return;
    }

    reset(DEFAULT_FORM_VALUES);
  }, [opened, certificateType, isUpdateMode, reset]);

  return (
    <Modal
      opened={opened}
      onClose={handleCloseModal}
      onConfirm={handleSubmitForm}
      isLoading={isProcessing}
      header={
        isUpdateMode
          ? t("update_certificate_type")
          : t("create_certificate_type")
      }
      footerProps={{
        showFooter: true,
        confirmText: isUpdateMode ? t("update") : t("add_new"),
      }}
      {...args}
    >
      <form
        ref={formRef}
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-5"
      >
        <FormInput
          autoFocus
          name="name"
          name_label={t("certificate_type_name")}
          name_placeholder={t("certificate_type_name_placeholder")}
          register={register as any}
          errors={errors}
          rules={{
            required: t("required_field"),
            validate: (value) => value.trim().length > 0 || t("required_field"),
          }}
        />
        <FormInput
          name={CERTIFICATE_TYPE_ADDITIONAL_FIELD.EN_NAME}
          name_label={t("certificate_type_name_en")}
          name_placeholder={t("certificate_type_name_en_placeholder")}
          register={register as any}
          errors={errors}
        />
        <FormInput
          name="code"
          name_label={t("certificate_type_code")}
          name_placeholder={t("certificate_type_code_placeholder")}
          register={register as any}
          errors={errors}
          rules={{
            required: t("required_field"),
            validate: (value) => value.trim().length > 0 || t("required_field"),
          }}
        />
        <FormTextArea
          name="description"
          name_label={t("certificate_type_description")}
          name_placeholder={t("certificate_type_description_placeholder")}
          register={register as any}
          errors={errors}
          autosize
          minRows={4}
          maxRows={10}
        />
        <FormSelect
          name={CERTIFICATE_TYPE_ADDITIONAL_FIELD.EXPIRED_YEAR}
          name_label={t("certificate_type_duration_years")}
          name_placeholder={t("certificate_type_duration_years_placeholder")}
          control={control as any}
          errors={errors}
          data={durationOptions}
          isTranslate={false}
          allowDeselect={false}
        />
        <FormSelect
          name={CERTIFICATE_TYPE_ADDITIONAL_FIELD.CERTIFICATE_TEMPLATE}
          name_label={t("certificate_type_template")}
          name_placeholder={t("certificate_type_template_placeholder")}
          control={control as any}
          errors={errors}
          data={templateOptions}
          isTranslate={false}
          allowDeselect={false}
        />
      </form>
    </Modal>
  );
};
