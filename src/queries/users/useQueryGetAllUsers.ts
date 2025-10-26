import { QueryKey, useQuery, UseQueryOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { QUERY_KEYS, QUERY_TIMES } from "@/constants";
import {
  BasePaginationParams,
  BaseResponseType,
  UserResponseType,
} from "@/types";
import { userApis } from "@/apis";

export const useQueryGetAllUsers = (
  params?: BasePaginationParams,
  options?: UseQueryOptions<
    unknown,
    AxiosError,
    BaseResponseType<UserResponseType[]>,
    QueryKey
  >
) => {
  const queryKey = [QUERY_KEYS.GET_ALL_USERS];

  const queryFn = async () => {
    return await userApis.getAllUsers(params);
  };

  return useQuery({
    queryKey,
    queryFn,
    retry: 1,
    staleTime: QUERY_TIMES.STALE_TIME.GET_ALL_USERS,
    gcTime: QUERY_TIMES.GC_TIME.GET_ALL_USERS,
    refetchOnWindowFocus: false,
    enabled: false,
    ...options,
  });
};
