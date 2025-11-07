import { cn } from "@/helpers";
import { Box } from "@mantine/core";
import React, { ReactNode } from "react";

export type PageContentWrapperProps = {
  children: ReactNode;
  className?: string;
};

export const PageContentWrapper = ({
  children,
  className,
}: PageContentWrapperProps) => {
  return (
    <Box
      className={cn(
        "flex-1 overflow-y-auto h-[calc(100vh-56px)] p-4",
        className
      )}
    >
      {children}
    </Box>
  );
};
