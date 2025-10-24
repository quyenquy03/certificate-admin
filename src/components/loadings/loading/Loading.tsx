import { Loader, LoaderProps } from "@mantine/core";
import React from "react";

import { BaseSizesTypes } from "@/types";
import { LoadingIcon } from "../loadingIcon";

type LoadingProps = {
  loaderClassName?: string;
  size?: BaseSizesTypes | number;
} & Omit<LoaderProps, "size">;

export function Loading({
  loaderClassName,
  size = "md",
  ...rest
}: LoadingProps) {
  return (
    <Loader
      type="custom"
      loaders={{
        custom: React.forwardRef<SVGSVGElement>((_props, _ref) => {
          return <LoadingIcon size={size} className={loaderClassName} />;
        }),
      }}
      {...rest}
    />
  );
}
