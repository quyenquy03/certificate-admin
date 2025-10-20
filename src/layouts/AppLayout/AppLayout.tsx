"use client";

import {
  LocaleProvider,
  MantineProvider,
  ThemeProvider,
  useTheme,
} from "@/providers";
import { ReactNode } from "react";

type AppLayoutProps = {
  children: ReactNode;
};

export const AppLayout = ({ children }: AppLayoutProps) => {
  const { theme } = useTheme();
  return (
    <MantineProvider theme={theme}>
      <LocaleProvider>{children}</LocaleProvider>
    </MantineProvider>
  );
};
