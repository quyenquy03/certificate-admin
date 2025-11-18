import { organizationApis } from "@/apis";
import { BaseResponseType, RegistrationResponseType } from "@/types";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export const useApproveRegistration = (
  option?: UseMutationOptions<
    BaseResponseType<RegistrationResponseType>,
    AxiosError,
    string,
    unknown
  >
) => {
  const mutationFn = async (id: string) => {
    const response = await organizationApis.approveRegistration(id);
    return response;
  };

  return useMutation({
    mutationFn,
    ...option,
  });
};
