import { API_ROUTES, AXIOS_METHOD } from "@/constants";
import axiosClient from "@/libs/axiosClient";
import {
  BasePaginationParams,
  BaseResponseType,
  OrganizationResponseType,
  RegisterOrganizationRequestType,
  RejectOrganizationRequestType,
} from "@/types";
import {
  CertificateCategoryType,
  CertificateCategoryRequestType,
} from "@/types/certificates";

const getCertificateTypes = async (
  params?: BasePaginationParams
): Promise<BaseResponseType<CertificateCategoryType[]>> => {
  const response = await axiosClient<
    BaseResponseType<CertificateCategoryType[]>
  >({
    method: AXIOS_METHOD.GET,
    url: API_ROUTES.GET_CERTIFICATE_TYPES,
    params,
  });
  return response.data;
};

const getCertificateType = async (
  id: string
): Promise<BaseResponseType<CertificateCategoryType>> => {
  const response = await axiosClient<BaseResponseType<CertificateCategoryType>>(
    {
      method: AXIOS_METHOD.GET,
      url: API_ROUTES.GET_CERTIFICATE_TYPE(id),
    }
  );
  return response.data;
};

const createCertificateType = async (
  data: CertificateCategoryRequestType
): Promise<BaseResponseType<CertificateCategoryType>> => {
  const response = await axiosClient<BaseResponseType<CertificateCategoryType>>(
    {
      method: AXIOS_METHOD.POST,
      url: API_ROUTES.CREATE_CERTIFICATE_TYPE,
      data,
    }
  );
  return response.data;
};

const deleteCertificateType = async (
  id: string
): Promise<BaseResponseType<CertificateCategoryType>> => {
  const response = await axiosClient<BaseResponseType<CertificateCategoryType>>(
    {
      method: AXIOS_METHOD.DELETE,
      url: API_ROUTES.DELETE_CERTIFICATE_TYPE(id),
    }
  );
  return response.data;
};

const updateCertificateType = async (
  data: CertificateCategoryRequestType
): Promise<BaseResponseType<CertificateCategoryType>> => {
  const response = await axiosClient<BaseResponseType<CertificateCategoryType>>(
    {
      method: AXIOS_METHOD.PUT,
      url: API_ROUTES.UPDATE_CERTIFICATE_TYPE(data?.id as string),
      data,
    }
  );
  return response.data;
};

const activateCertificateType = async (
  id: string
): Promise<BaseResponseType<CertificateCategoryType>> => {
  const response = await axiosClient<BaseResponseType<CertificateCategoryType>>(
    {
      method: AXIOS_METHOD.PUT,
      url: API_ROUTES.ACTIVATE_CERTIFICATE_TYPE(id),
    }
  );
  return response.data;
};

const deactivateCertificateType = async (
  id: string
): Promise<BaseResponseType<CertificateCategoryType>> => {
  const response = await axiosClient<BaseResponseType<CertificateCategoryType>>(
    {
      method: AXIOS_METHOD.PUT,
      url: API_ROUTES.DEACTIVATE_CERTIFICATE_TYPE(id),
    }
  );
  return response.data;
};

export const certificateApis = {
  getCertificateType,
  getCertificateTypes,
  createCertificateType,
  deleteCertificateType,
  updateCertificateType,
  activateCertificateType,
  deactivateCertificateType,
};
