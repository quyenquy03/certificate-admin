"use client";

import { ReactNode, useState } from "react";
import { ApplicationSettings, Sidebar } from "../components";

type MainLayoutProps = {
  children: ReactNode;
};
export const MainLayout = ({ children }: MainLayoutProps) => {
  const [openedSettings, setOpenedSettings] = useState(false);
  return (
    <div className="flex gap-2 min-h-screen">
      <Sidebar onOpenSettings={() => setOpenedSettings(true)} />
      <div>{children}</div>
      <ApplicationSettings
        opened={openedSettings}
        onClose={() => setOpenedSettings(false)}
      />
    </div>
  );
};
