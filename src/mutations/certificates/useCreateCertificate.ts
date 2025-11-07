"use client";

import { certificateApis } from "@/apis";
import {
  BaseResponseType,
  CertificateResponseType,
  CreateCertificateRequestType,
} from "@/types";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export const useCreateCertificate = (
  option?: UseMutationOptions<
    BaseResponseType<CertificateResponseType>,
    AxiosError,
    CreateCertificateRequestType,
    unknown
  >
) => {
  const mutationFn = async (data: CreateCertificateRequestType) => {
    const response = await certificateApis.createCertificate(data);
    return response;
  };

  return useMutation({
    mutationFn,
    ...option,
  });
};

