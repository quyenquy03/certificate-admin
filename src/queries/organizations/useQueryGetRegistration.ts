import { QueryKey, useQuery, UseQueryOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { organizationApis } from "@/apis";
import { QUERY_KEYS, QUERY_TIMES } from "@/constants";
import { BaseResponseType, OrganizationResponseType } from "@/types";

export const useQueryGetRegistration = (
  id?: string,
  options?: UseQueryOptions<
    BaseResponseType<OrganizationResponseType>,
    AxiosError,
    BaseResponseType<OrganizationResponseType>,
    QueryKey
  >
) => {
  const queryKey: QueryKey = [QUERY_KEYS.GET_REGISTRATION_BY_ID, id];

  const queryFn = async () => {
    if (!id) {
      throw new Error("Registration id is required");
    }
    return await organizationApis.getRegistration(id);
  };

  return useQuery({
    queryKey,
    queryFn,
    retry: 1,
    staleTime: QUERY_TIMES.STALE_TIME.GET_REGISTRATION_BY_ID,
    gcTime: QUERY_TIMES.GC_TIME.GET_REGISTRATION_BY_ID,
    refetchOnWindowFocus: false,
    enabled: !!id,
    ...options,
  });
};
