import { API_ROUTES, AXIOS_METHOD, envs } from "@/constants";
import axiosClient from "@/libs/axiosClient";
import {
  BasePaginationParams,
  BaseResponseType,
  CertificateCategoryType,
  CertificateCategoryRequestType,
  CreateCertificateRequestType,
  CertificateResponseType,
  SubmitCertificateRequestType,
  CertificateRequestType,
  RejectCertificateRequestType,
  ImportCertificateRequestType,
  RevokeCertificateRequestType,
} from "@/types";
import axios from "axios";

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

const createCertificate = async (
  data: CreateCertificateRequestType
): Promise<BaseResponseType<CertificateResponseType>> => {
  const response = await axiosClient<BaseResponseType<CertificateResponseType>>(
    {
      method: AXIOS_METHOD.POST,
      url: API_ROUTES.CREATE_CERTIFICATE,
      data,
    }
  );
  return response.data;
};

const importCertificates = async (
  data: ImportCertificateRequestType
): Promise<BaseResponseType<CertificateResponseType>> => {
  const response = await axiosClient<BaseResponseType<CertificateResponseType>>(
    {
      method: AXIOS_METHOD.POST,
      url: API_ROUTES.IMPORT_CERTIFICATES,
      data,
    }
  );
  return response.data;
};

const getCertificates = async (
  data: BasePaginationParams
): Promise<BaseResponseType<CertificateResponseType[]>> => {
  const response = await axiosClient<
    BaseResponseType<CertificateResponseType[]>
  >({
    method: AXIOS_METHOD.POST,
    url: API_ROUTES.GET_CERTIFICATES,
    data,
  });
  return response.data;
};

const getOrganizationCertificates = async (
  organizationId: string,
  data: BasePaginationParams
): Promise<BaseResponseType<CertificateResponseType[]>> => {
  const response = await axiosClient<
    BaseResponseType<CertificateResponseType[]>
  >({
    method: AXIOS_METHOD.POST,
    url: API_ROUTES.GET_ORGANIZATIONS_CERTIFICATES(organizationId),
    data,
  });
  return response.data;
};

const getCertificateDetailOnBlockchain = async (ipfsHash: string) => {
  const response = await axios({
    method: AXIOS_METHOD.GET,
    url: `${envs.IPFS_URL}/ipfs/${ipfsHash}`,
  });
  return response.data;
};

const submitCertificateToVerify = async (
  data: SubmitCertificateRequestType
): Promise<BaseResponseType<CertificateRequestType>> => {
  const response = await axiosClient<BaseResponseType<CertificateRequestType>>({
    method: AXIOS_METHOD.POST,
    url: API_ROUTES.SUBMIT_CERTIFICATE_TO_VERIFY,
    data,
  });
  return response.data;
};

const getAllCertificateRequests = async (
  data?: BasePaginationParams
): Promise<BaseResponseType<CertificateRequestType[]>> => {
  const response = await axiosClient<
    BaseResponseType<CertificateRequestType[]>
  >({
    method: AXIOS_METHOD.POST,
    url: API_ROUTES.GET_CERTIFICATE_REQUESTS,
    data,
  });
  return response.data;
};

const getCertificateRequestsSpecific = async (
  id: string,
  data?: BasePaginationParams
): Promise<BaseResponseType<CertificateRequestType[]>> => {
  const response = await axiosClient<
    BaseResponseType<CertificateRequestType[]>
  >({
    method: AXIOS_METHOD.POST,
    url: API_ROUTES.GET_CERTIFICATE_REQUESTS_SPECIFIC(id),
    data,
  });
  return response.data;
};

const approveCertificateRequest = async (
  id: string
): Promise<BaseResponseType<CertificateRequestType>> => {
  const response = await axiosClient<BaseResponseType<CertificateRequestType>>({
    method: AXIOS_METHOD.PUT,
    url: API_ROUTES.APPROVE_CERTIFICATE_REQUEST(id),
  });
  return response.data;
};

const rejectCertificateRequest = async (
  id: string,
  data: RejectCertificateRequestType
): Promise<BaseResponseType<CertificateRequestType>> => {
  const response = await axiosClient<BaseResponseType<CertificateRequestType>>({
    method: AXIOS_METHOD.PUT,
    url: API_ROUTES.REJECT_CERTIFICATE_REQUEST(id),
    data,
  });
  return response.data;
};

const approveCertificate = async (
  id: string
): Promise<BaseResponseType<CertificateResponseType>> => {
  const response = await axiosClient<BaseResponseType<CertificateResponseType>>(
    {
      method: AXIOS_METHOD.PUT,
      url: API_ROUTES.APPROVE_CERTIFICATE(id),
    }
  );
  return response.data;
};

const revokeCertificate = async (
  id: string,
  data: RevokeCertificateRequestType
): Promise<BaseResponseType<CertificateResponseType>> => {
  const response = await axiosClient<BaseResponseType<CertificateResponseType>>(
    {
      method: AXIOS_METHOD.PUT,
      url: API_ROUTES.REVOKE_CERTIFICATE(id),
      data,
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
  createCertificate,
  importCertificates,
  getCertificates,
  getOrganizationCertificates,
  getCertificateDetailOnBlockchain,
  submitCertificateToVerify,
  getAllCertificateRequests,
  getCertificateRequestsSpecific,
  approveCertificateRequest,
  rejectCertificateRequest,
  approveCertificate,
  revokeCertificate,
};
