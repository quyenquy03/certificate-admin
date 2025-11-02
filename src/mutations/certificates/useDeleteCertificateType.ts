import { certificateApis } from "@/apis";
import { BaseResponseType, CertificateCategoryType } from "@/types";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export const useDeleteCertificateType = (
  option?: UseMutationOptions<
    BaseResponseType<CertificateCategoryType>,
    AxiosError,
    string,
    unknown
  >
) => {
  const mutationFn = async (id: string) => {
    const response = await certificateApis.deleteCertificateType(id);
    return response;
  };

  return useMutation({
    mutationFn,
    ...option,
  });
};
