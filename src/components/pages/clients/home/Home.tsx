"use client";

import { FC } from "react";
import { motion } from "framer-motion";
import {
  FiSearch,
  FiUserPlus,
  FiShield,
  FiCheckCircle,
  FiClock,
  FiLock,
  FiGrid,
  FiFileText,
  FiMail,
  FiPhone,
  FiMessageCircle,
} from "react-icons/fi";
import { Button } from "@/components/buttons";
import { Badge } from "@/components/badges";
import { landingPartners } from "@/components/footers/landing";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/cards";
import { PAGE_URLS } from "@/constants";
import { useTranslations } from "next-intl";

export const Home: FC = () => {
  const router = useRouter();
  const t = useTranslations("client_home");

  const steps = [
    {
      marker: t("steps.step1.marker"),
      title: t("steps.step1.title"),
      description: t("steps.step1.description"),
    },
    {
      marker: t("steps.step2.marker"),
      title: t("steps.step2.title"),
      description: t("steps.step2.description"),
    },
    {
      marker: t("steps.step3.marker"),
      title: t("steps.step3.title"),
      description: t("steps.step3.description"),
    },
  ];

  const benefits = [
    {
      icon: FiShield,
      title: t("benefits.item1.title"),
      description: t("benefits.item1.description"),
    },
    {
      icon: FiCheckCircle,
      title: t("benefits.item2.title"),
      description: t("benefits.item2.description"),
    },
    {
      icon: FiClock,
      title: t("benefits.item3.title"),
      description: t("benefits.item3.description"),
    },
    {
      icon: FiLock,
      title: t("benefits.item4.title"),
      description: t("benefits.item4.description"),
    },
  ];

  const lookupFeatures = [
    {
      icon: FiSearch,
      title: t("lookup.features.item1.title"),
      description: t("lookup.features.item1.description"),
    },
    {
      icon: FiGrid,
      title: t("lookup.features.item2.title"),
      description: t("lookup.features.item2.description"),
    },
    {
      icon: FiFileText,
      title: t("lookup.features.item3.title"),
      description: t("lookup.features.item3.description"),
    },
  ];

  const contactDetails = [
    {
      icon: FiMail,
      label: t("contact.support_email_label"),
      value: "support@certifychain.io",
    },
    {
      icon: FiPhone,
      label: t("contact.support_hotline_label"),
      value: "+84 24 7300 1234",
    },
    {
      icon: FiMessageCircle,
      label: t("contact.support_chat_label"),
      value: t("contact.support_chat_desc"),
    },
  ];

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const navigateToRegister = () => {
    router.push(PAGE_URLS.REGISTER_ORGANIZATION);
  };

  const navigateToCertificateLookup = () => {
    router.push(PAGE_URLS.CERTIFICATE_LOOKUP);
  };

  return (
    <div className="pt-0 bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
      <section
        id="gioi-thieu"
        className="relative overflow-hidden scroll-mt-[80px] text-center"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-white to-slate-100 dark:from-indigo-500/20 dark:via-slate-900 dark:to-slate-950" />
        <div className="absolute top-1/2 left-1/2 h-[26rem] w-[26rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-300/30 blur-3xl dark:bg-indigo-500/30" />
        <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-10 px-6 pb-24 pt-32 sm:px-8 md:pt-36">
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-5xl font-semibold leading-tight tracking-tight sm:text-6xl md:text-7xl"
          >
            {t("intro.title")}
          </motion.h1>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.05 }}
            className="text-2xl font-medium text-indigo-700 dark:text-indigo-200 sm:text-3xl md:text-4xl"
          >
            {t("intro.tagline")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
            className="max-w-3xl text-lg text-slate-700 dark:text-slate-300 sm:text-xl"
          >
            {t("intro.description")}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.25 }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <Button
              size="lg"
              className="h-12 rounded-full px-8 text-base font-medium"
              onClick={navigateToCertificateLookup}
            >
              <FiSearch className="mr-2 h-4 w-4" />
              {t("intro.cta_lookup")}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-12 rounded-full border-indigo-300 px-8 text-base text-indigo-700 hover:bg-indigo-50 dark:border-indigo-400/60 dark:text-indigo-200 dark:hover:bg-indigo-500/10"
              onClick={navigateToRegister}
            >
              <FiUserPlus className="mr-2 h-4 w-4" />
              {t("intro.cta_register")}
            </Button>
          </motion.div>
        </div>
      </section>

      <section
        id="cach-hoat-dong-loi-ich"
        className="bg-slate-100/70 scroll-mt-[80px] text-center dark:bg-slate-900/60"
      >
        <div className="mx-auto max-w-6xl px-6 py-16 sm:px-8 md:py-20">
          <Badge
            variant="secondary"
            className="mx-auto bg-indigo-100 px-5 py-2 text-sm font-semibold uppercase tracking-wide text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-200 sm:text-base"
          >
            {t("how.badge")}
          </Badge>
          <h2 className="mt-4 text-2xl font-semibold text-slate-900 dark:text-slate-100 sm:text-3xl">
            {t("how.title")}
          </h2>
          <p className="mt-4 max-w-3xl text-center text-slate-700 dark:text-slate-300 sm:mx-auto">
            {t("how.description")}
          </p>
          <p className="mt-4 text-sm font-semibold uppercase tracking-wide text-indigo-700 dark:text-indigo-200">
            {t("how.steps_badge")}
          </p>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {steps.map((step) => (
              <Card
                key={step.title}
                className="border border-slate-200 bg-white text-left shadow-lg shadow-indigo-500/10 dark:border-indigo-500/10 dark:bg-slate-900/50"
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-xl text-slate-900 dark:text-slate-100">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-lg text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300">
                      {step.marker}
                    </span>
                    <span>{step.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-700 dark:text-slate-300">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-16 space-y-4">
            <p className="text-sm font-semibold uppercase tracking-wide text-indigo-700 dark:text-indigo-200">
              {t("benefits.badge")}
            </p>
            <div className="grid gap-6 md:grid-cols-2">
              {benefits.map((benefit) => {
                const Icon = benefit.icon;
                return (
                  <Card
                    key={benefit.title}
                    className="border border-slate-200 bg-white text-left dark:border-indigo-500/10 dark:bg-slate-900/60"
                  >
                    <CardHeader className="flex items-start gap-3">
                      <span className="rounded-full bg-indigo-100 p-3 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300">
                        <Icon className="h-5 w-5" />
                      </span>
                      <div>
                        <CardTitle className="text-lg text-slate-900 dark:text-slate-100">
                          {benefit.title}
                        </CardTitle>
                        <CardDescription className="text-sm text-slate-700 dark:text-slate-300">
                          {benefit.description}
                        </CardDescription>
                      </div>
                    </CardHeader>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section
        id="tra-cuu-chung-chi"
        className="mx-auto max-w-6xl scroll-mt-[80px] px-6 py-16 text-center sm:px-8 md:py-20"
      >
        <Badge
          variant="secondary"
          className="mx-auto bg-indigo-100 px-5 py-2 text-sm font-semibold uppercase tracking-wide text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-200 sm:text-base"
        >
          {t("lookup.badge")}
        </Badge>
        <h2 className="mt-4 text-2xl font-semibold text-slate-900 dark:text-slate-100 sm:text-3xl">
          {t("lookup.title")}
        </h2>
        <p className="mt-4 max-w-3xl text-center text-slate-700 dark:text-slate-300 sm:mx-auto">
          {t("lookup.description")}
        </p>
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {lookupFeatures.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card
                key={feature.title}
                className="border border-slate-200 bg-white text-left dark:border-indigo-500/10 dark:bg-slate-900/50"
              >
                <CardHeader className="space-y-3">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300">
                    <Icon className="h-5 w-5" />
                  </span>
                  <CardTitle className="text-xl text-slate-900 dark:text-slate-100">
                    {feature.title}
                  </CardTitle>
                  <CardDescription className="text-sm text-slate-700 dark:text-slate-300">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </section>

      <section
        id="doi-tac"
        className="bg-slate-100/70 scroll-mt-[80px] text-center dark:bg-slate-900/60"
      >
        <div className="mx-auto max-w-6xl px-6 py-16 sm:px-8 md:py-20">
          <Badge
            variant="secondary"
            className="mx-auto bg-indigo-100 px-5 py-2 text-sm font-semibold uppercase tracking-wide text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-200 sm:text-base"
          >
            {t("partners.badge")}
          </Badge>
          <h2 className="mt-4 text-2xl font-semibold text-slate-900 dark:text-slate-100 sm:text-3xl">
            {t("partners.title")}
          </h2>
          <p className="mt-4 max-w-3xl text-center text-slate-700 dark:text-slate-300 sm:mx-auto">
            {t("partners.description")}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {landingPartners.map((partner) => (
              <Badge
                key={partner}
                variant="outline"
                className="border-indigo-500/30 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700 dark:bg-transparent dark:text-slate-300"
              >
                {partner}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      <section
        id="dang-ky-ngay"
        className="bg-gradient-to-br from-indigo-600/10 via-slate-50 to-white scroll-mt-[80px] text-center dark:from-indigo-600/10 dark:via-slate-900 dark:to-slate-950"
      >
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 px-6 py-20 sm:px-8">
          <Badge
            variant="secondary"
            className="bg-indigo-100 px-5 py-2 text-sm font-semibold uppercase tracking-wide text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-200 sm:text-base"
          >
            {t("cta.badge")}
          </Badge>
          <h2 className="text-3xl font-semibold text-slate-900 dark:text-slate-100 sm:text-4xl">
            {t("cta.title")}
          </h2>
          <p className="max-w-2xl text-lg text-slate-700 dark:text-slate-300">
            {t("cta.description")}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button
              size="lg"
              className="h-12 rounded-full px-8 text-base font-medium"
              onClick={navigateToRegister}
            >
              {t("intro.cta_register")}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-12 rounded-full border-indigo-300 px-8 text-base text-indigo-700 hover:bg-indigo-50 dark:border-indigo-400/60 dark:text-indigo-200 dark:hover:bg-indigo-500/10"
              onClick={() => scrollToSection("lien-he")}
            >
              {t("cta.request_demo")}
            </Button>
          </div>
        </div>
      </section>

      <section
        id="lien-he"
        className="mx-auto max-w-6xl scroll-mt-[80px] px-6 py-16 text-center sm:px-8 md:py-20"
      >
        <Badge
          variant="secondary"
          className="mx-auto bg-indigo-100 px-5 py-2 text-sm font-semibold uppercase tracking-wide text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-200 sm:text-base"
        >
          {t("contact.badge")}
        </Badge>
        <h2 className="mt-4 text-2xl font-semibold text-slate-900 dark:text-slate-100 sm:text-3xl">
          {t("contact.title")}
        </h2>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <Card className="border border-slate-200 bg-white text-left dark:border-indigo-500/10 dark:bg-slate-900/60">
            <CardHeader>
              <CardTitle className="text-2xl text-slate-900 dark:text-slate-100">
                {t("contact.support_title")}
              </CardTitle>
              <CardDescription className="text-slate-700 dark:text-slate-300">
                {t("contact.support_description")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
                {contactDetails.map((channel) => {
                  const Icon = channel.icon;
                  return (
                    <li key={channel.label} className="flex items-start gap-3">
                      <span className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300">
                        <Icon className="h-4 w-4" />
                      </span>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-slate-200">
                          {channel.label}
                        </p>
                        <p>{channel.value}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </CardContent>
          </Card>
          <Card className="border border-slate-200 bg-white text-left dark:border-indigo-500/10 dark:bg-slate-900/60">
            <CardHeader className="space-y-3">
              <CardTitle className="text-2xl text-slate-900 dark:text-slate-100">
                {t("contact.form_title")}
              </CardTitle>
              <CardDescription className="text-slate-700 dark:text-slate-300">
                {t("contact.form_description")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="space-y-1.5">
                  <label
                    htmlFor="contact-name"
                    className="text-sm font-medium text-slate-900 dark:text-slate-200"
                  >
                    {t("contact.form_name_label")}
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    placeholder={t("contact.form_name_placeholder")}
                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 dark:border-indigo-500/20 dark:bg-slate-950/60 dark:text-slate-100 dark:placeholder:text-slate-500"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label
                    htmlFor="contact-email"
                    className="text-sm font-medium text-slate-900 dark:text-slate-200"
                  >
                    {t("contact.form_email_label")}
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    placeholder={t("contact.form_email_placeholder")}
                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 dark:border-indigo-500/20 dark:bg-slate-950/60 dark:text-slate-100 dark:placeholder:text-slate-500"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label
                    htmlFor="contact-message"
                    className="text-sm font-medium text-slate-900 dark:text-slate-200"
                  >
                    {t("contact.form_message_label")}
                  </label>
                  <textarea
                    id="contact-message"
                    rows={4}
                    placeholder={t("contact.form_message_placeholder")}
                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 dark:border-indigo-500/20 dark:bg-slate-950/60 dark:text-slate-100 dark:placeholder:text-slate-500"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  size="lg"
                  className="w-full rounded-full text-base"
                >
                  {t("contact.form_submit")}
                </Button>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {t("contact.response_time")}
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};
