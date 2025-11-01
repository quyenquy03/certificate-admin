import { Box, Flex } from "@mantine/core";

export const CertificateTypeItemSkeleton = () => {
  return (
    <Box className="min-h-28 relative overflow-hidden rounded-md bg-background-primary-light p-2 shadow-md dark:bg-background-primary-dark dark:shadow-gray-600">
      <Box className="absolute inset-x-0 top-0 h-1 w-full animate-pulse bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700" />
      <Flex gap={12} align="center" justify="space-between" className="pb-2">
        <Flex gap={8} align="center" className="min-w-0">
          <Box className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-slate-200 animate-pulse dark:bg-slate-700"></Box>
          <Flex direction={"column"} gap={6} className="flex-1">
            <Box className="h-4 w-40 rounded-sm bg-slate-200 animate-pulse dark:bg-slate-700"></Box>
            <Box className="h-3 w-32 rounded-sm bg-slate-200 animate-pulse dark:bg-slate-700"></Box>
          </Flex>
        </Flex>
      </Flex>
      <Flex gap={8} direction={"column"}>
        {/* Status row */}
        <Flex
          gap={12}
          className="w-full rounded-md border border-gray-200 px-3 py-3 dark:border-gray-600"
        >
          <Box className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-200 animate-pulse dark:bg-slate-700"></Box>
          <Flex
            align="center"
            justify="space-between"
            gap={12}
            className="min-w-0 flex-1"
          >
            <Box className="h-3 w-24 rounded-sm bg-slate-200 animate-pulse dark:bg-slate-700"></Box>
            <Box className="h-6 w-24 rounded-full bg-slate-200 animate-pulse dark:bg-slate-700"></Box>
          </Flex>
        </Flex>

        {/* Transaction hash row */}
        <Flex
          gap={12}
          className="w-full rounded-md border border-gray-200 px-3 py-3 dark:border-gray-600"
        >
          <Box className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-200 animate-pulse dark:bg-slate-700"></Box>
          <Flex direction="column" gap={6} className="min-w-0 flex-1">
            <Box className="h-3 w-32 rounded-sm bg-slate-200 animate-pulse dark:bg-slate-700"></Box>
            <Flex align="center" gap={8} className="min-w-0">
              <Box className="h-4 flex-1 rounded-sm bg-slate-200 animate-pulse dark:bg-slate-700"></Box>
              <Box className="h-6 w-6 rounded-full bg-slate-200 animate-pulse dark:bg-slate-700"></Box>
            </Flex>
          </Flex>
        </Flex>

        {/* Description row */}
        <Flex
          gap={12}
          className="w-full rounded-md border border-gray-200 px-3 py-3 dark:border-gray-600"
        >
          <Box className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-200 animate-pulse dark:bg-slate-700"></Box>
          <Flex direction="column" gap={6} className="min-w-0 flex-1">
            <Box className="h-3 w-32 rounded-sm bg-slate-200 animate-pulse dark:bg-slate-700"></Box>
            <Box className="h-4 w-full rounded-sm bg-slate-200 animate-pulse dark:bg-slate-700"></Box>
            <Box className="h-4 w-10/12 rounded-sm bg-slate-200 animate-pulse dark:bg-slate-700"></Box>
            <Box className="h-4 w-8/12 rounded-sm bg-slate-200 animate-pulse dark:bg-slate-700"></Box>
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
};
