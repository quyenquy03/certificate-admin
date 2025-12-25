"use client";

import { certificateLevels, IMAGES } from "@/constants";
import { CERTIFICATE_TYPES } from "@/constants/certificateTypes";
import {
  formatDate,
  formatFullDate,
  getDegreeClassfication,
  getLastWordCapitalized,
} from "@/helpers";
import { AdditionalInfoType, CertificateDetailType } from "@/types";
import { useEffect, useMemo, useRef } from "react";
import * as htmlToImage from "html-to-image";

type GraduationCertificateTemplateProps = {
  certificate: CertificateDetailType | null;
  certificateAdditionalInfo: AdditionalInfoType;
  isConverting: boolean;
  setIsConverting: (value: boolean) => void;
  setExportImages: (data: { image_1?: string; image_2?: string }) => void;
  opened: boolean;
};

export const GraduationCertificateTemplate = ({
  certificate,
  certificateAdditionalInfo,
  isConverting,
  setIsConverting,
  setExportImages,
  opened,
}: GraduationCertificateTemplateProps) => {
  const leftRef = useRef<HTMLDivElement | null>(null);
  const rightRef = useRef<HTMLDivElement | null>(null);
  const authorImage = certificate?.authorProfile?.authorImage?.trim();

  const certificateLevel = useMemo(() => {
    if (!certificate) return;
    const level = certificateLevels.find(
      (item) =>
        certificate.authorProfile?.grantLevel &&
        item.value ===
          getDegreeClassfication(certificate.authorProfile?.grantLevel)
    );
    return level;
  }, [certificate]);

  const certificateTypeCode = useMemo(() => {
    const additionalCode =
      typeof certificateAdditionalInfo?.certificate_type === "string"
        ? certificateAdditionalInfo.certificate_type.trim()
        : "";
    const certificateCode =
      typeof certificate?.certificateType === "string"
        ? certificate.certificateType.trim()
        : "";
    return (additionalCode || certificateCode).toUpperCase();
  }, [certificateAdditionalInfo, certificate]);

  const certificateTypeLabel = useMemo(() => {
    if (!certificateTypeCode) return;
    return CERTIFICATE_TYPES.find(
      (item) => item.code.toUpperCase() === certificateTypeCode
    );
  }, [certificateTypeCode]);


  const generateImages = async () => {
    if (!leftRef.current || !rightRef.current) return;

    try {
      setIsConverting(true);

      const options = {
        cacheBust: true,
        pixelRatio: 2,
        useCors: true,
      };

      const [leftPng, rightPng] = await Promise.all([
        htmlToImage.toPng(leftRef.current, options),
        htmlToImage.toPng(rightRef.current, options),
      ]);

      setExportImages({
        image_1: leftPng,
        image_2: rightPng,
      });
    } catch (error) {
      console.error("Export certificate failed:", error);
    } finally {
      setIsConverting(false);
    }
  };

  useEffect(() => {
    if (!opened) {
      setExportImages({});
      return;
    }

    const timer = setTimeout(() => {
      generateImages();
    }, 0);

    return () => clearTimeout(timer);
  }, [opened]);

  return (
    <div className="fixed -left-[9999px] top-0 opacity-0 pointer-events-none select-none">
      {/*  */}
      <div className="flex gap-5">
        {/* Left certificate (HIDDEN) */}
        <div
          ref={leftRef}
          className="w-[640px] h-[970px] bg-white rounded-md relative p-5"
        >
          <img
            src={IMAGES.certificates.leftCertificate}
            alt="certificate-left"
            className="w-full h-full"
          />

          <div className="absolute top-0 left-0 w-full h-full p-5">
            <div className="w-full text-center mt-[60px] text-black font-times font-bold leading-normal">
              <h5 className="mb-1">SOCIALIST REPUBLIC OF VIETNAM</h5>
              <h5>Independence - Freedom - Happiness</h5>
            </div>

            <div className="w-full px-10 mt-10 text-center uppercase font-times font-bold text-black leading-normal">
              <h5>THE PRESIDENT OF</h5>
              <h5>VINH UNIVERSITY</h5>
            </div>

            <div className="w-full px-10 mt-10 text-center font-times font-bold">
              <h5 className="text-black mb-1">confers</h5>
              <h5 className="text-red-500 text-xl">
                {certificateTypeLabel?.enLabel?.toUpperCase() ?? "THE DEGREE OF ENGINEER"}
              </h5>
            </div>

            <div className="w-full px-20 text-gray-700 mt-12 space-y-4 font-times">
              <div className="flex gap-3 items-center relative h-7">
                <span>Upon:</span>
                <span className="font-bold text-lg absolute w-full text-center left-0 top-0">
                  {certificate?.authorProfile.authorName}
                </span>
              </div>
              <div className="flex gap-3 items-center relative h-7">
                <span>Date of birth:</span>
                <span className="font-bold text-lg absolute w-full text-center left-0 top-0">
                  {formatDate(certificate?.authorProfile?.authorDob as string)}
                </span>
              </div>
              <div className="flex gap-3 items-center relative h-7">
                <span>Major:</span>
                <span className="font-bold text-lg absolute w-full text-center left-0 top-0">
                  Information Technology
                </span>
              </div>
              <div className="flex gap-3 items-center relative h-7">
                <span>Degree classfication:</span>
                <span className="font-bold text-lg absolute w-full text-center left-0 top-0">
                  {certificateLevel?.enName}
                </span>
              </div>
            </div>

            <div className="px-20 mt-10 flex justify-center">
              <div className="w-[120px] h-[160px] rounded-sm overflow-hidden">
                {authorImage ? (
                  <img
                    src={authorImage}
                    alt="avatar"
                    className="w-full h-full object-cover"
                  />
                ) : null}
              </div>
            </div>

            <div className="px-16 absolute bottom-20 font-times text-gray-700">
              <div className="flex items-center gap-3 text-sm mb-1">
                <span>Serial number:</span>
                <span className="text-red-500 font-semibold">
                  {certificateAdditionalInfo?.serial_number as string}
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <span>Reg.no:</span>
                <span className="font-semibold">
                  {certificateAdditionalInfo?.reg_no as string}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right certificate (HIDDEN) */}
        <div
          ref={rightRef}
          className="w-[640px] h-[920px] bg-white rounded-md relative p-5"
        >
          <img
            src={IMAGES.certificates.rightCertificate}
            alt="certificate-right"
            className="w-full h-full"
          />

          <div className="absolute top-0 left-0 w-full h-full p-5">
            <div className="w-full text-center mt-[60px] text-black font-times font-bold leading-normal">
              <h5 className="mb-1 uppercase">
                Cộng hoà xã hội chủ nghĩa việt nam
              </h5>
              <h5>Độc lập - Tự do - Hạnh phúc</h5>
            </div>

            <div className="w-full px-10 mt-10 text-center uppercase font-times font-bold text-black leading-normal">
              <h5>HIỆU TRƯỞNG</h5>
              <h5>TRƯỜNG ĐẠI HỌC VINH</h5>
            </div>

            <div className="w-full px-10 mt-10 text-center font-times font-bold">
              <h5 className="text-black mb-1">cấp</h5>
              <h5 className="text-red-500 text-xl uppercase">
                {certificateTypeLabel?.viLabel ?? "Bằng kỹ sư"}
              </h5>
            </div>

            <div className="w-full px-20 text-gray-700 mt-12 space-y-4 font-times">
              <div className="flex gap-3 items-center relative h-7">
                <span>Cho:</span>
                <span className="font-bold text-lg absolute w-full text-center left-0 top-0">
                  {certificate?.authorProfile?.authorName}
                </span>
              </div>
              <div className="flex gap-3 items-center relative h-7">
                <span>Ngày sinh:</span>
                <span className="font-bold text-lg absolute w-full text-center left-0 top-0">
                  05/08/2003
                </span>
              </div>
              <div className="flex gap-3 items-center relative h-7">
                <span>Ngành:</span>
                <span className="font-bold text-lg absolute w-full text-center left-0 top-0">
                  {certificate?.authorProfile?.domain}
                </span>
              </div>
              <div className="flex gap-3 items-center relative h-7">
                <span>Tốt nghiệp loại:</span>
                <span className="font-bold text-lg absolute w-full text-center left-0 top-0">
                  {certificateLevel?.viName}
                </span>
              </div>
            </div>

            <div className="px-16 mt-12 flex justify-end italic font-times text-gray-700 text-lg">
              <p>
                {certificateAdditionalInfo?.address as string},{" "}
                {formatFullDate(certificate?.validFrom as string)}
              </p>
            </div>
            <div className="px-16 mt-3 flex justify-end text-gray-700">
              <div className="flex items-center min-w-[200px] justify-center flex-col">
                <h5 className="font-times font-bold text-center w-full">
                  HIỆU TRƯỞNG
                </h5>
                <div className="mt-2 font-times italic text-3xl font-bold">
                  <h5>
                    {getLastWordCapitalized(
                      certificateAdditionalInfo?.signer as string
                    )}
                  </h5>
                </div>
                <h5 className="mt-3 font-bold font-times text-lg">
                  {certificateAdditionalInfo?.signer as string}
                </h5>
              </div>
            </div>

            <div className="px-16 absolute bottom-20 font-times text-gray-700">
              <div className="flex items-center gap-3 text-sm mb-1">
                <span>Số hiệu:</span>
                <span className="text-red-500 font-semibold">
                  {certificateAdditionalInfo?.serial_number as string}
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <span>Số vào sổ gốc cấp bằng:</span>
                <span className="font-semibold">
                  {certificateAdditionalInfo?.reg_no as string}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
