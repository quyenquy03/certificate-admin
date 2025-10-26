import { userApis } from "@/apis";
import {
  BaseResponseType,
  UpdateUserRequestType,
  UserResponseType,
} from "@/types";
import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export const useUpdateUser = (
  option?: UseMutationOptions<
    BaseResponseType<UserResponseType>,
    AxiosError,
    UpdateUserRequestType,
    unknown
  >
) => {
  const mutationFn = async (data: UpdateUserRequestType) => {
    const response = await userApis.updateUser(data);
    return response;
  };

  return useMutation({
    mutationFn,
    ...option,
  });
};
