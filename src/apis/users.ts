import { API_ROUTES, AXIOS_METHOD } from "@/constants";
import axiosClient from "@/libs/axiosClient";
import {
  BasePaginationParams,
  BaseResponseType,
  UpdateUserRequestType,
  UserRequestType,
  UserResponseType,
} from "@/types";

const getAllUsers = async (
  params?: BasePaginationParams
): Promise<BaseResponseType<UserResponseType[]>> => {
  const response = await axiosClient<BaseResponseType<UserResponseType[]>>({
    method: AXIOS_METHOD.GET,
    url: API_ROUTES.GET_USERS,
    params,
  });
  return response.data;
};

const getUserById = async (
  userId: string
): Promise<BaseResponseType<UserResponseType>> => {
  const response = await axiosClient<BaseResponseType<UserResponseType>>({
    method: AXIOS_METHOD.GET,
    url: API_ROUTES.GET_USER + "/" + userId,
  });
  return response.data;
};

const getDeletedUsers = async (
  params?: BasePaginationParams
): Promise<BaseResponseType<UserResponseType[]>> => {
  const response = await axiosClient<BaseResponseType<UserResponseType[]>>({
    method: AXIOS_METHOD.GET,
    url: API_ROUTES.GET_DELETED_USERS,
    params,
  });
  return response.data;
};

const restoreUser = async (
  userId: string
): Promise<BaseResponseType<UserResponseType>> => {
  const response = await axiosClient<BaseResponseType<UserResponseType>>({
    method: AXIOS_METHOD.PATCH,
    url: API_ROUTES.RESTORE_USER + "/" + userId,
  });
  return response.data;
};

const resetPassword = async (
  userId: string
): Promise<BaseResponseType<UserResponseType>> => {
  const response = await axiosClient<BaseResponseType<UserResponseType>>({
    method: AXIOS_METHOD.PATCH,
    url: API_ROUTES.RESET_PASSWORD + "/" + userId,
  });
  return response.data;
};

const updateUser = async (
  data: UpdateUserRequestType
): Promise<BaseResponseType<UserResponseType>> => {
  const response = await axiosClient<BaseResponseType<UserResponseType>>({
    method: AXIOS_METHOD.PUT,
    url: API_ROUTES.UPDATE_USER + "/" + data.id,
    data,
  });
  return response.data;
};

const createUser = async (
  data: UserRequestType
): Promise<BaseResponseType<UserResponseType>> => {
  const response = await axiosClient<BaseResponseType<UserResponseType>>({
    method: AXIOS_METHOD.POST,
    url: API_ROUTES.CREATE_NEW_USER,
    data,
  });
  return response.data;
};

const deleteUser = async (
  userId: string
): Promise<BaseResponseType<UserResponseType>> => {
  const response = await axiosClient<BaseResponseType<UserResponseType>>({
    method: AXIOS_METHOD.DELETE,
    url: API_ROUTES.DELETE_USER + "/" + userId,
  });
  return response.data;
};

export const userApis = {
  getAllUsers,
  getUserById,
  getDeletedUsers,
  restoreUser,
  resetPassword,
  updateUser,
  createUser,
  deleteUser,
};
