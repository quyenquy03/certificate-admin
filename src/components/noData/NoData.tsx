import { Stack, Text } from "@mantine/core";
import { useTranslations } from "next-intl";
import React from "react";
import { Image } from "../images";
import { IMAGES } from "@/constants";

type NoDataProps = {
  title?: string;
  description?: string;
  isTranslation?: boolean;
};

export const NoData = ({ title, description, isTranslation }: NoDataProps) => {
  const t = useTranslations();

  const noDataTitle = title
    ? isTranslation
      ? t(title)
      : title
    : t("no_data_default_title");

  const noDataDescription = description
    ? isTranslation
      ? t(description)
      : description
    : t("no_data_default_description");

  return (
    <Stack
      gap="sm"
      align="center"
      justify="center"
      className="py-16 text-center max-w-[400px] mx-auto min-h-[400px]"
    >
      <Image
        src={IMAGES.default.noData}
        alt="no-data"
        className="w-48 h-auto select-none"
        wrapperClassName="w-48 h-auto select-none"
      />
      <Text className="text-lg font-semibold text-slate-800 dark:text-slate-100">
        {noDataTitle}
      </Text>
      <Text className="text-sm text-slate-500 dark:text-slate-400">
        {noDataDescription}
      </Text>
    </Stack>
  );
};
