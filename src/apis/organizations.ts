import { API_ROUTES, AXIOS_METHOD } from "@/constants";
import axiosClient from "@/libs/axiosClient";
import {
  BasePaginationParams,
  BaseResponseType,
  OrganizationResponseType,
  RegisterOrganizationRequestType,
  RejectOrganizationRequestType,
} from "@/types";

const getRegistration = async (
  id: string
): Promise<BaseResponseType<OrganizationResponseType>> => {
  const response = await axiosClient<
    BaseResponseType<OrganizationResponseType>
  >({
    method: AXIOS_METHOD.GET,
    url: API_ROUTES.GET_ORGANIZATION_REGISTRATION + "/" + id,
  });
  return response.data;
};

const registerOrganization = async (
  data: RegisterOrganizationRequestType
): Promise<BaseResponseType<OrganizationResponseType>> => {
  const response = await axiosClient<
    BaseResponseType<OrganizationResponseType>
  >({
    method: AXIOS_METHOD.POST,
    url: API_ROUTES.REGISTER_ORGANIZATION,
    data,
  });
  return response.data;
};

const getOrganizations = async (
  data?: BasePaginationParams
): Promise<BaseResponseType<OrganizationResponseType[]>> => {
  const response = await axiosClient<
    BaseResponseType<OrganizationResponseType[]>
  >({
    method: AXIOS_METHOD.POST,
    url: API_ROUTES.GET_ORGANIZATIONS,
    data,
  });
  return response.data;
};

const getMyOrganizations = async (
  data?: BasePaginationParams
): Promise<BaseResponseType<OrganizationResponseType[]>> => {
  const response = await axiosClient<
    BaseResponseType<OrganizationResponseType[]>
  >({
    method: AXIOS_METHOD.POST,
    url: API_ROUTES.GET_MY_ORGANIZATION,
    data,
  });
  return response.data;
};

const getRegistrations = async (
  data?: BasePaginationParams
): Promise<BaseResponseType<OrganizationResponseType[]>> => {
  const response = await axiosClient<
    BaseResponseType<OrganizationResponseType[]>
  >({
    method: AXIOS_METHOD.POST,
    url: API_ROUTES.GET_ORGANIZATION_REGISTRATIONS,
    data,
  });
  return response.data;
};

const approveRegistration = async (
  id: string
): Promise<BaseResponseType<OrganizationResponseType>> => {
  const response = await axiosClient<
    BaseResponseType<OrganizationResponseType>
  >({
    method: AXIOS_METHOD.PUT,
    url: API_ROUTES.APPROVE_REGISTRATION(id),
  });
  return response.data;
};

const rejectRegistration = async (
  data: RejectOrganizationRequestType
): Promise<BaseResponseType<OrganizationResponseType>> => {
  const response = await axiosClient<
    BaseResponseType<OrganizationResponseType>
  >({
    method: AXIOS_METHOD.PUT,
    url: API_ROUTES.REJECT_REGISTRATION(data.id),
    data,
  });
  return response.data;
};

export const organizationApis = {
  registerOrganization,
  getRegistration,
  getOrganizations,
  getMyOrganizations,
  getRegistrations,
  approveRegistration,
  rejectRegistration,
};
