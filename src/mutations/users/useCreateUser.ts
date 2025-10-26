import { userApis } from "@/apis";
import { BaseResponseType, UserRequestType, UserResponseType } from "@/types";
import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export const useCreateUser = (
  option?: UseMutationOptions<
    BaseResponseType<UserResponseType>,
    AxiosError,
    UserRequestType,
    unknown
  >
) => {
  const mutationFn = async (data: UserRequestType) => {
    const response = await userApis.createUser(data);
    return response;
  };

  return useMutation({
    mutationFn,
    ...option,
  });
};
