import { certificateApis } from "@/apis";
import {
  BaseResponseType,
  CertificateCategoryType,
  CertificateCategoryRequestType,
} from "@/types";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export const useUpdateCertificateType = (
  option?: UseMutationOptions<
    BaseResponseType<CertificateCategoryType>,
    AxiosError,
    CertificateCategoryRequestType,
    unknown
  >
) => {
  const mutationFn = async (data: CertificateCategoryRequestType) => {
    const response = await certificateApis.updateCertificateType(data);
    return response;
  };

  return useMutation({
    mutationFn,
    ...option,
  });
};
