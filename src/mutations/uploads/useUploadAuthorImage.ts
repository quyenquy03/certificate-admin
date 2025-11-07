"use client";

import { uploadApis } from "@/apis";
import { AXIOS_METHOD } from "@/constants";
import { UploadRequestType, UploadResponseType } from "@/types";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import axios from "axios";

type UploadAuthorImageVariables = {
  file: File;
};

export const useUploadAuthorImage = (
  options?: UseMutationOptions<
    UploadResponseType,
    AxiosError,
    UploadAuthorImageVariables
  >
) => {
  const mutationFn = async ({ file }: UploadAuthorImageVariables) => {
    const payload: UploadRequestType = {
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
    };

    const presignedResponse = await uploadApis.uploadAuthorImage(payload);
    const { uploadUrl, accessUrl } = presignedResponse.data;

    await axios({
      method: AXIOS_METHOD.PUT,
      url: uploadUrl,
      data: file,
    });

    return {
      uploadUrl,
      accessUrl,
    };
  };

  return useMutation({
    mutationFn,
    ...options,
  });
};
