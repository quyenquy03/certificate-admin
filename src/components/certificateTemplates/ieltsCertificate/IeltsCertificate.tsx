"use client";

import { GENDER_LABELS, IMAGES, LANGUAGE_LABELS } from "@/constants";
import {
  calculateIELTSOverall,
  formatDate,
  formatScore,
  splitFamilyAndFirstName,
} from "@/helpers";
import { AdditionalInfoType, CertificateDetailType } from "@/types";
import { useEffect, useMemo, useRef } from "react";
import * as htmlToImage from "html-to-image";
import { GENDERS, LANGUAGES } from "@/enums";

type IeltsCertificateTemplateProps = {
  certificate: CertificateDetailType | null;
  certificateAdditionalInfo: AdditionalInfoType;
  isConverting: boolean;
  setIsConverting: (value: boolean) => void;
  setExportImages: (data: { image_1?: string; image_2?: string }) => void;
  opened: boolean;
};

export const IeltsCertificateTemplate = ({
  certificate,
  certificateAdditionalInfo,
  isConverting,
  setIsConverting,
  setExportImages,
  opened,
}: IeltsCertificateTemplateProps) => {
  const ieltsRef = useRef<HTMLDivElement | null>(null);

  const overallScore = useMemo(() => {
    if (!certificateAdditionalInfo) return;
    return calculateIELTSOverall({
      listening: Number(certificateAdditionalInfo.listening_result as string),
      writing: Number(certificateAdditionalInfo.writing_result as string),
      speaking: Number(certificateAdditionalInfo.speaking_result as string),
      reading: Number(certificateAdditionalInfo.reading_result as string),
    });
  }, [certificateAdditionalInfo]);

  const candidateName = useMemo(() => {
    if (!certificate?.authorProfile) return null;
    return splitFamilyAndFirstName(certificate.authorProfile.authorName, true);
  }, [certificate?.authorProfile]);

  const generateImages = async () => {
    if (!ieltsRef.current) return;

    try {
      setIsConverting(true);

      const options = {
        cacheBust: true,
        pixelRatio: 2,
        useCors: true,
      };

      const [leftPng] = await Promise.all([
        htmlToImage.toPng(ieltsRef.current, options),
      ]);

      setExportImages({
        image_1: leftPng,
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
    <div className="fixed -left-[9999px] top-0 opacity-0 pointer-events-none select-none text-black">
      <div
        ref={ieltsRef}
        className="w-[800px] h-[1200px] border-[1px] p-5 bg-white relative"
      >
        <div className="flex justify-between items-end">
          <div className="text-black">
            <h5 className="font-bold text-[60px] leading-none">IELTS</h5>
            <h5 className="leading-none font-bold text-lg mt-1">
              Test Report Form
            </h5>
          </div>
          <div className="w-[250px] border-2 border-black h-8 flex items-center justify-center">
            <span className="text-black">ACADEMIC</span>
          </div>
        </div>

        <div className="flex gap-4 mt-5">
          <span className="font-bold">NOTE</span>
          <p className="italic font-thin text-xs text-justify leading-normal">
            Admission to undergraduate and post graduate courses should be based
            on the ACADEMIC Reading and Writing Modules. GENERAL TRAINING
            Reading and Writing Modules are not designed to test the full range
            of language skills required for academic purposes. It is recommended
            that the candidate's language ability as indicated in this Test
            Report From be re-assesed after two years from the date of the test.
            To find out more about IELTS, IELTS band scores and the CEFR levels,
            please visit ielts.org/scores
          </p>
        </div>

        <div className="flex justify-between mt-3">
          <div className="flex items-center">
            <span className="text-sm w-32">Centre Number</span>
            <div className="w-32 h-10 border-[1px] border-black flex items-center px-3 uppercase">
              {(certificateAdditionalInfo?.centre_number as string) ?? ""}
            </div>
          </div>

          <div className="flex gap-4 items-center">
            <span className="text-sm">Date</span>
            <div className="w-32 h-10 border-[1px] border-black flex items-center px-3 uppercase">
              {certificate?.validFrom
                ? formatDate(certificate?.validFrom, "DD/MMM/YYYY")
                : ""}
            </div>
          </div>

          <div className="flex gap-4 items-center">
            <span className="text-sm">Candidate Number</span>
            <div className="w-32 h-10 border-[1px] border-black flex items-center px-3 leading-none uppercase">
              {(certificateAdditionalInfo?.candidate_number as string) ?? ""}
            </div>
          </div>
        </div>
        <div className="mt-3 border-y-[1px] border-black flex gap-4 py-3">
          <div className="flex-1">
            <h5 className="font-bold">Candidate Details</h5>

            <div className="flex w-full items-center mt-3">
              <span className="w-32">Family Name</span>
              <div className="border-[1px] border-black flex-1 h-10 flex px-3 items-center bg-gray-200 uppercase">
                {candidateName?.familyName}
              </div>
            </div>

            <div className="flex w-full items-center mt-3">
              <span className="w-32">First Name</span>
              <div className="border-[1px] border-black flex-1 h-10 flex px-3 items-center bg-gray-200 uppercase">
                {candidateName?.firstName}
              </div>
            </div>

            <div className="flex w-full items-center mt-3">
              <span className="w-32">Candidate ID</span>
              <div className="border-[1px] border-black w-64 h-10 flex px-3 items-center bg-gray-200">
                ABCD1234
              </div>
            </div>
          </div>
          <div className="w-[150px] border-gray-300 border-[1px]">
            {certificate?.authorProfile?.authorImage && (
              <img
                src={certificate.authorProfile.authorImage}
                alt="image"
                className="w-[150px] h-[180px] object-cover"
              />
            )}
          </div>
        </div>

        <div className="py-3">
          <div className="flex justify-between">
            <div className="flex items-center">
              <span className="text-sm w-32">Date of birth</span>
              <div className="w-40 h-10 border-[1px] border-black flex items-center px-3 text-sm">
                {certificate?.authorProfile?.authorDob
                  ? formatDate(certificate?.authorProfile?.authorDob)
                  : ""}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm">Sex(M/F)</span>
              <div className="w-10 h-10 border-[1px] border-black flex items-center px-3 text-sm uppercase">
                {certificateAdditionalInfo?.candidate_sex
                  ? GENDER_LABELS[
                      certificateAdditionalInfo.candidate_sex as GENDERS
                    ].charAt(0)
                  : "M"}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm">Scheme Code</span>
              <div className="w-36 h-10 border-[1px] border-black flex items-center px-3 text-sm">
                Private Candidate
              </div>
            </div>
          </div>

          <div className="flex items-center mt-3">
            <span className="text-sm w-32">
              Country or <br /> Region of Origin
            </span>
            <div className="flex-1 h-10 border-[1px] border-black flex items-center px-3 text-sm"></div>
          </div>

          <div className="flex items-center mt-3">
            <span className="text-sm w-32">
              Country of <br /> Nationality
            </span>
            <div className="flex-1 h-10 border-[1px] border-black flex items-center px-3 text-sm">
              VIET NAM
            </div>
          </div>

          <div className="flex items-center mt-3">
            <span className="text-sm w-32">First Language</span>
            <div className="flex-1 h-10 border-[1px] border-black flex items-center px-3 text-sm uppercase">
              {certificateAdditionalInfo?.first_language
                ? LANGUAGE_LABELS[
                    certificateAdditionalInfo.first_language as LANGUAGES
                  ]
                : ""}
            </div>
          </div>
        </div>

        <div className="py-3 border-y-[1px] border-black">
          <h5 className="font-bold">Test Results</h5>

          <div className="flex mt-3 justify-between">
            <div className="flex items-center">
              <span className="pr-2 text-[13px] font-semibold leading-tight">
                Listening
              </span>
              <div className="flex items-center justify-center w-10 h-12 border-[1px] border-black bg-gray-300">
                {certificateAdditionalInfo?.listening_result
                  ? formatScore(
                      certificateAdditionalInfo.listening_result as string
                    )
                  : ""}
              </div>
            </div>
            <div className="flex items-center">
              <span className="pr-2 text-[13px] font-semibold leading-tight">
                Reading
              </span>
              <div className="flex items-center justify-center w-10 h-12 border-[1px] border-black bg-gray-300">
                {certificateAdditionalInfo?.reading_result
                  ? formatScore(
                      certificateAdditionalInfo.reading_result as string
                    )
                  : ""}
              </div>
            </div>
            <div className="flex items-center">
              <span className="pr-2 text-[13px] font-semibold leading-tight">
                Writing
              </span>
              <div className="flex items-center justify-center w-10 h-12 border-[1px] border-black bg-gray-300">
                {certificateAdditionalInfo?.writing_result
                  ? formatScore(
                      certificateAdditionalInfo.writing_result as string
                    )
                  : ""}
              </div>
            </div>
            <div className="flex items-center">
              <span className="pr-2 text-[13px] font-semibold leading-tight">
                Speaking
              </span>
              <div className="flex items-center justify-center w-10 h-12 border-[1px] border-black bg-gray-300">
                {certificateAdditionalInfo?.speaking_result
                  ? formatScore(
                      certificateAdditionalInfo.speaking_result as string
                    )
                  : ""}
              </div>
            </div>
            <div className="flex items-center">
              <span className="pr-2 text-[13px] font-semibold leading-tight">
                Overall <br /> Band <br /> Score
              </span>
              <div className="flex items-center justify-center w-10 h-12 border-[1px] border-black bg-gray-300">
                {overallScore?.overall ? formatScore(overallScore.overall) : ""}
              </div>
            </div>
            <div className="flex items-center">
              <span className="pr-2 text-[13px] font-semibold leading-tight">
                CEFR Level
              </span>
              <div className="flex items-center justify-center w-10 h-12 border-[1px] border-black bg-gray-300">
                {overallScore?.cefr ?? ""}
              </div>
            </div>
          </div>
        </div>

        <div className="py-3 flex gap-4">
          <div className="flex-1 items-stretch flex flex-col gap-2">
            <h5 className="text-xs leading-none font-semibold">
              Administrator Comments
            </h5>
            <div className="p-3 border-[1px] border-black flex-1 text-sm">
              {certificateAdditionalInfo?.administrator_comments as string}{" "}
            </div>
          </div>
          <div className="w-32 h-32 border-[1px] border-black text-xs font-semibold text-center flex items-center justify-center">
            Recognising organisations must verify this score at ielts.org/verify
          </div>
          <div className="w-32 h-32 border-[1px] border-black flex items-center justify-center gap-2 flex-col">
            <span className="text-xs font-semibold">Validation stamp</span>
            <img src={IMAGES.ielts.stamp} alt="ielts" className="w-20 h-20" />
          </div>
        </div>

        <div className="mt-10 flex justify-end gap-5">
          <div className="flex items-center gap-2">
            <span className="text-xs leading-tight">Date</span>
            <div className="w-32 h-10 border-[1px] border-black flex items-center px-3">
              {certificate?.validFrom
                ? formatDate(certificate?.validFrom, "DD/MM/YYYY")
                : ""}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs leading-tight">
              Test Report <br /> Fom Number
            </span>
            <div className="w-40 h-10 border-[1px] border-black flex items-center px-3 leading-none">
              {certificateAdditionalInfo?.test_report as string}
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center">
          <img src={IMAGES.ielts.logos} alt="ielts" className="w-[500px]" />
        </div>

        <div className="mt-3 border-black border-t-[1px] text-center pt-3 text-[11px] font-semibold">
          The validity of this IELTS Test Report Form can be verified online by
          recognising organisation at http://ielts.ucles.org.uk
        </div>
      </div>
    </div>
  );
};
