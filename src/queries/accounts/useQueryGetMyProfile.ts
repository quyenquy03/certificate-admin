import { QueryKey, useQuery, UseQueryOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { QUERY_KEYS, QUERY_TIMES } from "@/constants";
import { BaseResponseType, UserResponseType } from "@/types";
import { accountApis } from "@/apis";

export const useQueryGetMyProfile = (
  options?: UseQueryOptions<
    unknown,
    AxiosError,
    BaseResponseType<UserResponseType>,
    QueryKey
  >
) => {
  const queryKey = [QUERY_KEYS.GET_MY_PROFILE];

  const queryFn = async () => {
    return await accountApis.getMyProfile();
  };

  return useQuery({
    queryKey,
    queryFn,
    retry: 1,
    staleTime: QUERY_TIMES.STALE_TIME.GET_MY_PROFILE,
    gcTime: QUERY_TIMES.GC_TIME.GET_MY_PROFILE,
    refetchOnWindowFocus: false,
    enabled: false,
    ...options,
  });
};
