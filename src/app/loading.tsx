"use client";

import { useTranslations } from "next-intl";

const AppLoading = () => {
  const t = useTranslations();

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-6 py-20 text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-indigo-500/40 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-72 w-72 -translate-x-1/3 translate-y-1/3 rounded-full bg-purple-500/25 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-96 w-96 translate-x-1/4 translate-y-1/4 rounded-full bg-cyan-500/25 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(56,189,248,0.12),transparent_55%),radial-gradient(circle_at_85%_30%,rgba(129,140,248,0.14),transparent_60%)]" />
      </div>

      <div className="relative flex flex-col items-center text-center" role="status" aria-busy="true">
        <span className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-white/10">
          <span className="h-14 w-14 rounded-full bg-gradient-to-tr from-cyan-400 via-indigo-400 to-fuchsia-500 p-[3px]">
            <span className="flex h-full w-full items-center justify-center rounded-full bg-slate-950">
              <span className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-300 border-t-transparent" />
            </span>
          </span>
        </span>
        <h1 className="mt-8 text-2xl font-semibold sm:text-3xl">
          {t("loading_title")}
        </h1>
        <p className="mt-3 max-w-lg text-base text-white/70 sm:text-lg">
          {t("loading_description")}
        </p>
      </div>
    </div>
  );
};

export default AppLoading;
