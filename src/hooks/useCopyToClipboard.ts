"use client";

import { useEffect, useState } from "react";

export const useCopyToClipboard = () => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async (value?: string | null) => {
    if (!value || isCopied) return;
    try {
      await navigator.clipboard.writeText(value);
      setIsCopied(true);
    } catch (error) {
      console.error("copy_error", error);
    }
  };

  useEffect(() => {
    if (!isCopied) return;
    const timeout = setTimeout(() => {
      setIsCopied(false);
    }, 3000);

    return () => {
      clearTimeout(timeout);
    };
  }, [isCopied]);

  return {
    isCopied,
    handleCopy,
  };
};
