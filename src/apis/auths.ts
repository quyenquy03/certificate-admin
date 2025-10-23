import { API_ROUTES } from "@/constants";
import axiosClient from "@/libs/axiosClient";
import { BaseResponseType, LoginRequestType, LoginResponseType } from "@/types";

const login = async (
  data: LoginRequestType
): Promise<BaseResponseType<LoginResponseType>> => {
  const response = await axiosClient<BaseResponseType<LoginResponseType>>({
    method: "POST",
    url: API_ROUTES.LOGIN,
    data,
  });
  return response.data;
};

export const authApis = {
  login,
};
