"use client";

import {
  FormDatePicker,
  FormInput,
  FormSelect,
  Modal,
  type BaseModalProps,
} from "@/components";
import { COUNTRY_OPTIONS } from "@/constants";
import { CERTIFICATE_ADDITIONAL_FIELD, COUNTRIES, FORM_MODES } from "@/enums";
import { CertificateItemFormType } from "@/types";
import { Grid, Stack } from "@mantine/core";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useRef } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

type CreateEditCertificateModalProps = {
  certificateItem: CertificateItemFormType | null;
  onSaveCertificateItem: (
    certificate: CertificateItemFormType,
    action: FORM_MODES
  ) => void;
  onCheckExistedAuthorId: (authorId: string, action: FORM_MODES) => boolean;
} & Omit<BaseModalProps, "children">;

const CERTIFICATE_ITEM_DEFAULT: CertificateItemFormType = {
  authorName: "",
  authorIdCard: "",
  authorDob: null,
  authorEmail: "",
  authorCountryCode: COUNTRIES.VIETNAM,
  grantLevel: 0,
  domain: "",
};

export const CreateEditCertificateModal = ({
  opened,
  onClose,
  certificateItem,
  onCheckExistedAuthorId,
  onSaveCertificateItem,
  ...props
}: CreateEditCertificateModalProps) => {
  const t = useTranslations();
  const formRef = useRef<HTMLFormElement | null>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    clearErrors,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CertificateItemFormType>({
    defaultValues: CERTIFICATE_ITEM_DEFAULT,
  });

  const countryOptions = useMemo(
    () =>
      COUNTRY_OPTIONS.map((option) => ({
        value: option.value,
        label: t(option.label),
      })),
    [t]
  );

  const onSubmit: SubmitHandler<CertificateItemFormType> = (values) => {
    const actionMode = certificateItem ? FORM_MODES.UPDATE : FORM_MODES.CREATE;

    const trimmedAuthorIdCard = values.authorIdCard.trim();
    if (onCheckExistedAuthorId(trimmedAuthorIdCard, actionMode)) {
      setError("authorIdCard", {
        type: "manual",
        message: t("certificate_author_id_exists"),
      });
      return;
    }

    onSaveCertificateItem(
      {
        ...values,
        authorIdCard: trimmedAuthorIdCard,
        authorName: values.authorName.trim(),
        authorEmail: values.authorEmail.trim(),
        domain: values.domain?.trim() ?? "",
      },
      actionMode
    );
    handleClose();
  };

  const handleConfirmSubmit = () => {
    if (isSubmitting) return;
    formRef.current?.requestSubmit();
  };

  const handleClose = () => {
    clearErrors();
    onClose();
    reset();
  };

  useEffect(() => {
    if (certificateItem) {
      reset(certificateItem);
      return;
    }

    reset(CERTIFICATE_ITEM_DEFAULT);
    clearErrors();
  }, [certificateItem, clearErrors, reset]);

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      header={t("certificate_detail")}
      size="lg"
      contentClassNames={{
        headerBox:
          "px-4 py-2 bg-gradient-to-r from-indigo-500/20 via-indigo-500/10 to-transparent dark:from-indigo-500/25 dark:via-indigo-500/15 dark:to-slate-900/80",
        closeButton: "top-3 right-3",
      }}
      footerProps={{
        showFooter: true,
      }}
      onConfirm={handleConfirmSubmit}
      {...props}
    >
      <form
        ref={formRef}
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <Stack gap="md">
          <FormInput
            name="authorName"
            name_label={t("certificate_author_name_label")}
            name_placeholder={t("certificate_author_name_placeholder")}
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
            name_label={t("certificate_author_id_label")}
            name_placeholder={t("certificate_author_id_placeholder")}
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
            name="authorEmail"
            name_label={t("certificate_author_email_label")}
            name_placeholder={t("certificate_author_email_placeholder")}
            register={register as any}
            errors={errors}
            isTranslate={false}
            rules={{
              required: t("required_field"),
              pattern: {
                value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/i,
                message: t("certificate_author_email_invalid"),
              },
            }}
          />
          <FormInput
            name="domain"
            name_label={t("domain_label")}
            name_placeholder={t("domain_description")}
            register={register as any}
            errors={errors}
            isTranslate={false}
            rules={{
              required: t("required_field"),
              validate: (value: string) =>
                value.trim().length > 0 || t("required_field"),
            }}
          />
          <Grid gutter="md">
            <Grid.Col span={{ base: 12, sm: 4 }}>
              <FormDatePicker
                name="authorDob"
                name_label={t("certificate_author_dob_label")}
                name_placeholder={t("certificate_author_dob_placeholder")}
                errors={errors}
                control={control as any}
                isTranslate={false}
                maxDate={new Date()}
                rules={{
                  required: t("required_field"),
                }}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 4 }}>
              <FormSelect
                name="authorCountryCode"
                name_label={t("certificate_author_country_label")}
                name_placeholder={t("certificate_author_country_placeholder")}
                control={control as any}
                errors={errors}
                data={countryOptions}
                isTranslate={false}
                allowDeselect={false}
                defaultValue={CERTIFICATE_ITEM_DEFAULT.authorCountryCode}
                rules={{
                  required: t("required_field"),
                }}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 4 }}>
              <FormInput
                name="grantLevel"
                name_label={t("certificate_grant_level")}
                name_placeholder={t("certificate_grant_level_placeholder")}
                type="number"
                min={0}
                register={register as any}
                errors={errors}
                isTranslate={false}
                rules={{
                  required: t("required_field"),
                  valueAsNumber: true,
                  min: {
                    value: 0,
                    message: t("certificate_grant_level_min"),
                  },
                }}
              />
            </Grid.Col>
          </Grid>

          <Grid gutter="md">
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <FormInput
                name={CERTIFICATE_ADDITIONAL_FIELD.SERIAL_NUMBER}
                name_label={t("certificate_serial_number_label")}
                name_placeholder={t("certificate_serial_number_placeholder")}
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
                name_label={t("certificate_reg_no_label")}
                name_placeholder={t("certificate_reg_no_placeholder")}
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
      </form>
    </Modal>
  );
};
