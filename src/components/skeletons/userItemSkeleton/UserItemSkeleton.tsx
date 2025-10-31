import { Box, Flex } from "@mantine/core";

export const UserItemSkeleton = () => {
  return (
    <Box className="min-h-28 relative text-color-light dark:text-color-dark bg-background-primary-light dark:bg-background-primary-dark rounded-md shadow-md dark:shadow-gray-600 p-2 cursor-pointer transition-all">
      <Flex gap={8}>
        <Box className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-200 animate-pulse"></Box>
        <Flex direction={"column"} gap={4} justify={"space-between"}>
          <Box>
            <Box className="rounded-sm bg-gray-200 animate-pulse w-40 h-4"></Box>
            <Box className="rounded-sm bg-gray-200 animate-pulse w-52 h-3 mt-1"></Box>
          </Box>
          <Flex gap={10}>
            <Box className="rounded-full bg-gray-200 animate-pulse w-24 h-7"></Box>
            <Box className="rounded-full bg-gray-200 animate-pulse w-24 h-7"></Box>
          </Flex>
        </Flex>
      </Flex>
      <Flex gap={1} direction={"column"} mt={10}>
        <Box className="rounded-sm bg-gray-200 animate-pulse w-full h-4 mt-2"></Box>
        <Box className="rounded-sm bg-gray-200 animate-pulse w-full h-4 mt-2"></Box>
        <Box className="rounded-sm bg-gray-200 animate-pulse w-full h-4 mt-2"></Box>
      </Flex>
    </Box>
  );
};
