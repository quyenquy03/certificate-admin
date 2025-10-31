"use client";

import { FormDatePicker, FormInput, FormSelect, Image } from "@/components";
import { BaseModalProps, Modal } from "@/components/modals/bases";
import { IMAGES, USER_ROLE_OPTIONS } from "@/constants";
import { USER_ROLES } from "@/enums";
import { useCreateUser, useUpdateUser } from "@/mutations";
import {
  BaseErrorType,
  UpdateUserRequestType,
  UserRequestType,
  UserResponseType,
} from "@/types";
import { Box, Flex, Grid } from "@mantine/core";
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
  dob: null as Date | null,
  role: USER_ROLES.ORGANIZATION,
  address: "",
  avatar: "",
};

type UserFormModal = {
  selectedUser: UserResponseType | null;
  onSuccess?: () => void;
} & BaseModalProps;

export const UserFormModal = ({
  onClose,
  selectedUser,
  onSuccess,
  opened = false,
  ...args
}: UserFormModal) => {
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

    if (selectedUser) {
      reset({
        email: selectedUser.email ?? "",
        firstName: selectedUser.firstName ?? "",
        lastName: selectedUser.lastName ?? "",
        phone: selectedUser.phone ?? "",
        dob: selectedUser.dob ? new Date(selectedUser.dob) : null,
        role: selectedUser.role ?? USER_ROLES.ORGANIZATION,
        address: selectedUser.address ?? "",
      });
      return;
    }

    reset({ ...DEFAULT_FORM_VALUES });
  }, [opened, selectedUser, reset]);

  const handleCloseModal = () => {
    onClose();
    reset({ ...DEFAULT_FORM_VALUES });
  };

  const { mutate: createUser, isPending: isCreatingUser } = useCreateUser({
    onSuccess: () => {
      notifications.show({
        title: t("create_user_success_title"),
        message: t("create_user_success_desc"),
        color: "green",
      });
      handleCloseModal();
      onSuccess?.();
    },
    onError: (error) => {
      if (isAxiosError<BaseErrorType>(error)) {
        const code = error.response?.data?.code;
        notifications.show({
          title: t("create_user_fail"),
          message: t(code || "common_error_message"),
          color: "red",
        });
      }
    },
  });

  const { mutate: updateUser, isPending: isUpdatingUser } = useUpdateUser({
    onSuccess: () => {
      notifications.show({
        title: t("update_user_success_title"),
        message: t("update_user_success_desc"),
        color: "green",
      });
      handleCloseModal();
      onSuccess?.();
    },
    onError: (error) => {
      if (isAxiosError<BaseErrorType>(error)) {
        const code = error.response?.data?.code;
        notifications.show({
          title: t("update_user_fail"),
          message: t(code || "common_error_message"),
          color: "red",
        });
      }
    },
  });

  const onSubmit = (data: FieldValues) => {
    const email = (data.email ?? "").trim();
    const firstName = (data.firstName ?? "").trim();
    const lastName = (data.lastName ?? "").trim();
    const phone = (data.phone ?? "").trim();
    const address = (data.address ?? "").trim();
    const role = data.role ?? USER_ROLES.ORGANIZATION;
    const dob = data.dob;

    if (selectedUser) {
      const updatePayload: UpdateUserRequestType = {
        ...selectedUser,
        email,
        firstName,
        lastName,
        phone,
        dob: dob as string,
        role,
        address,
        isLooked: selectedUser.isLocked,
      };
      if (!updatePayload.avatar) updatePayload.avatar = undefined;

      updateUser(updatePayload);
      return;
    }

    const createPayload: UserRequestType = {
      email,
      firstName,
      lastName,
      phone: phone || undefined,
      dob: dob as string,
      role,
      address: address || undefined,
    };

    createUser(createPayload);
  };

  const isProcessing = isSubmitting || isCreatingUser || isUpdatingUser;

  const handleSubmitForm = () => {
    if (!formRef.current || isProcessing) return;
    formRef.current.requestSubmit();
  };

  return (
    <Modal
      footerProps={{
        showFooter: true,
      }}
      size={"md"}
      header={
        selectedUser ? t("update_user_information") : t("create_new_user")
      }
      onConfirm={handleSubmitForm}
      onClose={handleCloseModal}
      isLoading={isProcessing}
      {...args}
      opened={opened}
    >
      <form ref={formRef} onSubmit={handleSubmit(onSubmit)}>
        <Flex align="center" justify="center" className="mb-2">
          <Box className="relative border-2 border-gray-300 rounded-full p-1">
            <Image
              src={IMAGES.default.avatar}
              alt="avatar"
              className="w-full h-full rounded-full"
              wrapperClassName="w-24 h-24 rounded-full"
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
            <FormSelect
              name="role"
              name_label="role"
              name_placeholder="role_placeholder"
              control={control as any}
              errors={errors}
              data={USER_ROLE_OPTIONS.map((item) => ({
                ...item,
                label: t(item.label),
              }))}
              defaultChecked={true}
              allowDeselect={false}
              defaultValue={USER_ROLE_OPTIONS[0].value}
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
              error={errors.phone?.message}
              errors={errors}
            />
          </Grid.Col>

          <Grid.Col span={1}>
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

          <Grid.Col span={2}>
            <FormInput
              name="address"
              name_label={t("address")}
              name_placeholder={t("address_placeholder")}
              register={register as any}
              errors={errors}
            />
          </Grid.Col>
        </Grid>
      </form>
    </Modal>
  );
};
