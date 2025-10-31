"use client";

import { ReactNode, useEffect, useState } from "react";
import { ApplicationSettings, Sidebar } from "../components";
import { useQueryGetMyProfile } from "@/queries";
import Cookies from "js-cookie";
import { ACCESS_TOKEN_KEY, PAGE_URLS } from "@/constants";
import { useRouter } from "next/navigation";
import { LoadingOverlay } from "@/components";
import { stores } from "@/stores";
import { UserResponseType } from "@/types";

type MainLayoutProps = {
  children: ReactNode;
};

export const MainLayout = ({ children }: MainLayoutProps) => {
  const { setCurrentUser, setAccessToken } = stores.account();
  const [openedSettings, setOpenedSettings] = useState(false);
  const [showLoading, setShowLoading] = useState(true);
  const router = useRouter();

  const token = Cookies.get(ACCESS_TOKEN_KEY);

  const {
    data: userData,
    isFetching,
    refetch: getMyProfile,
  } = useQueryGetMyProfile();

  useEffect(() => {
    if (!token) router.push(PAGE_URLS.LOGIN);
    getMyProfile();
  }, [token]);

  useEffect(() => {
    if (!userData || !userData.data || !token) return;
    setCurrentUser(userData.data);
    setAccessToken(token as string);
  }, [userData]);

  useEffect(() => {
    if (isFetching) {
      setShowLoading(true);
      return;
    }

    const timer = setTimeout(() => setShowLoading(false), 2000);
    return () => clearTimeout(timer);
  }, [isFetching]);

  if (showLoading)
    return (
      <LoadingOverlay
        visible={true}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 0.5, backgroundOpacity: 0.3 }}
        size="xl"
      />
    );

  return (
    <div className="flex gap-2 min-h-screen">
      <Sidebar onOpenSettings={() => setOpenedSettings(true)} />
      <div className="ml-72 w-full">{children}</div>
      <ApplicationSettings
        opened={openedSettings}
        onClose={() => setOpenedSettings(false)}
      />
    </div>
  );
};
