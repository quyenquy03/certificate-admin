"use client";

import { ReactNode, useMemo } from "react";
import { Header as LandingHeader, LandingFooter } from "@/components";
import { usePathname } from "next/navigation";
import { HIDDEN_FOOTER_CLIENT_URLS } from "@/constants";

type ClientLayoutProps = {
  children: ReactNode;
};

export const ClientLayout = ({ children }: ClientLayoutProps) => {
  const pathname = usePathname();

  const isHideFooter = useMemo(() => {
    return HIDDEN_FOOTER_CLIENT_URLS.some((item) => pathname.includes(item));
  }, [pathname]);

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100">
      <LandingHeader />
      <main className="flex-1">{children}</main>
      {!isHideFooter && <LandingFooter />}
    </div>
  );
};
