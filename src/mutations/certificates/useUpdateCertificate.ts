import { certificateApis } from "@/apis";
import {
  BaseResponseType,
  CertificateResponseType,
  CreateEditCertificateRequestType,
} from "@/types";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export const useUpdateCertificate = (
  option?: UseMutationOptions<
    BaseResponseType<CertificateResponseType>,
    AxiosError,
    CreateEditCertificateRequestType,
    unknown
  >
) => {
  const mutationFn = async (data: CreateEditCertificateRequestType) => {
    const response = await certificateApis.updateCertificate(data);
    return response;
  };

  return useMutation({
    mutationFn,
    ...option,
  });
};
