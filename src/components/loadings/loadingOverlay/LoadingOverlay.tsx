import {
  LoadingOverlay as MantineLoadingOverlay,
  LoadingOverlayProps,
} from "@mantine/core";

import { BaseSizesTypes } from "@/types";
import { LoadingIcon } from "../loadingIcon";

type LoadingOverlayCustomProps = {
  size?: BaseSizesTypes | number;
} & LoadingOverlayProps;

export const LoadingOverlay = ({
  size = "md",
  ...rest
}: LoadingOverlayCustomProps) => {
  return (
    <MantineLoadingOverlay
      loaderProps={{
        children: <LoadingIcon size={size} />,
      }}
      {...rest}
    />
  );
};
