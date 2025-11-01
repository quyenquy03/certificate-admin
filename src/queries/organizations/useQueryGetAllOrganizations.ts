import { QueryKey, useQuery, UseQueryOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { QUERY_KEYS, QUERY_TIMES } from "@/constants";
import {
  BasePaginationParams,
  BaseResponseType,
  OrganizationResponseType,
} from "@/types";
import { organizationApis } from "@/apis";

export const useQueryGetAllOrganizations = (
  params?: BasePaginationParams,
  options?: UseQueryOptions<
    unknown,
    AxiosError,
    BaseResponseType<OrganizationResponseType[]>,
    QueryKey
  >
) => {
  const queryKey = [QUERY_KEYS.GET_ALL_ORGANIZATIONS];

  const queryFn = async () => {
    return await organizationApis.getOrganizations(params);
  };

  return useQuery({
    queryKey,
    queryFn,
    retry: 1,
    staleTime: QUERY_TIMES.STALE_TIME.GET_ALL_ORGANIZATIONS,
    gcTime: QUERY_TIMES.GC_TIME.GET_ALL_ORGANIZATIONS,
    refetchOnWindowFocus: false,
    enabled: false,
    ...options,
  });
};
