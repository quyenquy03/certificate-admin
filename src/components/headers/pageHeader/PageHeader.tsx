import { cn } from "@/helpers";
import { useHandleBack } from "@/hooks";
import { Box, Flex, Group, Paper, Stack, Title } from "@mantine/core";
import { ReactNode } from "react";
import { BiChevronLeft } from "react-icons/bi";

type PageHeaderProps = {
  children?: ReactNode;
  title?: string;
  showBackButton?: boolean;
  classNames?: {
    wrapper?: string;
    title?: string;
    rightBox?: string;
  };
};

export const PageHeader = ({
  children,
  title,
  classNames,
  showBackButton = false,
}: PageHeaderProps) => {
  const { handleBack } = useHandleBack();
  return (
    <Paper
      withBorder
      radius="sm"
      shadow="sm"
      className={cn(
        "mt-3 ml-4 w-[calc(100%-32px)] min-h-14 overflow-hidden border border-slate-200/60 bg-gradient-to-r from-white/95 via-slate-50/80 to-slate-100/65 px-4 py-2 shadow-[0_16px_40px_-32px_rgba(30,64,175,0.25)] ring-1 ring-slate-900/5 backdrop-blur-md dark:border-slate-800/60 dark:bg-gradient-to-r dark:from-slate-950 dark:via-slate-900/85 dark:to-slate-950 dark:shadow-[0_22px_50px_-34px_rgba(15,23,42,0.7)] dark:ring-slate-900/80",
        classNames?.wrapper
      )}
    >
      <span className="pointer-events-none absolute inset-x-6 -top-16 h-32 rounded-full bg-gradient-to-r from-blue-500/20 via-sky-400/18 to-cyan-300/18 blur-3xl dark:from-sky-600/12 dark:via-blue-500/10 dark:to-indigo-500/10" />

      <Group
        justify="space-between"
        align="center"
        gap="lg"
        wrap="nowrap"
        className="relative"
      >
        {title && (
          <Flex gap={2} className="min-w-0 flex-1 gap-3 items-center">
            {showBackButton && (
              <Box
                onClick={handleBack}
                className="w-9 h-9 mr-3 flex items-center justify-center cursor-pointer bg-gray-300/50 dark:bg-gray-700/50 rounded-md mb-1"
              >
                <BiChevronLeft className="text-gray-500 w-6 h-6" />
              </Box>
            )}
            <Title
              order={2}
              className={cn(
                "truncate text-xl font-semibold text-slate-800 dark:text-slate-100 sm:text-2xl leading-none",
                classNames?.title
              )}
            >
              {title}
            </Title>
          </Flex>
        )}

        {children && (
          <Group
            gap="sm"
            justify="flex-end"
            wrap="wrap"
            className={cn("flex-1", classNames?.rightBox)}
          >
            {children}
          </Group>
        )}
      </Group>
    </Paper>
  );
};
