import { Box, Flex, Skeleton, Stack } from "@mantine/core";

const InfoRowSkeleton = ({
  valueWidth = "60%",
  hasAction = false,
}: {
  valueWidth?: string;
  hasAction?: boolean;
}) => (
  <Flex
    gap={8}
    align="center"
    className="rounded-lg border border-slate-200 px-3 py-3 dark:border-slate-700"
  >
    <Box className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800/60">
      <Skeleton height={16} width={16} radius="sm" />
    </Box>
    <Stack gap={4} className="flex-1 min-w-0">
      <Skeleton height={10} width="28%" radius="sm" />
      <Skeleton height={12} width={valueWidth} radius="sm" />
    </Stack>
    {hasAction && <Skeleton height={30} width={30} radius="lg" />}
  </Flex>
);

export const CertificateItemSkeleton = () => {
  return (
    <Box
      className="relative min-h-28 rounded-lg bg-background-primary-light p-3 shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg dark:bg-background-primary-dark dark:shadow-slate-800"
    >
      <Box className="absolute inset-x-0 top-0 h-1 w-full rounded-t-lg bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600" />
      <Skeleton height={32} width={32} radius="xl" className="absolute top-3 right-3 z-10" />

      <Flex gap={12} align="center" className="pb-4">
        <Skeleton height={56} width={56} radius="xl" />
        <Stack gap={6} className="min-w-0 flex-1">
          <Skeleton height={14} width="55%" radius="sm" />
          <Skeleton height={12} width="40%" radius="sm" />
        </Stack>
      </Flex>

      <Stack gap={8}>
        <InfoRowSkeleton valueWidth="70%" hasAction />
        <InfoRowSkeleton valueWidth="65%" />

        <Flex gap={12} wrap="wrap">
          <Box className="flex-1">
            <InfoRowSkeleton valueWidth="80%" />
          </Box>
          <Flex
            gap={10}
            className="flex-1 min-w-[200px] items-center rounded-md border border-slate-200 px-3 py-3 dark:border-slate-700"
          >
            <Box className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800/60">
              <Skeleton height={16} width={16} radius="sm" />
            </Box>
            <Stack gap={6} className="flex-1 min-w-0">
              <Skeleton height={10} width="35%" radius="sm" />
              <Skeleton height={22} width="45%" radius="lg" />
            </Stack>
          </Flex>
        </Flex>

        <InfoRowSkeleton valueWidth="55%" />
        <InfoRowSkeleton valueWidth="75%" />

        <Box className="rounded-lg border border-slate-200 px-3 py-3 dark:border-slate-700">
          <Skeleton height={10} width="20%" radius="sm" className="mb-2" />
          <Flex align="center" gap={12} justify="space-between">
            <Flex align="center" gap={12} className="min-w-0 flex-1">
              <Skeleton height={40} width={40} radius="sm" />
              <Stack gap={6} className="min-w-0 flex-1">
                <Skeleton height={12} width="50%" radius="sm" />
                <Skeleton height={10} width="35%" radius="sm" />
              </Stack>
            </Flex>
            <Skeleton height={32} width={32} radius="md" />
          </Flex>
        </Box>
      </Stack>
    </Box>
  );
};
