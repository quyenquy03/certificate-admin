"use client";

import { ACCESS_TOKEN_KEY, PAGE_URLS } from "@/constants";
import Cookies from "js-cookie";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

const ForbiddenPage = () => {
  const t = useTranslations();
  const router = useRouter();

  const handleLoginAsOther = useCallback(() => {
    Cookies.remove(ACCESS_TOKEN_KEY);
    router.push(PAGE_URLS.LOGIN);
  }, [router]);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-6 py-24 text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-violet-500/40 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-72 w-72 -translate-x-1/3 translate-y-1/3 rounded-full bg-cyan-400/30 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-96 w-96 translate-x-1/4 translate-y-1/4 rounded-full bg-blue-500/30 blur-3xl" />
      </div>

      <div className="relative flex max-w-xl flex-col items-center text-center">
        <h1 className="text-7xl font-black tracking-tight sm:text-8xl">403</h1>
        <p className="mt-4 text-2xl font-semibold text-white">
          {t("forbidden_title")}
        </p>
        <p className="mt-3 text-base text-white/70">
          {t("forbidden_description")}
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href={PAGE_URLS.HOME}
            className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 shadow-[0_18px_55px_-15px_rgba(56,189,248,0.35)] transition-transform duration-200 hover:-translate-y-0.5"
          >
            {t("forbidden_home_cta")}
          </Link>
          <button
            type="button"
            onClick={handleLoginAsOther}
            className="inline-flex items-center gap-2 rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white/90 transition duration-200 hover:bg-white/10"
          >
            {t("forbidden_alt_login_cta")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForbiddenPage;
