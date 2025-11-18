import { organizationApis } from "@/apis";
import {
  BaseResponseType,
  RegistrationResponseType,
  RegisterOrganizationRequestType,
} from "@/types";
import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export const useRegisterOrganization = (
  option?: UseMutationOptions<
    BaseResponseType<RegistrationResponseType>,
    AxiosError,
    RegisterOrganizationRequestType,
    unknown
  >
) => {
  const mutationFn = async (data: RegisterOrganizationRequestType) => {
    const response = await organizationApis.registerOrganization(data);
    return response;
  };

  return useMutation({
    mutationFn,
    ...option,
  });
};
