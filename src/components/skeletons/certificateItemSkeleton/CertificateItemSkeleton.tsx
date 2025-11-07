import { Box, Flex, Paper, Skeleton, Stack } from "@mantine/core";

export const CertificateItemSkeleton = () => {
  return (
    <Paper
      withBorder
      radius="lg"
      shadow="sm"
      className="relative h-full overflow-hidden bg-white/90 p-5 dark:bg-slate-950/85"
    >
      <Box className="absolute inset-x-4 top-3 h-1 rounded-full bg-slate-200/70 dark:bg-slate-700/70" />

      <Flex gap={12} align="center" className="mt-2">
        <Skeleton height={56} width={56} radius="xl" />
        <Stack gap={6} className="flex-1">
          <Skeleton height={16} width="60%" radius="sm" />
          <Skeleton height={12} width="40%" radius="sm" />
        </Stack>
      </Flex>

      <Stack gap="sm" className="mt-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <Flex
            key={index}
            gap={12}
            className="w-full rounded-xl border border-slate-200/70 px-3 py-3 dark:border-slate-800/70"
          >
            <Skeleton height={40} width={40} radius="lg" />
            <Flex direction="column" gap={6} className="flex-1">
              <Skeleton height={10} width="35%" radius="sm" />
              <Skeleton height={14} width="80%" radius="sm" />
            </Flex>
          </Flex>
        ))}
      </Stack>
    </Paper>
  );
};
