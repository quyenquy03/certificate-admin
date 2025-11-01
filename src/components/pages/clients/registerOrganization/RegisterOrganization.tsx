"use client";

import { useCallback, useMemo, useState } from "react";
import { Button, FormInput, FormSelect } from "@/components";
import { useRegisterOrganization } from "@/mutations";
import { BaseErrorType, RegisterOrganizationRequestType } from "@/types";
import { Textarea } from "@mantine/core";
import { isAxiosError } from "axios";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { FiCheckCircle, FiLayers, FiSend, FiShield } from "react-icons/fi";
import { useTranslations } from "next-intl";

const defaultValues: RegisterOrganizationRequestType = {
  walletAddress: "",
  ownerFirstName: "",
  ownerLastName: "",
  email: "",
  phoneNumber: "",
  organizationName: "",
  organizationDescription: "",
  website: "",
  countryCode: "VN",
};

const HIGHLIGHT_ITEMS = [
  { icon: FiShield, key: "security" },
  { icon: FiLayers, key: "onboarding" },
  { icon: FiCheckCircle, key: "verification" },
] as const;

const COUNTRY_CODES = ["VN", "SG", "US", "JP", "KR"] as const;

type SubmissionState = "idle" | "success" | "error";

type WalletStatus = {
  type: "success" | "error";
  message: string;
} | null;

