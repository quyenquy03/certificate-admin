import { BaseResponseType } from "@/types";

export const surfaceClasses =
  "border border-slate-200/70 bg-white/95 dark:border-slate-800/80 dark:bg-slate-900/85";

type Extractable<T> =
  | BaseResponseType<T | T[] | undefined>
  | BaseResponseType<T[]>
  | T[]
  | T
  | undefined;

export const extractData = <T,>(response: Extractable<T>): T[] | T | undefined => {
  if (!response) return undefined;
  return (
    (response as BaseResponseType<T | T[] | undefined>)?.data ??
    (response as any)?.data ??
    response
  );
};

export const getTotalFromResponse = <T,>(response: Extractable<T>): number => {
  if (!response) return 0;

  const pagination = (response as BaseResponseType<T[]>)?.pagination;
  if (pagination?.totalPage) return pagination.totalPage;

  const data = extractData<T>(response);
  return Array.isArray(data) ? data.length : 0;
};
