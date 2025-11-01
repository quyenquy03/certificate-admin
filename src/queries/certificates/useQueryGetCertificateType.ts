import { QueryKey, useQuery, UseQueryOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { QUERY_KEYS, QUERY_TIMES } from "@/constants";
import { BaseResponseType, CertificateCategoryType } from "@/types";
import { certificateApis } from "@/apis";

export const useQueryGetCertificateType = (
  id: string,
  options?: UseQueryOptions<
    unknown,
    AxiosError,
    BaseResponseType<CertificateCategoryType[]>,
    QueryKey
  >
) => {
  const queryKey = [QUERY_KEYS.GET_CERTIFICATE_TYPE];

  const queryFn = async () => {
    return await certificateApis.getCertificateType(id);
  };

  return useQuery({
    queryKey,
    queryFn,
    retry: 1,
    staleTime: QUERY_TIMES.STALE_TIME.GET_CERTIFICATE_TYPE,
    gcTime: QUERY_TIMES.GC_TIME.GET_CERTIFICATE_TYPE,
    refetchOnWindowFocus: false,
    enabled: false,
    ...options,
  });
};
