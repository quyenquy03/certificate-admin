"use client";

import { ReactNode } from "react";
import { Header as LandingHeader } from "@/components/headers/landing";
import { LandingFooter } from "@/components/footers/landing";

type ClientLayoutProps = {
  children: ReactNode;
};

export const ClientLayout = ({ children }: ClientLayoutProps) => {
  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100">
      <LandingHeader />
      <main className="flex-1">{children}</main>
      <LandingFooter />
    </div>
  );
};
