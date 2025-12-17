import { QUERY_KEYS, QUERY_TIMES } from "@/constants";
import { certificateApis } from "@/apis";
import { BaseResponseType, CertificateResponseType } from "@/types";
import { QueryKey, useQuery, UseQueryOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const useQueryGetCertificate = (
  id: string,
  options?: UseQueryOptions<
    unknown,
    AxiosError,
    BaseResponseType<CertificateResponseType>,
    QueryKey
  >
) => {
  const queryKey = [QUERY_KEYS.GET_CERTIFICATE, id];

  const queryFn = async () => {
    return await certificateApis.getCertificate(id);
  };

  return useQuery({
    queryKey,
    queryFn,
    retry: 1,
    staleTime: QUERY_TIMES.STALE_TIME.GET_CERTIFICATE,
    gcTime: QUERY_TIMES.GC_TIME.GET_CERTIFICATE,
    refetchOnWindowFocus: false,
    enabled: Boolean(id),
    ...options,
  });
};
