import { QueryKey, useQuery, UseQueryOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { QUERY_KEYS, QUERY_TIMES } from "@/constants";
import { BaseResponseType, OrganizationResponseType } from "@/types";
import { organizationApis } from "@/apis";

export const useQueryGetOrganization = (
  organizationId: string,
  options?: UseQueryOptions<
    unknown,
    AxiosError,
    BaseResponseType<OrganizationResponseType>,
    QueryKey
  >
) => {
  const queryKey = [QUERY_KEYS.GET_ORGANIZATION, organizationId];

  const queryFn = async () => {
    return await organizationApis.getOrganization(organizationId);
  };

  return useQuery({
    queryKey,
    queryFn,
    retry: 1,
    staleTime: QUERY_TIMES.STALE_TIME.GET_ORGANIZATION,
    gcTime: QUERY_TIMES.GC_TIME.GET_ORGANIZATION,
    refetchOnWindowFocus: false,
    enabled: true,
    ...options,
  });
};
