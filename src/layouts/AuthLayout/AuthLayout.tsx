"use client";

import { Image } from "@/components/images";
import { IMAGES } from "@/constants";
import { ReactNode } from "react";

type AuthLayoutProps = {
  children: ReactNode;
};
export const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="flex gap-2 min-h-screen items-center justify-center p-4 bg-background-secondary-light dark:bg-background-secondary-dark">
      <div className="w-full max-w-[700px] h-screen max-h-[500px] shadow-lg rounded-xl flex">
        <div className="w-[350px] bg-white dark:bg-background-primary-dark rounded-l-xl p-4 min-w-0">
          {children}
        </div>
        <div className="min-w-0 flex items-end justify-center flex-1 bg-[#fdebeb] dark:bg-[#471150] rounded-r-xl">
          <Image
            className="w-full h-auto select-none"
            wrapperClassName="w-full h-auto px-6"
            src={IMAGES.banners.login}
            alt="login-banner"
          />
        </div>
      </div>
    </div>
  );
};
