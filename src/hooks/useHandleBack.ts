"use client";

import { PAGE_URLS } from "@/constants";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

export const useHandleBack = () => {
  const router = useRouter();

  const handleBack = () => {
    if (!window || !document || !window.history?.length) return;

    if (
      window.history.length === 1 ||
      (window.history.length === 2 && !document.referrer)
    ) {
      router.push(PAGE_URLS.HOME);
    } else {
      router.back();
    }
  };

  const isNoPreviousUrl = useMemo(() => {
    if (typeof window !== "undefined") {
      if (!window || !document || !window.history?.length) return true;
      return (
        window.history.length === 1 ||
        (window.history.length === 2 && !document.referrer)
      );
    }
    return false;
  }, [typeof window !== "undefined" && window]);

  return { handleBack, isNoPreviousUrl };
};
