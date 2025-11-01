import { certificateApis } from "@/apis";
import {
  BaseResponseType,
  CertificateCategoryType,
  CreateCertificateCategoryType,
} from "@/types";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export const useCreateCertificateType = (
  option?: UseMutationOptions<
    BaseResponseType<CertificateCategoryType>,
    AxiosError,
    CreateCertificateCategoryType,
    unknown
  >
) => {
  const mutationFn = async (data: CreateCertificateCategoryType) => {
    const response = await certificateApis.createCertificateType(data);
    return response;
  };

  return useMutation({
    mutationFn,
    ...option,
  });
};
