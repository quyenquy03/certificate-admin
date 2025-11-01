import { organizationApis } from "@/apis";
import {
  BaseResponseType,
  OrganizationResponseType,
  RegisterOrganizationRequestType,
} from "@/types";
import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export const useRegisterOrganization = (
  option?: UseMutationOptions<
    BaseResponseType<OrganizationResponseType>,
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
