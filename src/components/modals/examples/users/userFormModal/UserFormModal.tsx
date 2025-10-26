"use client";

import { FormDatePicker, FormInput, FormSelect, Image } from "@/components";
import { BaseModalProps, Modal } from "@/components/modals/bases";
import { IMAGES, USER_ROLE_OPTIONS } from "@/constants";
import { USER_ROLES } from "@/enums";
import { useCreateUser } from "@/mutations";
import { BaseErrorType, UserRequestType, UserResponseType } from "@/types";
import { Box, Flex, Grid } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { isAxiosError } from "axios";
import { useTranslations } from "next-intl";
import { useRef } from "react";
import { FieldValues, useForm } from "react-hook-form";

type UserFormModal = {
  selectedUser: UserResponseType | null;
} & BaseModalProps;

export const UserFormModal = ({ onClose, ...args }: UserFormModal) => {
  const t = useTranslations();
  const formRef = useRef<HTMLFormElement | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      phone: "",
      dob: null,
      role: USER_ROLES.ORGANIZATION,
      address: "",
    },
  });

  const { mutate: createUser, isPending: isCreatingUser } = useCreateUser({
    onSuccess: () => {
      notifications.show({
        title: t("create_user_success_title"),
        message: t("create_user_success_desc"),
        color: "green",
      });
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

  const onSubmit = (data: FieldValues) => {
    const submitData: UserRequestType = {
      avatar: data.avatar,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      dob: data.dob,
      role: data.role,
      address: data.address,
    };
    createUser(submitData);
  };

  const handleSubmitForm = () => {
    if (!formRef.current) return;
    formRef.current?.requestSubmit();
  };

  const handleCloseModal = () => {
    onClose();
    reset();
  };

  return (
    <Modal
      footerProps={{
        showFooter: true,
      }}
      size={"md"}
      header={t("create_new_user")}
      onConfirm={handleSubmitForm}
      onClose={handleCloseModal}
      {...args}
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
