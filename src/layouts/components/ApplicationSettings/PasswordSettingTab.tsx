"use client";

import { FormPassword } from "@/components";
import { useChangePassword } from "@/mutations";
import { BaseErrorType, ChangePasswordRequestType } from "@/types";
import { Button } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { isAxiosError } from "axios";
import { useMemo } from "react";
import { useTranslations } from "next-intl";
import {
  TbCheck,
  TbChevronLeft,
  TbShieldLock,
  TbRefresh,
} from "react-icons/tb";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

type PasswordSettingTab = {
  onBack: () => void;
};

export const PasswordSettingTab = ({ onBack }: PasswordSettingTab) => {
  const t = useTranslations();
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const requirements = useMemo(
    () => [
      { id: "length", text: t("password_guideline_length") },
      { id: "mix", text: t("password_guideline_mix") },
      { id: "rotation", text: t("password_guideline_rotation") },
    ],
    [t]
  );

  const { mutate: changePassword, isPending } = useChangePassword({
    onSuccess: () => {
      notifications.show({
        title: t("password_change_success"),
        message: t("password_change_success_desc"),
        color: "green",
      });
      reset();
    },
    onError: (error) => {
      if (isAxiosError<BaseErrorType>(error)) {
        const code = error.response?.data?.code || "common_error_message";
        notifications.show({
          title: t("common_error_message"),
          message: t(code),
          color: "red",
        });
      }
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (values) => {
    const payload: ChangePasswordRequestType = {
      oldPassword: values.oldPassword,
      newPassword: values.newPassword,
    };
    changePassword(payload);
  };

  const newPasswordValue = watch("newPassword");

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3  p-1.5 text-slate-600 shadow-sm  dark:bg-slate-900/70 dark:text-slate-200">
        <button
          type="button"
          onClick={onBack}
          aria-label={t("not_found_back_cta")}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:-translate-x-0.5 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
        >
          <TbChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex-1 text-center">
          <p className="text-base font-semibold text-slate-900 dark:text-white">
            {t("password_setting")}
          </p>
        </div>
      </div>
      <div className="space-y-4 px-4">
        <div className="relative overflow-hidden rounded-md bg-gradient-to-r from-indigo-500 via-purple-500 to-slate-900 p-4 text-white shadow-lg">
          <span className="absolute -right-8 top-3 h-20 w-20 rounded-full bg-white/20 blur-3xl" />
          <div className="relative flex items-start gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-md bg-white/20 text-white shadow-inner">
              <TbShieldLock className="h-6 w-6" />
            </span>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.4em] text-white/70">
                {t("change_password")}
              </p>
              <p className="mt-1 text-sm text-white/80">
                {t("change_password_description")}
              </p>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="px-4 py-5 border rounded-md"
        >
          <div className="flex flex-col gap-3">
            <FormPassword
              register={register}
              errors={errors}
              name="oldPassword"
              name_label="old_password"
              name_placeholder="old_password"
              withAsterisk
              size="md"
              radius="md"
              isTranslate
              rules={{
                required: "required_field",
              }}
            />
            <FormPassword
              register={register}
              errors={errors}
              name="newPassword"
              name_label="new_password"
              name_placeholder="new_password"
              withAsterisk
              size="md"
              radius="md"
              isTranslate
              rules={{
                required: "required_field",
                minLength: {
                  value: 8,
                  message: "password_guideline_length",
                },
              }}
            />
            <FormPassword
              register={register}
              errors={errors}
              name="confirmPassword"
              name_label="confirm_new_password"
              name_placeholder="confirm_new_password"
              withAsterisk
              size="md"
              radius="md"
              isTranslate
              rules={{
                required: "required_field",
                validate: (value) =>
                  value === newPasswordValue || "password_mismatch",
              }}
            />
            <Button
              type="submit"
              size="md"
              radius="md"
              loading={isSubmitting || isPending}
              color="indigo"
              className="mt-2"
            >
              {t("password_change_button")}
            </Button>
          </div>
        </form>

        <div className="rounded-md border border-slate-200/80 bg-slate-50/90 px-4 py-4 dark:border-slate-800 dark:bg-slate-800/40">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300">
            {t("password_setting")}
          </p>
          <ul className="mt-3 space-y-3">
            {requirements.map((item) => (
              <li
                key={item.id}
                className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-200"
              >
                <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300">
                  <TbCheck className="h-3.5 w-3.5" />
                </span>
                {item.text}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
