"use client";

import * as React from "react";
import { cn } from "@/helpers";

type BadgeVariant = "default" | "secondary" | "outline";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide",
        {
          "border-transparent bg-indigo-500 text-white": variant === "default",
          "border-transparent bg-indigo-500/10 text-indigo-200": variant === "secondary",
          "border-indigo-500/40 text-indigo-200": variant === "outline",
        },
        className,
      )}
      {...props}
    />
  ),
);
Badge.displayName = "Badge";

