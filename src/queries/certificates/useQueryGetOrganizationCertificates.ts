import { QueryKey, useQuery, UseQueryOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { QUERY_KEYS, QUERY_TIMES } from "@/constants";
import {
  BaseResponseType,
  CertificateResponseType,
  GetOrganizationCertificatesParams,
} from "@/types";
import { certificateApis } from "@/apis";

export const useQueryGetOrganizationCertificates = (
  params: GetOrganizationCertificatesParams,
  options?: UseQueryOptions<
    unknown,
    AxiosError,
    BaseResponseType<CertificateResponseType[]>,
    QueryKey
  >
) => {
  const queryKey = [QUERY_KEYS.GET_ORGANIZATION_CERTIFICATES, params];

  const queryFn = async () => {
    return await certificateApis.getOrganizationCertificates(params.id, params);
  };

  return useQuery({
    queryKey,
    queryFn,
    retry: 1,
    staleTime: QUERY_TIMES.STALE_TIME.GET_ORGANIZATION_CERTIFICATES,
    gcTime: QUERY_TIMES.GC_TIME.GET_ORGANIZATION_CERTIFICATES,
    refetchOnWindowFocus: false,
    enabled: true,
    ...options,
  });
};