export const RegisterOrganization = () => {
  const t = useTranslations();
  const translate = useCallback((key: string) => t(`register_org_${key}`), [t]);
  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { ...defaultValues },
  });

  const [status, setStatus] = useState<SubmissionState>("idle");
  const [feedback, setFeedback] = useState<string>("");
  const [isConnectingWallet, setIsConnectingWallet] = useState(false);
  const [walletStatus, setWalletStatus] = useState<WalletStatus>(null);

  const { mutate: registerOrganization, isPending } = useRegisterOrganization({
    onSuccess: () => {
      setStatus("success");
      setFeedback(translate("form_success"));
      reset({ ...defaultValues });
    },
    onError: (error) => {
      setStatus("error");
      if (isAxiosError<BaseErrorType>(error)) {
        const message = t(error.response?.data?.code || "common_error_message");
        setFeedback(message || translate("form_error_default"));
      } else {
        setFeedback(translate("form_error_default"));
      }
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (values) => {
    setStatus("idle");
    setFeedback("");
    const payload: RegisterOrganizationRequestType = {
      organizationName: (values.organizationName ?? "").trim(),
      website: (values.website ?? "").trim(),
      organizationDescription: (values.organizationDescription ?? "").trim(),
      ownerFirstName: (values.ownerFirstName ?? "").trim(),
      ownerLastName: (values.ownerLastName ?? "").trim(),
      email: (values.email ?? "").trim(),
      phoneNumber: (values.phoneNumber ?? "").trim(),
      walletAddress: (values.walletAddress ?? "").trim(),
      countryCode: (values.countryCode ?? defaultValues.countryCode) as string,
    };
    registerOrganization(payload);
  };

  const scrollToForm = () => {
    const el = document.getElementById("registration-form");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const isProcessing = isPending || isSubmitting;

  const countryOptions = useMemo(
    () =>
      COUNTRY_CODES.map((code) => ({
        value: code,
        label: translate(`country_${code.toLowerCase()}`),
      })),
    [translate]
  );

  const contactDetails = useMemo(
    () => [
      {
        label: translate("contact_email_label"),
        value: "support@certifychain.io",
      },
      { label: translate("contact_hotline_label"), value: "+84 24 7300 1234" },
    ],
    [translate]
  );

  const fieldClassNames = useMemo(
    () => ({
      label: "text-sm font-medium text-slate-200",
      input:
        "rounded-lg border border-indigo-500/20 bg-slate-950/60 text-sm text-slate-100 placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40",
    }),
    []
  );

  const walletValidationRules = useMemo(
    () => ({
      required: translate("wallet_required"),
      minLength: {
        value: 10,
        message: translate("wallet_invalid"),
      },
    }),
    [translate]
  );

  const getMetaMaskProvider = useCallback(() => {
    if (typeof window === "undefined") return undefined;
    const anyWindow = window as any;
    const { ethereum } = anyWindow ?? {};

    if (!ethereum) return undefined;

    if (Array.isArray(ethereum.providers)) {
      return ethereum.providers.find(
        (provider: unknown) => (provider as any)?.isMetaMask
      );
    }

    if (ethereum.isMetaMask) return ethereum;

    return undefined;
  }, []);

  const handleConnectWallet = useCallback(async () => {
    const provider = getMetaMaskProvider();

    if (!provider) {
      setWalletStatus({
        type: "error",
        message: translate("wallet_unavailable"),
      });
      return;
    }

    try {
      setWalletStatus(null);
      setIsConnectingWallet(true);
      const accounts: string[] = await provider.request({
        method: "eth_requestAccounts",
      });

      const account = accounts?.[0];
      if (account) {
        setValue("walletAddress", account, { shouldValidate: true });
        setWalletStatus({
          type: "success",
          message: translate("wallet_connected"),
        });
      } else {
        setWalletStatus({
          type: "error",
          message: translate("wallet_no_account"),
        });
      }
    } catch (error) {
      const message =
        error && typeof error === "object" && "message" in error
          ? String((error as Error).message)
          : translate("wallet_connect_error");
      setWalletStatus({ type: "error", message });
    } finally {
      setIsConnectingWallet(false);
    }
  }, [getMetaMaskProvider, setValue, translate]);

  return (
    <div className="pb-16">
      <section className="relative overflow-hidden border-b border-indigo-500/10 bg-gradient-to-br from-indigo-500/15 via-slate-950 to-slate-950">
        <div className="absolute -left-24 top-[-10rem] h-[28rem] w-[28rem] rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute -right-32 bottom-[-8rem] h-[30rem] w-[30rem] rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="relative mx-auto max-w-5xl px-6 py-20 text-center sm:px-8 md:py-24">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-indigo-200/80">
            {translate("partner_badge")}
          </p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight text-slate-100 sm:text-5xl">
            {translate("hero_title")}
          </h1>
          <p className="mt-4 text-lg text-slate-300 sm:text-xl">
            {translate("hero_subtitle")}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button
              size="lg"
              className="h-12 rounded-full px-8 text-base font-medium"
              onClick={scrollToForm}
            >
              <FiSend className="mr-2 h-4 w-4" />
              {translate("cta_start")}
            </Button>
            <a
              href="mailto:support@certifychain.io"
              className="inline-flex h-12 items-center rounded-full border border-indigo-400/60 px-8 text-base font-medium text-indigo-200 transition hover:bg-indigo-500/10"
            >
              {translate("cta_contact")}
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[1fr,1.15fr]">
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl font-semibold text-slate-100 sm:text-4xl">
                {translate("section_reason_title")}
              </h2>
              <p className="text-base text-slate-300 sm:text-lg">
                {translate("section_reason_desc")}
              </p>
            </div>
            <div className="grid gap-4">
              {HIGHLIGHT_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.key}
                    className="flex items-start gap-4 rounded-2xl border border-indigo-500/10 bg-slate-900/40 p-5"
                  >
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500/15 text-indigo-200">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-wide text-indigo-200/90">
                        {translate(`highlight_${item.key}_title`)}
                      </p>
                      <p className="mt-1 text-sm text-slate-300">
                        {translate(`highlight_${item.key}_desc`)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="rounded-2xl border border-indigo-500/20 bg-slate-900/30 p-5">
              <p className="text-sm text-slate-300">
                {translate("contact_prefer_text")}
              </p>
              <div className="mt-3 space-y-1 text-sm text-slate-200">
                {contactDetails.map((item) => (
                  <p key={item.label}>
                    {item.label}: {item.value}
                  </p>
                ))}
              </div>
              <p className="mt-3 text-xs text-slate-500">
                {translate("contact_response_time")}
              </p>
            </div>
          </div>

          <div
            id="registration-form"
            className="rounded-3xl border border-indigo-500/20 bg-slate-950/70 p-6 shadow-lg shadow-indigo-500/10 backdrop-blur"
          >
            <div>
              <h3 className="text-2xl font-semibold text-slate-100">
                {translate("form_title")}
              </h3>
              <p className="mt-2 text-sm text-slate-300">
                {translate("form_description")}
              </p>
              {status === "success" && feedback && (
                <div className="mt-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                  {feedback}
                </div>
              )}
              {status === "error" && feedback && (
                <div className="mt-4 rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                  {feedback}
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-8">
              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-semibold text-slate-100">
                    {translate("personal_info_title")}
                  </h4>
                  <p className="text-sm text-slate-400">
                    {translate("personal_info_description")}
                  </p>
                </div>

                <FormInput
                  name="email"
                  name_label={translate("personal_email_label")}
                  name_placeholder={translate("personal_email_placeholder")}
                  register={register as any}
                  errors={errors}
                  rules={{
                    required: "Please enter an email address.",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Please enter a valid email address.",
                    },
                  }}
                  classNames={fieldClassNames}
                  isTranslate={false}
                  withAsterisk
                  size="md"
                  type="email"
                />

                <div className="grid gap-4 sm:grid-cols-2">
                  <FormInput
                    name="ownerFirstName"
                    name_label={translate("personal_first_name_label")}
                    name_placeholder={translate(
                      "personal_first_name_placeholder"
                    )}
                    register={register as any}
                    errors={errors}
                    rules={{
                      required: "Please enter a first name.",
                      maxLength: {
                        value: 60,
                        message: "Maximum 60 characters.",
                      },
                    }}
                    classNames={fieldClassNames}
                    isTranslate={false}
                    withAsterisk
                    size="md"
                  />
                  <FormInput
                    name="ownerLastName"
                    name_label={translate("personal_last_name_label")}
                    name_placeholder={translate(
                      "personal_last_name_placeholder"
                    )}
                    register={register as any}
                    errors={errors}
                    rules={{
                      required: "Please enter a last name.",
                      maxLength: {
                        value: 60,
                        message: "Maximum 60 characters.",
                      },
                    }}
                    classNames={fieldClassNames}
                    isTranslate={false}
                    withAsterisk
                    size="md"
                  />
                </div>

                <FormInput
                  name="phoneNumber"
                  name_label={translate("personal_phone_label")}
                  name_placeholder={translate("personal_phone_placeholder")}
                  register={register as any}
                  errors={errors}
                  rules={{
                    required: "Please enter a phone number.",
                    pattern: {
                      value: /^[0-9+()\s-]{6,}$/i,
                      message: "Please enter a valid phone number.",
                    },
                  }}
                  classNames={fieldClassNames}
                  isTranslate={false}
                  withAsterisk
                  size="md"
                  type="tel"
                />
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-semibold text-slate-100">
                    {translate("organization_info_title")}
                  </h4>
                  <p className="text-sm text-slate-400">
                    {translate("organization_info_description")}
                  </p>
                </div>

                <FormInput
                  name="organizationName"
                  name_label={translate("organization_name_label")}
                  name_placeholder={translate("organization_name_placeholder")}
                  register={register as any}
                  errors={errors}
                  rules={{
                    required: "Please enter your organization name.",
                    maxLength: {
                      value: 120,
                      message: "Maximum 120 characters.",
                    },
                  }}
                  classNames={fieldClassNames}
                  isTranslate={false}
                  withAsterisk
                  size="md"
                />

                <FormInput
                  name="website"
                  name_label={translate("organization_website_label")}
                  name_placeholder={translate(
                    "organization_website_placeholder"
                  )}
                  register={register as any}
                  errors={errors}
                  rules={{
                    validate: (value: string) =>
                      value === "" ||
                      /^https?:\/\/[\w.-]+(?:\.[\w\.-]+)+(?:[\/\w\.-]*)*$/i.test(
                        value
                      ) ||
                      "Please enter a valid URL.",
                  }}
                  classNames={fieldClassNames}
                  isTranslate={false}
                  size="md"
                />

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-200">
                    {translate("programs_label")}
                  </label>
                  <Textarea
                    minRows={4}
                    placeholder={translate("programs_placeholder")}
                    {...register("organizationDescription", {
                      required: "Please share a short description.",
                      minLength: {
                        value: 20,
                        message: "Please provide at least 20 characters.",
                      },
                    })}
                    classNames={{
                      input: fieldClassNames.input,
                    }}
                  />
                  {errors.organizationDescription && (
                    <p className="text-xs text-rose-400">
                      {(errors.organizationDescription.message as string) ?? ""}
                    </p>
                  )}
                </div>

                <FormSelect
                  name="countryCode"
                  name_label={translate("organization_country_label")}
                  name_placeholder={translate(
                    "organization_country_placeholder"
                  )}
                  control={control as any}
                  errors={errors}
                  data={countryOptions}
                  rules={{
                    required: "Please choose a country.",
                  }}
                  isTranslate={false}
                  allowDeselect={false}
                  defaultValue={defaultValues.countryCode}
                  classNames={fieldClassNames}
                  size="md"
                />
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-semibold text-slate-100">
                    {translate("wallet_step_title")}
                  </h4>
                  <p className="text-sm text-slate-400">
                    {translate("wallet_step_description")}
                  </p>
                </div>

                <input
                  type="hidden"
                  {...register("walletAddress", walletValidationRules)}
                />

                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="px-4"
                    onClick={handleConnectWallet}
                    disabled={isConnectingWallet}
                  >
                    {isConnectingWallet
                      ? translate("wallet_connecting")
                      : translate("wallet_connect_button")}
                  </Button>
                  {walletStatus?.message && (
                    <span
                      className={`text-xs ${
                        walletStatus.type === "success"
                          ? "text-emerald-400"
                          : "text-rose-400"
                      }`}
                    >
                      {walletStatus.message}
                    </span>
                  )}
                </div>

                {errors.walletAddress && (
                  <p className="text-xs text-rose-400">
                    {String(errors.walletAddress.message ?? "")}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full rounded-full text-base"
                disabled={isProcessing}
              >
                {isProcessing
                  ? translate("form_submit_processing")
                  : translate("form_submit")}
              </Button>
              <p className="text-center text-xs text-slate-500">
                {translate("form_disclaimer")}
              </p>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};
