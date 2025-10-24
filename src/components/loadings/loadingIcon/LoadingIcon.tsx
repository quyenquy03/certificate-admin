"use client";

import Lottie from "lottie-react";
import loadingIcon from "public/loadings/loading.json";
import { useMemo } from "react";

import { BaseSizesTypes } from "@/types";

type LoadingIconProps = {
  size?: BaseSizesTypes | number;
  className?: string;
};

export const LoadingIcon = ({ size = "md", className }: LoadingIconProps) => {
  const loaderSize = useMemo(() => {
    if (typeof size === "number") return size;
    switch (size) {
      case "xs":
        return 48; // w-12
      case "sm":
        return 64; // w-16
      case "md":
        return 80; // w-20
      case "lg":
        return 96; // w-24
      case "xl":
        return 128; // w-32
      default:
        return 112; // w-28
    }
  }, [size]);
  return (
    <Lottie
      animationData={loadingIcon}
      loop
      className={className}
      style={{ width: loaderSize }}
    />
  );
};
