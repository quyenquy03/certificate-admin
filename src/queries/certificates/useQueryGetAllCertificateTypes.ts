import { QueryKey, useQuery, UseQueryOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { QUERY_KEYS, QUERY_TIMES } from "@/constants";
import {
  BasePaginationParams,
  BaseResponseType,
  CertificateCategoryType,
} from "@/types";
import { certificateApis } from "@/apis";

export const useQueryGetAllCertificateTypes = (
  params?: BasePaginationParams,
  options?: UseQueryOptions<
    unknown,
    AxiosError,
    BaseResponseType<CertificateCategoryType[]>,
    QueryKey
  >
) => {
  const queryKey = [QUERY_KEYS.GET_ALL_CERTIFICATE_TYPES];

  const queryFn = async () => {
    return await certificateApis.getCertificateTypes(params);
  };

  return useQuery({
    queryKey,
    queryFn,
    retry: 1,
    staleTime: QUERY_TIMES.STALE_TIME.GET_ALL_CERTIFICATE_TYPES,
    gcTime: QUERY_TIMES.GC_TIME.GET_ALL_CERTIFICATE_TYPES,
    refetchOnWindowFocus: false,
    enabled: false,
    ...options,
  });
};
