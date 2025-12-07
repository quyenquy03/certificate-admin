"use client";

import { Modal, type BaseModalProps } from "@/components/modals/bases";
import { certificateLevels, certificateTypes, IMAGES } from "@/constants";

import { AdditionalInfoType, CertificateDetailType } from "@/types";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState } from "react";
import * as htmlToImage from "html-to-image";
import { Button } from "@mantine/core";
import jsPDF from "jspdf";
import { formatDate, formatFullDate, getLastWordCapitalized } from "@/helpers";
import { getDegreeClassfication } from "@/helpers";

type CertificateImageModalProps = {
  certificate: CertificateDetailType | null;
} & Omit<BaseModalProps, "children">;

export const CertificateImageModal = ({
  certificate,
  opened,
  onClose,
  ...props
}: CertificateImageModalProps) => {
  const t = useTranslations();

  const leftRef = useRef<HTMLDivElement | null>(null);
  const rightRef = useRef<HTMLDivElement | null>(null);

  const [exportedImages, setExportedImages] = useState<{
    left?: string;
    right?: string;
  }>({});
  const [isConverting, setIsConverting] = useState(false);

  const certificateAdditionalInfo = useMemo(() => {
    if (!certificate) return {};
    try {
      const certificateAdditional = certificate.authorProfile?.additionalInfo;
      if (certificateAdditional)
        return JSON.parse(certificateAdditional) as AdditionalInfoType;
      return {};
    } catch (error) {
      return {};
    }
  }, [certificate]);

  const certificateType = useMemo(() => {
    if (!certificate) return;
    const certificateType = certificateTypes.find(
      (item) => item.code === certificate.certificateType
    );
  }, [certificate]);

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

      setExportedImages({
        left: leftPng,
        right: rightPng,
      });
    } catch (error) {
      console.error("Export certificate failed:", error);
    } finally {
      setIsConverting(false);
    }
  };

  const handleExport = () => {
    // chỉ export khi đã có đủ 2 ảnh
    if (!exportedImages.left || !exportedImages.right) return;

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Trang 1 - left certificate
    pdf.addImage(exportedImages.left, "PNG", 0, 0, pageWidth, pageHeight);

    // Trang 2 - right certificate
    pdf.addPage();
    pdf.addImage(exportedImages.right, "PNG", 0, 0, pageWidth, pageHeight);

    pdf.save("certificate.pdf");
  };

  // Khi modal mở thì tự convert HTML -> image
  useEffect(() => {
    if (!opened) {
      setExportedImages({});
      return;
    }

    const timer = setTimeout(() => {
      generateImages();
    }, 0);

    return () => clearTimeout(timer);
  }, [opened]);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      size="lg"
      footerProps={{
        showFooter: false,
      }}
      contentClassNames={{
        closeButton: "top-5 right-5",
      }}
      {...props}
    >
      <Button
        onClick={handleExport}
        className="mb-4"
        disabled={isConverting || !exportedImages.left || !exportedImages.right}
      >
        Export
      </Button>

      {/* Chỉ hiển thị ảnh đã convert */}
      <div className="p-4">
        {isConverting && !exportedImages.left && !exportedImages.right && (
          <div className="flex justify-center items-center py-10">
            <span>Đang tạo ảnh chứng chỉ...</span>
          </div>
        )}

        {!isConverting && (exportedImages.left || exportedImages.right) && (
          <div className="flex flex-wrap gap-4 justify-center">
            {exportedImages.left && (
              <img
                src={exportedImages.left}
                alt="left-certificate-exported"
                className="max-w-[500px] h-auto border rounded-md"
              />
            )}
            {exportedImages.right && (
              <img
                src={exportedImages.right}
                alt="right-certificate-exported"
                className="max-w-[500px] h-auto border rounded-md"
              />
            )}
          </div>
        )}
      </div>

      {/* HTML certificate ẩn, chỉ để html-to-image chụp */}
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
                <h5 className="text-red-500 text-xl">THE DEGREE OF ENGINEER</h5>
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
                    {formatDate(
                      certificate?.authorProfile?.authorDob as string
                    )}
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
                <img
                  src={certificate?.authorProfile.authorImage}
                  alt="avatar"
                  className="w-[120px] h-[160px] rounded-sm"
                />
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
                <h5 className="text-red-500 text-xl uppercase">Bằng kỹ sư</h5>
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
    </Modal>
  );
};
