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
  CreateCertificateCategoryType,
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
  data: CreateCertificateCategoryType
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

export const certificateApis = {
  getCertificateType,
  getCertificateTypes,
  createCertificateType,
};
