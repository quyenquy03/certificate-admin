"use client";

import { FormInput, FormPassword } from "@/components";
import { useLoginCredential } from "@/mutations";
import { BaseErrorType, LoginRequestType } from "@/types";
import { Box, Button, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { isAxiosError } from "axios";
import { useTranslations } from "next-intl";
import React from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import Cookies from "js-cookie";
import { ACCESS_TOKEN_KEY, PAGE_URLS } from "@/constants";
import { useRouter } from "next/navigation";
export const Login = () => {
  const t = useTranslations();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  const router = useRouter();

  const { mutate: loginCredential, isPending } = useLoginCredential({
    onSuccess: (data) => {
      const token = data.data.accessToken;
      const expiresAt = data.data.expiresAt;

      Cookies.set(ACCESS_TOKEN_KEY, token, {
        expires: new Date(expiresAt),
        secure: true,
        sameSite: "strict",
      });

      router.push(PAGE_URLS.ADMIN_DASHBOARD);
    },
    onError: (error) => {
      if (isAxiosError<BaseErrorType>(error)) {
        const code = error.response?.data?.code;
        notifications.show({
          title: t("login_error"),
          message: t(code || "common_error_message"),
          color: "red",
        });
      }
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (values) => {
    const payload: LoginRequestType = {
      email: values.email,
      password: values.password,
      rememberMe: values.rememberMe,
    };
    loginCredential(payload);
  };

  return (
    <>
      <Box className="relative w-full max-w-lg">
        <Text
          fw={700}
          size="xl"
          ta={"center"}
          className="text-color-light dark:text-color-dark"
        >
          {t("login")}
        </Text>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 mt-4"
        >
          <FormInput
            register={register}
            errors={errors}
            name="email"
            name_label="login_email_label"
            name_placeholder="login_email_placeholder"
            type="email"
            withAsterisk
            radius="md"
            size="md"
            rules={{
              required: "required_field",
            }}
            isTranslate
          />

          <FormPassword
            register={register}
            errors={errors}
            name="password"
            name_label="login_password_label"
            name_placeholder="login_password_placeholder"
            withAsterisk
            radius="md"
            size="md"
            rules={{
              required: "required_field",
            }}
            isTranslate
          />

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <label className="flex items-center gap-2 text-xs font-medium text-slate-600 sm:text-sm">
              <input
                type="checkbox"
                {...register("rememberMe")}
                className="size-4 rounded border border-slate-300 text-indigo-600 accent-indigo-600"
              />
              <span>{t("login_remember")}</span>
            </label>
            <button
              type="button"
              className="self-start text-xs font-semibold text-indigo-600 transition hover:text-indigo-500 sm:text-sm"
            >
              {t("login_forgot")}
            </button>
          </div>

          <Button
            type="submit"
            size="md"
            radius="md"
            loading={isSubmitting || isPending}
            color="indigo"
            fullWidth
          >
            {t("login_button")}
          </Button>

          <p className="text-center text-xs text-slate-500 sm:text-sm">
            {t("login_helper")}
          </p>
        </form>

        <div className="mt-6 text-center text-sm text-slate-400">
          <span>{t("login_footer_prompt")}</span>{" "}
          <button className="font-semibold text-indigo-400 transition hover:text-indigo-300">
            {t("login_footer_cta")}
          </button>
        </div>
      </Box>
    </>
  );
};
