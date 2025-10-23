import { accountApis } from "@/apis";
import {
  BaseResponseType,
  ChangePasswordRequestType,
  UserResponseType,
} from "@/types";
import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export const useChangePassword = (
  option?: UseMutationOptions<
    BaseResponseType<UserResponseType>,
    AxiosError,
    ChangePasswordRequestType,
    unknown
  >
) => {
  const mutationFn = async (data: ChangePasswordRequestType) => {
    const response = await accountApis.changePassword(data);
    return response;
  };

  return useMutation({
    mutationFn,
    ...option,
  });
};
