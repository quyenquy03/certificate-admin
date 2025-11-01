"use client";

import { FormInput } from "@/components";
import { BaseModalProps, Modal } from "@/components/modals/bases";
import { useCreateCertificateType } from "@/mutations";
import { BaseErrorType, CreateCertificateCategoryType } from "@/types";
import { Textarea } from "@mantine/core";
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
} & BaseModalProps;

export const CertificateTypeFormModal = ({
  opened = false,
  onClose,
  onSuccess,
  ...args
}: CertificateTypeFormModalProps) => {
  const t = useTranslations();
  const formRef = useRef<HTMLFormElement | null>(null);

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

  const onSubmit = (values: FieldValues) => {
    const trimmedName = (values.name ?? "").trim();
    const trimmedCode = (values.code ?? "").trim();
    const trimmedDescription = (values.description ?? "").trim();

    if (!trimmedName || !trimmedCode) {
      return;
    }

    const payload: CreateCertificateCategoryType = {
      name: trimmedName,
      code: trimmedCode,
      description: trimmedDescription || undefined,
    };

    createCertificateType(payload);
  };

  const isProcessing = isSubmitting || isPending;

  const handleSubmitForm = () => {
    if (!formRef.current || isProcessing) return;
    formRef.current.requestSubmit();
  };

  return (
    <Modal
      opened={opened}
      onClose={handleCloseModal}
      onConfirm={handleSubmitForm}
      isLoading={isProcessing}
      header={t("create_certificate_type")}
      footerProps={{
        showFooter: true,
        confirmText: t("add_new"),
      }}
      {...args}
    >
      <form
        ref={formRef}
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <FormInput
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
        <Textarea
          {...(register("description") as any)}
          label={t("certificate_type_description")}
          placeholder={t("certificate_type_description_placeholder")}
          autosize
          minRows={3}
          error={errors.description?.message as string | undefined}
          classNames={{
            label: "text-sm font-medium text-gray-700 dark:text-gray-200",
            input:
              "rounded-md border border-gray-200 focus:border-blue-300 focus:ring-2 focus:ring-blue-100 dark:border-dark-5 dark:bg-dark-6 dark:text-gray-100",
          }}
        />
      </form>
    </Modal>
  );
};
