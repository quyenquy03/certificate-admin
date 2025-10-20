"use client";

import {
  Image as MantineImage,
  MantineStyleProp,
  Skeleton,
} from "@mantine/core";
import React, { memo, useState } from "react";

type ImageProps = {
  src: string;
  alt: string;
  className?: string;
  wrapperClassName?: string;
  wrapperStyle?: MantineStyleProp;
  fallbackSrc?: string;
};

export const Image = memo(
  ({
    src,
    alt,
    className,
    wrapperClassName,
    wrapperStyle,
    fallbackSrc,
    ...rest
  }: ImageProps) => {
    const [isLoading, setIsLoading] = useState(true);

    return (
      <>
        <Skeleton
          visible={isLoading}
          className={wrapperClassName}
          style={wrapperStyle}
        >
          <MantineImage
            src={src}
            alt={alt}
            fallbackSrc={fallbackSrc ?? "/svg/no-image.svg"}
            onLoad={() => setIsLoading(false)}
            loading="lazy"
            className={className}
            {...rest}
          />
        </Skeleton>
      </>
    );
  }
);
