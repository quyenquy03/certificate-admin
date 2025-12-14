import { Box, Flex } from "@mantine/core";

export const UserItemSkeleton = () => {
  return (
    <Box className="relative min-h-28 cursor-pointer rounded-lg bg-background-primary-light p-3 text-color-light shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg dark:bg-background-primary-dark dark:text-color-dark dark:shadow-slate-800">
      <Box className="absolute inset-x-0 top-0 h-1 w-full rounded-t-lg bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 opacity-80 animate-pulse dark:from-slate-700 dark:via-slate-600 dark:to-slate-700" />
      <Box className="absolute top-3 right-3 z-10 h-8 w-8 rounded-full bg-slate-200 animate-pulse dark:bg-slate-700" />

      <Flex gap={12} align="center" className="pb-4">
        <Box className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-md bg-slate-200 animate-pulse dark:bg-slate-700" />

        <Flex direction="column" gap={6} className="min-w-0 flex-1">
          <Box className="h-4 w-40 rounded-sm bg-slate-200 animate-pulse dark:bg-slate-700" />
          <Box className="h-3 w-32 rounded-sm bg-slate-200 animate-pulse dark:bg-slate-700" />
          <Flex gap={6} wrap="wrap">
            <Box className="h-6 w-20 rounded-full bg-slate-200 animate-pulse dark:bg-slate-700" />
            <Box className="h-6 w-20 rounded-full bg-slate-200 animate-pulse dark:bg-slate-700" />
          </Flex>
        </Flex>
      </Flex>

      <Flex direction="column" gap={10}>
        {[0, 1, 2, 3].map((index) => (
          <Flex
            key={index}
            gap={8}
            align="center"
            className="rounded-lg border border-slate-200 px-3 py-3 dark:border-slate-700"
          >
            <Box className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-200 animate-pulse dark:bg-slate-700" />
            <Flex direction="column" gap={6} className="min-w-0 flex-1">
              <Box className="h-3 w-24 rounded-sm bg-slate-200 animate-pulse dark:bg-slate-700" />
              <Box className="h-4 w-full rounded-sm bg-slate-200 animate-pulse dark:bg-slate-700" />
            </Flex>
            {index === 3 && (
              <Box className="h-6 w-6 shrink-0 rounded-md bg-slate-200 animate-pulse dark:bg-slate-700" />
            )}
          </Flex>
        ))}
      </Flex>
    </Box>
  );
};
