"use client";

import { FormInput, FormTextArea } from "@/components";
import { BaseModalProps, Modal } from "@/components/modals/bases";
import { FORM_MODES } from "@/enums";
import {
  useCreateCertificateType,
  useUpdateCertificateType,
} from "@/mutations";
import {
  BaseErrorType,
  CertificateCategoryRequestType,
  CertificateCategoryType,
} from "@/types";
import { notifications } from "@mantine/notifications";
import { isAxiosError } from "axios";
import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";
import { FieldValues, useForm } from "react-hook-form";

const DEFAULT_FORM_VALUES = {
  name: "",
  code: "",
  description: "",
};

type CertificateTypeFormModalProps = {
  onSuccess?: () => void;
  mode?: FORM_MODES;
  certificateType?: CertificateCategoryType | null;
} & BaseModalProps;

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
  } = useForm({
    defaultValues: DEFAULT_FORM_VALUES,
  });

  const handleCloseModal = () => {
    onClose?.();
    reset(DEFAULT_FORM_VALUES);
  };

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

  const onSubmit = (values: FieldValues) => {
    const trimmedName = (values.name ?? "").trim();
    const trimmedCode = (values.code ?? "").trim();
    const trimmedDescription = (values.description ?? "").trim();

    if (!trimmedName || !trimmedCode) {
      return;
    }

    const payload: CertificateCategoryRequestType = {
      name: trimmedName,
      code: trimmedCode,
      description: trimmedDescription || undefined,
    };

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
      reset({
        name: certificateType.name ?? "",
        code: certificateType.code ?? "",
        description: certificateType.description ?? "",
      });
      return;
    }

    if (!opened) {
      reset(DEFAULT_FORM_VALUES);
    }
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
      </form>
    </Modal>
  );
};
