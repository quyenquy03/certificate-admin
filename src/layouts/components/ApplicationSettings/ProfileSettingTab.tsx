"use client";

import { FormDatePicker, FormInput, FormSelect } from "@/components";
import { Image } from "@/components/images";
import { IMAGES } from "@/constants";
import { GENDERS } from "@/enums";
import { useUpdateProfile } from "@/mutations";
import { stores } from "@/stores";
import {
  BaseErrorType,
  UpdateProfileRequestType,
  UserResponseType,
} from "@/types";
import { Button, TextInput } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { isAxiosError } from "axios";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { TbChevronLeft, TbEdit } from "react-icons/tb";

type ProfileSettingTabProps = {
  onBack: () => void;
};

type ProfileUser = UserResponseType & { gender?: GENDERS };

export const ProfileSettingTab = ({ onBack }: ProfileSettingTabProps) => {
  const t = useTranslations();
  const { currentUser, setCurrentUser } = stores.account();

  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<FieldValues>({
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      address: "",
      dob: null,
      gender: String(GENDERS.OTHER),
    },
  });

  const profileName = useMemo(() => {
    if (!currentUser) {
      return t("profile_setting");
    }
    const names = [currentUser.firstName, currentUser.lastName]
      .filter(Boolean)
      .join(" ")
      .trim();
    return names || currentUser.email || currentUser.userName || t("profile_setting");
  }, [currentUser, t]);

  const genderOptions = useMemo(
    () => [
      { value: String(GENDERS.MALE), label: t("male") },
      { value: String(GENDERS.FEMALE), label: t("female") },
      { value: String(GENDERS.OTHER), label: t("other") },
    ],
    [t]
  );

  const syncFormValues = useCallback(
    (user?: ProfileUser | null) => {
      if (!user) {
        reset({
          firstName: "",
          lastName: "",
          phone: "",
          address: "",
          dob: null,
          gender: String(GENDERS.OTHER),
        });
        return;
      }
      reset({
        firstName: user.firstName ?? "",
        lastName: user.lastName ?? "",
        phone: user.phone ?? "",
        address: user.address ?? "",
        dob: user.dob ? dayjs(user.dob).toDate() : null,
        gender: String(user.gender ?? GENDERS.OTHER),
      });
    },
    [reset]
  );

  useEffect(() => {
    syncFormValues(currentUser as ProfileUser | null);
  }, [currentUser, syncFormValues]);

  const { mutate: updateProfile, isPending } = useUpdateProfile({
    onSuccess: (response) => {
      const updatedUser = response.data;
      setCurrentUser(updatedUser);
      syncFormValues(updatedUser as ProfileUser);
      setIsEditing(false);
      notifications.show({
        title: t("profile_update_success"),
        message: t("profile_update_success_desc"),
        color: "green",
      });
    },
    onError: (error) => {
      let message = "common_error_message";
      if (isAxiosError<BaseErrorType>(error)) {
        message = error.response?.data?.code || "common_error_message";
      }
      notifications.show({
        title: t("common_error_message"),
        message: t(message),
        color: "red",
      });
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (values) => {
    if (!currentUser) return;

    const firstName = (values.firstName ?? "").trim();
    const lastName = (values.lastName ?? "").trim();
    const phone = (values.phone ?? "").trim();
    const address = (values.address ?? "").trim();
    const dobValue = values.dob
      ? dayjs(values.dob).toISOString()
      : currentUser.dob;
    const genderValue = Number(values.gender ?? GENDERS.OTHER) as GENDERS;

    const payload: UpdateProfileRequestType = {
      id: currentUser.id,
      firstName,
      lastName,
      phone: phone || undefined,
      address: address || undefined,
      dob: dobValue || "",
      gender: genderValue,
      avatar: currentUser.avatar,
    };

    updateProfile(payload);
  };

  const isProcessing = isSubmitting || isPending;

  const accountDetails = useMemo(
    () => [
      { label: t("user_name"), value: currentUser?.userName ?? "" },
      { label: t("email"), value: currentUser?.email ?? "" },
      { label: t("wallet_address"), value: currentUser?.walletAddress ?? "" },
    ],
    [currentUser, t]
  );

  const fieldClassNames = useMemo(
    () => ({
      label: "text-sm font-semibold text-slate-600 dark:text-slate-200",
      input:
        "rounded-sm border border-slate-200 bg-white/90 text-slate-900 transition focus:border-indigo-500 focus:ring-0 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-100",
    }),
    []
  );

  const selectClassNames = useMemo(
    () => ({
      label: "text-sm font-semibold text-slate-600 dark:text-slate-200",
      input:
        "rounded-sm border border-slate-200 bg-white/90 text-slate-900 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-100",
    }),
    []
  );

  const handleEnableEdit = () => {
    if (!currentUser) return;
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    if (isProcessing) return;
    syncFormValues(currentUser as ProfileUser | null);
    setIsEditing(false);
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="sticky top-0 z-20 flex items-center gap-3  p-1.5 text-slate-600 shadow-sm bg-white dark:bg-slate-900/70 dark:text-slate-200">
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
            {t("profile_setting")}
          </p>
        </div>
      </div>

      <div className="space-y-5 px-4 pb-8">
        <div className="relative flex items-center gap-4 overflow-hidden rounded-md border border-emerald-300/20 bg-gradient-to-r from-emerald-500 via-teal-500 to-slate-900 p-5 text-white shadow-lg">
          <span className="absolute -right-6 top-6 h-32 w-32 rounded-full bg-white/20 blur-3xl" />
          <div className="relative flex items-center gap-4">
            <Image
              src={currentUser?.avatar ?? IMAGES.default.avatar}
              alt="avatar"
              className="h-full w-full rounded-full object-cover"
              wrapperClassName="h-16 w-16 rounded-full border-2 border-white/60"
            />
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-white/80">
                {t("profile_setting")}
              </p>
              <p className="text-lg font-semibold text-white">{profileName}</p>
              <p className="text-sm text-white/80">
                {currentUser?.email || currentUser?.userName || ""}
              </p>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-5"
        >
          <section className="flex flex-col gap-5 rounded-md border border-slate-200/80 bg-white/85 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
            <div>
              <p className="text-base font-semibold text-slate-900 dark:text-white">
                {t("account_information")}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {t("profile_setting_description")}
              </p>
            </div>
            <div className="flex flex-col gap-3">
              {accountDetails.map((field) => (
                <TextInput
                  key={field.label}
                  label={field.label}
                  value={field.value || ""}
                  readOnly
                  disabled
                  classNames={{
                    label:
                      "text-sm font-semibold text-slate-600 dark:text-slate-200",
                    input:
                      "rounded-sm border border-slate-200 bg-slate-50 text-slate-900 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-100",
                  }}
                />
              ))}
            </div>
          </section>

          <section className="flex flex-col gap-6 rounded-md border border-slate-200/80 bg-white/90 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
            <div>
              <p className="text-base font-semibold text-slate-900 dark:text-white">
                {t("personal_information")}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {t("profile_setting_description")}
              </p>
            </div>
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <FormInput
                  register={register}
                  errors={errors}
                  name="firstName"
                  name_label="first_name"
                  name_placeholder="first_name_placeholder"
                  withAsterisk
                  disabled={!isEditing}
                  isTranslate
                  rules={{ required: "required_field" }}
                  classNames={fieldClassNames}
                />
                <FormInput
                  register={register}
                  errors={errors}
                  name="lastName"
                  name_label="last_name"
                  name_placeholder="last_name_placeholder"
                  withAsterisk
                  disabled={!isEditing}
                  isTranslate
                  rules={{ required: "required_field" }}
                  classNames={fieldClassNames}
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <FormSelect
                  control={control as any}
                  errors={errors}
                  name="gender"
                  name_label="gender"
                  data={genderOptions}
                  disabled={!isEditing}
                  isTranslate
                  classNames={selectClassNames}
                />
                <FormInput
                  register={register}
                  errors={errors}
                  name="phone"
                  name_label="phone"
                  name_placeholder="phone_placeholder"
                  disabled={!isEditing}
                  isTranslate
                  rules={{ required: "required_field" }}
                  classNames={fieldClassNames}
                />
              </div>
              <FormDatePicker
                control={control as any}
                errors={errors}
                name="dob"
                name_label="dob"
                name_placeholder="dob_placeholder"
                disabled={!isEditing}
                isTranslate
                classNames={selectClassNames}
              />
              <FormInput
                register={register}
                errors={errors}
                name="address"
                name_label="address"
                name_placeholder="address_placeholder"
                disabled={!isEditing}
                isTranslate
                classNames={fieldClassNames}
              />
            </div>
          </section>

          <div className="flex flex-col items-stretch gap-2 pt-1 sm:flex-row sm:justify-end">
            {isEditing ? (
              <>
                <Button
                  type="button"
                  variant="outline"
                  color="gray"
                  radius="md"
                  size="sm"
                  onClick={handleCancelEdit}
                  disabled={isProcessing}
                  className="sm:min-w-[140px]"
                >
                  {t("cancel")}
                </Button>
                <Button
                  type="submit"
                  radius="md"
                  size="sm"
                  variant="gradient"
                  gradient={{ from: "indigo", to: "violet" }}
                  loading={isProcessing}
                  disabled={!isDirty}
                  className="sm:min-w-[140px]"
                >
                  {t("save_changes")}
                </Button>
              </>
            ) : (
              <Button
                type="button"
                variant="outline"
                radius="md"
                size="sm"
                leftSection={<TbEdit className="h-4 w-4" />}
                onClick={handleEnableEdit}
                disabled={!currentUser}
                className="sm:min-w-[160px]"
              >
                {t("edit_information")}
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
