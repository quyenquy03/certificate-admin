"use client";

import { FormDatePicker, FormInput, Image } from "@/components";
import { BaseModalProps, Modal } from "@/components/modals/bases";
import { IMAGES } from "@/constants";
import { useAddOrganizationMember } from "@/mutations";
import {
  AddOrganizationMemberRequestType,
  BaseErrorType,
} from "@/types";
import { Box, Flex, Grid, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { isAxiosError } from "axios";
import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";
import { FieldValues, useForm } from "react-hook-form";

const DEFAULT_FORM_VALUES = {
  email: "",
  firstName: "",
  lastName: "",
  phone: "",
  walletAddress: "",
  dob: null as Date | null,
};

type OrganizationMemberFormModalProps = {
  organizationId?: string | null;
  organizationName?: string;
  onSuccess?: () => void;
} & BaseModalProps;

export const OrganizationMemberFormModal = ({
  organizationId,
  organizationName,
  onClose,
  onSuccess,
  opened = false,
  ...args
}: OrganizationMemberFormModalProps) => {
  const t = useTranslations();
  const formRef = useRef<HTMLFormElement | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues: { ...DEFAULT_FORM_VALUES },
  });

  useEffect(() => {
    if (!opened) return;
    reset({ ...DEFAULT_FORM_VALUES });
  }, [opened, reset]);

  const handleCloseModal = () => {
    onClose();
    reset({ ...DEFAULT_FORM_VALUES });
  };

  const { mutate: addMember, isPending } = useAddOrganizationMember({
    onSuccess: () => {
      notifications.show({
        title: t("add_member_success_title"),
        message: t("add_member_success_desc"),
        color: "green",
      });
      handleCloseModal();
      onSuccess?.();
    },
    onError: (error) => {
      if (isAxiosError<BaseErrorType>(error)) {
        const code = error.response?.data?.code;
        notifications.show({
          title: t("add_member_fail"),
          message: t(code || "common_error_message"),
          color: "red",
        });
      }
    },
  });

  const onSubmit = (data: FieldValues) => {
    if (!organizationId) {
      notifications.show({
        title: t("add_member_fail"),
        message: t("organization_not_found"),
        color: "red",
      });
      return;
    }

    const payload: AddOrganizationMemberRequestType = {
      organizationId,
      email: (data.email ?? "").trim(),
      firstName: (data.firstName ?? "").trim(),
      lastName: (data.lastName ?? "").trim(),
      walletAddress: (data.walletAddress ?? "").trim(),
      phone: (data.phone ?? "").trim(),
      dob:
        data.dob instanceof Date
          ? data.dob.toISOString()
          : (data.dob as string),
    };

    addMember(payload);
  };

  const isProcessing = isSubmitting || isPending;

  const handleSubmitForm = () => {
    if (!formRef.current || isProcessing) return;
    formRef.current.requestSubmit();
  };

  return (
    <Modal
      footerProps={{
        showFooter: true,
      }}
      size="md"
      header={t("add_member")}
      onConfirm={handleSubmitForm}
      onClose={handleCloseModal}
      isLoading={isProcessing}
      {...args}
      opened={opened}
    >
      <form ref={formRef} onSubmit={handleSubmit(onSubmit)}>
        <Flex
          align="center"
          justify="space-between"
          className="mb-4 rounded-md bg-slate-50 px-3 py-2 text-xs text-slate-700 dark:bg-slate-800/60 dark:text-slate-200"
        >
          <Text className="font-semibold">
            {t("adding_member_to", {
              name: organizationName || t("not_updated"),
            })}
          </Text>
        </Flex>

        <Flex align="center" justify="center" className="mb-3">
          <Box className="relative rounded-full border-2 border-gray-200 p-1 dark:border-gray-700">
            <Image
              src={IMAGES.default.avatar}
              alt="avatar"
              className="h-full w-full rounded-full"
              wrapperClassName="h-20 w-20 rounded-full"
            />
          </Box>
        </Flex>

        <Grid
          columns={2}
          gutter="md"
          classNames={{
            inner: "m-0 w-full",
          }}
        >
          <Grid.Col span={1}>
            <FormInput
              name="firstName"
              name_label={t("first_name")}
              name_placeholder={t("first_name_placeholder")}
              register={register as any}
              errors={errors}
              rules={{
                required: t("required_field"),
                validate: (value) =>
                  value.trim().length > 0 || t("invalid_field"),
              }}
            />
          </Grid.Col>

          <Grid.Col span={1}>
            <FormInput
              name="lastName"
              name_label={t("last_name")}
              name_placeholder={t("last_name_placeholder")}
              register={register as any}
              errors={errors}
              rules={{
                required: t("required_field"),
                validate: (value) =>
                  value.trim().length > 0 || t("invalid_field"),
              }}
            />
          </Grid.Col>

          <Grid.Col span={1}>
            <FormInput
              name="email"
              name_label={t("email")}
              name_placeholder={t("email_placeholder")}
              register={register as any}
              errors={errors}
              rules={{
                required: t("required_field"),
                validate: (value) =>
                  value.trim().length > 0 || t("invalid_field"),
              }}
            />
          </Grid.Col>

          <Grid.Col span={1}>
            <FormInput
              name="walletAddress"
              name_label={t("wallet_address")}
              name_placeholder={t("wallet_address")}
              register={register as any}
              errors={errors}
              rules={{
                required: t("required_field"),
                validate: (value) =>
                  value.trim().length > 0 || t("invalid_field"),
              }}
            />
          </Grid.Col>

          <Grid.Col span={1}>
            <FormInput
              name="phone"
              name_label={t("phone")}
              name_placeholder={t("phone_placeholder")}
              register={register as any}
              errors={errors}
            />
          </Grid.Col>

          <Grid.Col span={2}>
            <FormDatePicker
              name="dob"
              name_label="dob"
              name_placeholder="dob_placeholder"
              errors={errors}
              control={control as any}
              rules={{
                required: t("required_field"),
              }}
              type="default"
            />
          </Grid.Col>
        </Grid>
      </form>
    </Modal>
  );
};
