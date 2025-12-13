import { certificateApis } from "@/apis";
import {
  BaseResponseType,
  CertificateResponseType,
} from "@/types";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export const useApproveCertificate = (
  option?: UseMutationOptions<
    BaseResponseType<CertificateResponseType>,
    AxiosError,
    string,
    unknown
  >
) => {
  const mutationFn = async (id: string) => {
    const response = await certificateApis.approveCertificate(id);
    return response;
  };

  return useMutation({
    mutationFn,
    ...option,
  });
};
