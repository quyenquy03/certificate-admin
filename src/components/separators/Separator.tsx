"use client";

import * as React from "react";
import { cn } from "@/helpers";

export interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Separator = React.forwardRef<HTMLDivElement, SeparatorProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      role="separator"
      className={cn("h-px w-full bg-indigo-500/10", className)}
      {...props}
    />
  ),
);
Separator.displayName = "Separator";

