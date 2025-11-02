"use client";

import { PAGE_URLS } from "@/constants";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

const NotFound = () => {
  const t = useTranslations();
  const router = useRouter();

  const handleGoBack = useCallback(() => {
    router.back();
  }, [router]);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-6 py-20 text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-purple-600/30 blur-3xl" />
        <div className="absolute top-1/3 left-1/4 h-72 w-72 -translate-x-1/2 rounded-full bg-sky-500/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[28rem] w-[28rem] translate-x-1/4 translate-y-1/4 rounded-full bg-indigo-500/30 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.15),transparent_60%),radial-gradient(circle_at_80%_10%,rgba(168,85,247,0.12),transparent_55%)]" />
      </div>

      <div className="relative flex max-w-2xl flex-col items-center text-center">
        <span className="mb-4 rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.4em] text-white/70">
          {t("not_found_label")}
        </span>
        <h1 className="text-7xl font-black tracking-tight drop-shadow-[0_20px_40px_rgba(79,70,229,0.35)] sm:text-8xl">
          404
        </h1>
        <p className="mt-4 text-2xl font-semibold text-white sm:text-3xl">
          {t("not_found_title")}
        </p>
        <p className="mt-3 text-base text-white/70 sm:text-lg">
          {t("not_found_description")}
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href={PAGE_URLS.HOME}
            className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 shadow-[0_18px_45px_-12px_rgba(129,140,248,0.35)] transition-transform duration-200 hover:-translate-y-0.5"
          >
            {t("not_found_home_cta")}
          </Link>
          <button
            type="button"
            onClick={handleGoBack}
            className="inline-flex items-center gap-2 rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white/90 transition duration-200 hover:bg-white/10"
          >
            {t("not_found_back_cta")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
