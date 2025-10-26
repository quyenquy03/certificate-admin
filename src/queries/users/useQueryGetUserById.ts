import { QueryKey, useQuery, UseQueryOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { QUERY_KEYS, QUERY_TIMES } from "@/constants";
import { BaseResponseType, UserResponseType } from "@/types";
import { userApis } from "@/apis";

export const useQueryGetUserById = (
  userId: string,
  options?: UseQueryOptions<
    unknown,
    AxiosError,
    BaseResponseType<UserResponseType>,
    QueryKey
  >
) => {
  const queryKey = [QUERY_KEYS.GET_USER_BY_ID];

  const queryFn = async () => {
    return await userApis.getUserById(userId);
  };

  return useQuery({
    queryKey,
    queryFn,
    retry: 1,
    staleTime: QUERY_TIMES.STALE_TIME.GET_USER_BY_ID,
    gcTime: QUERY_TIMES.GC_TIME.GET_USER_BY_ID,
    refetchOnWindowFocus: false,
    enabled: false,
    ...options,
  });
};
