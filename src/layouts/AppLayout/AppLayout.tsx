"use client";

import {
  LocaleProvider,
  MantineProvider,
  QueryClientProvider,
  useTheme,
} from "@/providers";
import { ReactNode } from "react";
import { Notifications } from "@mantine/notifications";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
type AppLayoutProps = {
  children: ReactNode;
};

export const AppLayout = ({ children }: AppLayoutProps) => {
  const { theme } = useTheme();
  return (
    <MantineProvider theme={theme}>
      <QueryClientProvider>
        <LocaleProvider>
          <Notifications position="top-right" />
          {children}
        </LocaleProvider>
      </QueryClientProvider>
    </MantineProvider>
  );
};
