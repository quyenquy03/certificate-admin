import { authApis } from "@/apis";
import { BaseResponseType, LoginRequestType, LoginResponseType } from "@/types";
import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export const useLoginCredential = (
  option?: UseMutationOptions<
    BaseResponseType<LoginResponseType>,
    AxiosError,
    LoginRequestType,
    unknown
  >
) => {
  const mutationFn = async (data: LoginRequestType) => {
    const response = await authApis.login(data);
    return response;
  };

  return useMutation({
    mutationFn,
    ...option,
  });
};
