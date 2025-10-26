import { userApis } from "@/apis";
import { BaseResponseType, UserResponseType } from "@/types";
import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export const useRestoreUser = (
  option?: UseMutationOptions<
    BaseResponseType<UserResponseType>,
    AxiosError,
    string,
    unknown
  >
) => {
  const mutationFn = async (userId: string) => {
    const response = await userApis.restoreUser(userId);
    return response;
  };

  return useMutation({
    mutationFn,
    ...option,
  });
};
