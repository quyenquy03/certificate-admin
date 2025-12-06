"use client";

import { certificateApis } from "@/apis";
import {
  BaseResponseType,
  CertificateResponseType,
  ImportCertificateRequestType,
} from "@/types";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export const useImportCertificates = (
  option?: UseMutationOptions<
    BaseResponseType<CertificateResponseType>,
    AxiosError,
    ImportCertificateRequestType,
    unknown
  >
) => {
  const mutationFn = async (data: ImportCertificateRequestType) => {
    const response = await certificateApis.importCertificates(data);
    return response;
  };

  return useMutation({
    mutationFn,
    ...option,
  });
};
