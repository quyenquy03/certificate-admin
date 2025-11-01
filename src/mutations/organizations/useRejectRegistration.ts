import { organizationApis } from "@/apis";
import {
  BaseResponseType,
  OrganizationResponseType,
  RejectOrganizationRequestType,
} from "@/types";
import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export const useRejectRegistration = (
  option?: UseMutationOptions<
    BaseResponseType<OrganizationResponseType>,
    AxiosError,
    RejectOrganizationRequestType,
    unknown
  >
) => {
  const mutationFn = async (data: RejectOrganizationRequestType) => {
    const response = await organizationApis.rejectRegistration(data);
    return response;
  };

  return useMutation({
    mutationFn,
    ...option,
  });
};
