"use client";

import {
  Modal,
  type BaseModalProps,
  GraduationCertificateTemplate,
  IeltsCertificateTemplate,
} from "@/components";

import { AdditionalInfoType, CertificateDetailType } from "@/types";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { Button } from "@mantine/core";
import jsPDF from "jspdf";
import { cn } from "@/helpers";
import { CERTIFICATE_TEMPLATES } from "@/enums";

type CertificateImageModalProps = {
  certificate: CertificateDetailType | null;
  certificateCategory?: CERTIFICATE_TEMPLATES | null;
} & Omit<BaseModalProps, "children">;

export const CertificateImageModal = ({
  certificate,
  opened,
  onClose,
  ...props
}: CertificateImageModalProps) => {
  const t = useTranslations();

  const [exportedImages, setExportedImages] = useState<{
    image_1?: string;
    image_2?: string;
  }>({});
  const [isConverting, setIsConverting] = useState(true);

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

  const certificateCategory = useMemo(() => {
    if (
      !certificate ||
      !certificateAdditionalInfo ||
      !certificateAdditionalInfo.certificate_type
    )
      return null;

    const currentCertificateType = certificateAdditionalInfo.certificate_type;

    if (!currentCertificateType) return null;

    switch (currentCertificateType) {
      case "IELTS":
        return CERTIFICATE_TEMPLATES.IELTS;
      case "TOEIC":
        return CERTIFICATE_TEMPLATES.TOEIC;
      case "CN001":
      case "KS01":
        return CERTIFICATE_TEMPLATES.GRADUATION_CERTIFICATE;
      default:
        return null;
    }
  }, [certificate, certificateAdditionalInfo]);

  const handleExport = () => {
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    if (exportedImages.image_1) {
      pdf.addImage(exportedImages.image_1, "PNG", 0, 0, pageWidth, pageHeight);
    }

    if (exportedImages.image_2) {
      pdf.addPage();
      pdf.addImage(exportedImages.image_2, "PNG", 0, 0, pageWidth, pageHeight);
    }

    pdf.save(
      `${certificate?.authorProfile?.authorName}_${new Date().getTime()}.pdf`
    );
  };

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
      <Button onClick={handleExport} className="mb-4" disabled={isConverting}>
        Export
      </Button>

      {/* Chỉ hiển thị ảnh đã convert */}
      <div className="p-4">
        {isConverting && !exportedImages.image_1 && !exportedImages.image_2 && (
          <div className="flex justify-center items-center py-10">
            <span>Đang tạo ảnh chứng chỉ...</span>
          </div>
        )}

        {!isConverting &&
          (exportedImages.image_1 || exportedImages.image_2) && (
            <div className="flex flex-wrap gap-4 justify-center">
              {exportedImages.image_1 && (
                <img
                  src={exportedImages.image_1}
                  alt="left-certificate-exported"
                  className={cn(
                    "max-w-[500px] h-auto border rounded-md",
                    certificateCategory === CERTIFICATE_TEMPLATES.IELTS &&
                      "max-w-[800px]"
                  )}
                />
              )}
              {exportedImages.image_2 && (
                <img
                  src={exportedImages.image_2}
                  alt="right-certificate-exported"
                  className="max-w-[500px] h-auto border rounded-md"
                />
              )}
            </div>
          )}
      </div>

      {certificateCategory === CERTIFICATE_TEMPLATES.GRADUATION_CERTIFICATE && (
        <GraduationCertificateTemplate
          certificate={certificate}
          certificateAdditionalInfo={certificateAdditionalInfo}
          isConverting={isConverting}
          setIsConverting={setIsConverting}
          setExportImages={setExportedImages}
          opened={opened}
        />
      )}

      {certificateCategory === CERTIFICATE_TEMPLATES.IELTS && (
        <IeltsCertificateTemplate
          certificate={certificate}
          certificateAdditionalInfo={certificateAdditionalInfo}
          isConverting={isConverting}
          setIsConverting={setIsConverting}
          setExportImages={setExportedImages}
          opened={opened}
        />
      )}
    </Modal>
  );
};
