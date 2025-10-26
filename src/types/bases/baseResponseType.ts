import { BasePaginationResponse } from "./basePaginations";

export type BaseResponseType<T> = {
  data: T;
  errorCode: string | null;
  isSuccess: boolean;
  statusCode: number;
  pagination?: BasePaginationResponse;
};
