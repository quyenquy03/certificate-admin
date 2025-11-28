import { certificateApis } from "@/apis";
import {
  BaseResponseType,
  SubmitCertificateRequestType,
  CertificateRequestType,
} from "@/types";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export const useSubmitCertificateForVerify = (
  option?: UseMutationOptions<
    BaseResponseType<CertificateRequestType>,
    AxiosError,
    SubmitCertificateRequestType,
    unknown
  >
) => {
  const mutationFn = async (data: SubmitCertificateRequestType) => {
    const response = await certificateApis.submitCertificateToVerify(data);
    return response;
  };

  return useMutation({
    mutationFn,
    ...option,
  });
};
