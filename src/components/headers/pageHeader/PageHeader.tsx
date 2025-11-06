import { cn } from "@/helpers";
import { Group, Paper, Stack, Title } from "@mantine/core";
import { ReactNode } from "react";

type PageHeaderProps = {
  children?: ReactNode;
  title?: string;
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
}: PageHeaderProps) => {
  return (
    <Paper
      withBorder
      radius="lg"
      shadow="sm"
      className={cn(
        "sticky top-2 z-30 ml-4 w-[calc(100%-48px)] overflow-hidden border border-slate-200/60 bg-gradient-to-r from-white/95 via-slate-50/80 to-slate-100/65 px-4 py-2 shadow-[0_16px_40px_-32px_rgba(30,64,175,0.25)] ring-1 ring-slate-900/5 backdrop-blur-md dark:border-slate-800/60 dark:bg-gradient-to-r dark:from-slate-950 dark:via-slate-900/85 dark:to-slate-950 dark:shadow-[0_22px_50px_-34px_rgba(15,23,42,0.7)] dark:ring-slate-900/80",
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
          <Stack gap={2} className="min-w-0 flex-1">
            <Title
              order={2}
              className={cn(
                "truncate text-xl font-semibold text-slate-800 dark:text-slate-100 sm:text-2xl",
                classNames?.title
              )}
            >
              {title}
            </Title>
          </Stack>
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
