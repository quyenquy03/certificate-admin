import { accountApis } from "@/apis";
import {
  BaseResponseType,
  UpdateProfileRequestType,
  UserResponseType,
} from "@/types";
import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export const useUpdateProfile = (
  option?: UseMutationOptions<
    BaseResponseType<UserResponseType>,
    AxiosError,
    UpdateProfileRequestType,
    unknown
  >
) => {
  const mutationFn = async (data: UpdateProfileRequestType) => {
    const response = await accountApis.updateProfile(data);
    return response;
  };

  return useMutation({
    mutationFn,
    ...option,
  });
};
