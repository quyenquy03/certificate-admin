import { certificateApis } from "@/apis";
import {
  BaseResponseType,
  CertificateResponseType,
  RevokeCertificateRequestType,
} from "@/types";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import type { AxiosError } from "axios";

type RevokePayload = {
  id: string;
  data: RevokeCertificateRequestType;
};

export const useRevokeCertificate = (
  option?: UseMutationOptions<
    BaseResponseType<CertificateResponseType>,
    AxiosError,
    RevokePayload,
    unknown
  >
) => {
  const mutationFn = async ({ id, data }: RevokePayload) => {
    const response = await certificateApis.revokeCertificate(id, data);
    return response;
  };

  return useMutation({
    mutationFn,
    ...option,
  });
};
