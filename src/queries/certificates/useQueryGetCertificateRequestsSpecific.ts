import { QueryKey, useQuery, UseQueryOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { QUERY_KEYS, QUERY_TIMES } from "@/constants";
import {
  BasePaginationParams,
  BaseResponseType,
  CertificateRequestType,
  GetCertificateRequestSpecificParams,
} from "@/types";
import { certificateApis } from "@/apis";

export const useQueryGetAllCertificateRequestsSpecific = (
  params: GetCertificateRequestSpecificParams,
  options?: UseQueryOptions<
    unknown,
    AxiosError,
    BaseResponseType<CertificateRequestType[]>,
    QueryKey
  >
) => {
  const queryKey = [QUERY_KEYS.GET_CERTIFICATE_REQUESTS];

  const queryFn = async () => {
    return await certificateApis.getCertificateRequestsSpecific(
      params.id,
      params
    );
  };

  return useQuery({
    queryKey,
    queryFn,
    retry: 1,
    staleTime: QUERY_TIMES.STALE_TIME.GET_CERTIFICATE_REQUESTS,
    gcTime: QUERY_TIMES.GC_TIME.GET_CERTIFICATE_REQUESTS,
    refetchOnWindowFocus: false,
    enabled: false,
    ...options,
  });
};
