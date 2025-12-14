"use client";

import { SimpleGrid } from "@mantine/core";

import { CertificateTypesBox } from "./CertificateTypesBox";
import { RegistrationStatsBox } from "./RegistrationStatsBox";
import { UserStatsBox } from "./UserStatsBox";

export const DashboardAdditionalStats = () => {
  return (
    <SimpleGrid cols={{ base: 1, md: 3 }} spacing="md">
      <UserStatsBox />
      <CertificateTypesBox />
      <RegistrationStatsBox />
    </SimpleGrid>
  );
};
