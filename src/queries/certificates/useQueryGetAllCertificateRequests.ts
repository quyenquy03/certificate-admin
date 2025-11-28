import { QueryKey, useQuery, UseQueryOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { QUERY_KEYS, QUERY_TIMES } from "@/constants";
import {
  BasePaginationParams,
  BaseResponseType,
  CertificateRequestType,
} from "@/types";
import { certificateApis } from "@/apis";

export const useQueryGetAllCertificateRequests = (
  params?: BasePaginationParams,
  options?: UseQueryOptions<
    unknown,
    AxiosError,
    BaseResponseType<CertificateRequestType[]>,
    QueryKey
  >
) => {
  const queryKey = [QUERY_KEYS.GET_CERTIFICATE_REQUESTS];

  const queryFn = async () => {
    return await certificateApis.getAllCertificateRequests(params);
  };

  return useQuery({
    queryKey,
    queryFn,
    retry: 1,
    staleTime: QUERY_TIMES.STALE_TIME.GET_CERTIFICATE_REQUESTS,
    gcTime: QUERY_TIMES.GC_TIME.GET_CERTIFICATE_REQUESTS,
    refetchOnWindowFocus: false,
    enabled: true,
    ...options,
  });
};
