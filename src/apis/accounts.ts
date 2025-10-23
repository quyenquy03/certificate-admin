import { API_ROUTES, AXIOS_METHOD } from "@/constants";
import axiosClient from "@/libs/axiosClient";
import {
  BaseResponseType,
  ChangePasswordRequestType,
  UpdateProfileRequestType,
  UserResponseType,
} from "@/types";

const getMyProfile = async (): Promise<BaseResponseType<UserResponseType>> => {
  const response = await axiosClient<BaseResponseType<UserResponseType>>({
    method: AXIOS_METHOD.GET,
    url: API_ROUTES.GET_MY_PROFILE,
  });
  return response.data;
};

const updateProfile = async (
  data: UpdateProfileRequestType
): Promise<BaseResponseType<UserResponseType>> => {
  const response = await axiosClient<BaseResponseType<UserResponseType>>({
    method: AXIOS_METHOD.PUT,
    url: API_ROUTES.UPDATE_PROFILE,
    data,
  });
  return response.data;
};

const changePassword = async (
  data: ChangePasswordRequestType
): Promise<BaseResponseType<UserResponseType>> => {
  const response = await axiosClient<BaseResponseType<UserResponseType>>({
    method: "PUT",
    url: API_ROUTES.CHANGE_PASSWORD,
    data,
  });
  return response.data;
};

export const accountApis = {
  getMyProfile,
  updateProfile,
  changePassword,
};
