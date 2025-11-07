import { API_ROUTES, AXIOS_METHOD } from "@/constants";
import axiosClient from "@/libs/axiosClient";
import {
  BaseResponseType,
  UploadRequestType,
  UploadResponseType,
} from "@/types";
import axios from "axios";

const uploadAuthorImage = async (
  data: UploadRequestType
): Promise<BaseResponseType<UploadResponseType>> => {
  const response = await axiosClient<BaseResponseType<UploadResponseType>>({
    method: AXIOS_METHOD.POST,
    url: API_ROUTES.UPLOAD_AUTHOR_IMAGE,
    data,
  });

  return response.data;
};

const uploadProfileImage = async (
  data: UploadRequestType
): Promise<BaseResponseType<UploadResponseType>> => {
  const response = await axiosClient<BaseResponseType<UploadResponseType>>({
    method: AXIOS_METHOD.POST,
    url: API_ROUTES.UPLOAD_PROFILE_IMAGE,
    data,
  });

  return response.data;
};

const uploadAuthorDocument = async (
  data: UploadRequestType
): Promise<BaseResponseType<UploadResponseType>> => {
  const response = await axiosClient<BaseResponseType<UploadResponseType>>({
    method: AXIOS_METHOD.POST,
    url: API_ROUTES.UPLOAD_AUTHOR_DOCUMENT,
    data,
  });

  return response.data;
};

export const uploadApis = {
  uploadAuthorImage,
  uploadProfileImage,
  uploadAuthorDocument,
};
