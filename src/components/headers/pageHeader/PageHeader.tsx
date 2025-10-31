import { cn } from "@/helpers";
import { Flex, Text } from "@mantine/core";
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
    <Flex
      justify="space-between"
      align="center"
      gap={8}
      className={cn(
        "bg-background-primary-light dark:bg-background-primary-dark w-full min-h-14 px-5 py-2 shadow-md dark:shadow-gray-600",
        classNames?.wrapper
      )}
    >
      <Text
        className={cn(
          "text-color-light dark:text-color-dark",
          classNames?.title
        )}
        fw={600}
        size="xl"
      >
        {title}
      </Text>
      {children && (
        <Flex
          justify="end"
          align="center"
          className={classNames?.rightBox}
          gap={12}
          flex={1}
        >
          {children}
        </Flex>
      )}
    </Flex>
  );
};
