import { organizationApis } from "@/apis";
import {
  AddOrganizationMemberRequestType,
  BaseResponseType,
  OrganizationMemberResponseType,
} from "@/types";
import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export const useAddOrganizationMember = (
  option?: UseMutationOptions<
    BaseResponseType<OrganizationMemberResponseType>,
    AxiosError,
    AddOrganizationMemberRequestType,
    unknown
  >
) => {
  const mutationFn = async (data: AddOrganizationMemberRequestType) => {
    const response = await organizationApis.addOrganizationMember(data);
    return response;
  };

  return useMutation({
    mutationFn,
    ...option,
  });
};
