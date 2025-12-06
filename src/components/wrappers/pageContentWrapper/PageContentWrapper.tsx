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
        "overflow-y-auto scrollbar h-[calc(100vh-76px)] p-4 scrollbar",
        className
      )}
    >
      {children}
    </Box>
  );
};
