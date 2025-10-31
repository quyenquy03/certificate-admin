import { cn } from "@/helpers";
import { Box, Pagination, PaginationProps } from "@mantine/core";

type PaginationCustomProps = {
  customClassNames?: {
    paginationWrapper?: string;
    paginationBox?: string;
    spaceBox?: string;
  };
} & PaginationProps;

export const PaginationCustom = ({
  classNames,
  customClassNames,
  ...args
}: PaginationCustomProps) => {
  return (
    <>
      <Box
        className={cn(
          "absolute bottom-4 left-0 w-full flex justify-center items-center opacity-40 hover:opacity-100 transition-all duration-700",
          customClassNames?.paginationWrapper
        )}
      >
        <Box
          className={cn(
            "w-full max-w-[400px] shadow-lg bg-background-secondary-light p-2 flex items-center justify-center rounded-full",
            customClassNames?.paginationBox
          )}
        >
          <Pagination
            classNames={{
              ...classNames,
              dots: cn("text-color-light"),
            }}
            size={"sm"}
            {...args}
          />
        </Box>
      </Box>
      <Box className={cn("h-14", customClassNames?.spaceBox)}></Box>
    </>
  );
};
