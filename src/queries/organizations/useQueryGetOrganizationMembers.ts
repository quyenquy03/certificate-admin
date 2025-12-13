import { QueryKey, useQuery, UseQueryOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { QUERY_KEYS, QUERY_TIMES } from "@/constants";
import {
  BaseResponseType,
  GetOrganizationMembersParams,
  OrganizationMemberResponseType,
} from "@/types";
import { organizationApis } from "@/apis";

export const useQueryGetOrganizationMembers = (
  params: GetOrganizationMembersParams,
  options?: UseQueryOptions<
    unknown,
    AxiosError,
    BaseResponseType<OrganizationMemberResponseType[]>,
    QueryKey
  >
) => {
  const queryKey = [QUERY_KEYS.GET_ORGANIZATION_MEMBERS];

  const queryFn = async () => {
    return await organizationApis.getOrganizationMembers(
      params.organizationId,
      params
    );
  };

  return useQuery({
    queryKey,
    queryFn,
    retry: 1,
    staleTime: QUERY_TIMES.STALE_TIME.GET_ORGANIZATION_MEMBERS,
    gcTime: QUERY_TIMES.GC_TIME.GET_ORGANIZATION_MEMBERS,
    refetchOnWindowFocus: false,
    enabled: Boolean(params.organizationId),
    ...options,
  });
};
