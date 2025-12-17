"use client";

import CertificateABI from "@/abis/CertificateABI.json";
import { certificateApis } from "@/apis";
import {
  ARBITRUM_SEPOLIA_RPC_URL,
  GENDER_LABELS,
  LANGUAGE_LABELS,
  envs,
} from "@/constants";
import { CERTIFICATE_TEMPLATES, GENDERS, LANGUAGES } from "@/enums";
import { formatDate } from "@/helpers";
import { useDisclose } from "@/hooks";
import { NoData, CertificateImageModal } from "@/components";
import type { AdditionalInfoType, CertificateDetailType } from "@/types";
import { Contract, JsonRpcProvider } from "ethers";
import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";

type CertificateDetailProps = {
  certificateCode: string;
};

export const CertificateDetail = ({
  certificateCode,
}: CertificateDetailProps) => {
  const t = useTranslations();
  const [certificate, setCertificate] = useState<CertificateDetailType | null>(
    null
  );

  const [ipfsHash, setIpfsHash] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const certificateImageModal = useDisclose();

  const normalizeString = (value: unknown): string | undefined => {
    if (typeof value === "string") return value;
    if (typeof value === "number") return String(value);
    return undefined;
  };

  const getGenderValue = (value: unknown): string | undefined => {
    const normalized = typeof value === "number" ? value : Number(value);
    if (!Number.isFinite(normalized)) return undefined;
    const genderLabel = GENDER_LABELS[normalized as GENDERS];
    return genderLabel ? t(genderLabel) : undefined;
  };

  const getLanguageValue = (value: unknown): string | undefined => {
    if (value === null || value === undefined) return undefined;
    const normalized =
      typeof value === "string"
        ? value
        : typeof value === "number"
        ? String(value)
        : "";
    if (!normalized) return undefined;
    const languageLabel = LANGUAGE_LABELS[normalized as LANGUAGES];
    return languageLabel ? t(languageLabel) : undefined;
  };

  useEffect(() => {
    if (!certificateCode) return;

    const fetchCertificate = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const contractAddress = envs.CONTRACT_ADDRESS?.trim();
        if (!contractAddress || contractAddress === "no value") {
          throw new Error("Contract address is not configured.");
        }

        const provider = new JsonRpcProvider(ARBITRUM_SEPOLIA_RPC_URL);
        const contract = new Contract(
          contractAddress,
          CertificateABI,
          provider
        );
        const rawCertificate = await contract.getCertificate(certificateCode);

        if (!rawCertificate) return;

        const ipfsHash = rawCertificate.ipfsHash ?? rawCertificate[9];
        const normalizedIpfsHash =
          typeof ipfsHash === "string" ? ipfsHash.trim() : "";
        if (!normalizedIpfsHash) return;

        setIpfsHash(normalizedIpfsHash);
        const certificateDetailData =
          await certificateApis.getCertificateDetailOnBlockchain(
            normalizedIpfsHash
          );
        if (certificateDetailData) setCertificate(certificateDetailData);
      } catch (err) {
        console.log(err);
        const message =
          err instanceof Error ? err.message : "Failed to load certificate.";
        setError(message);
        setCertificate(null);
        setIpfsHash(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCertificate();
  }, [certificateCode]);

  const formattedCertificate = useMemo(() => {
    if (!certificate) return null;

    const author = certificate.authorProfile;
    let parsedAdditionalInfo: AdditionalInfoType | null = null;

    try {
      const rawAdditionalInfo = author?.additionalInfo;
      if (rawAdditionalInfo) {
        parsedAdditionalInfo =
          typeof rawAdditionalInfo === "string"
            ? JSON.parse(rawAdditionalInfo)
            : (rawAdditionalInfo as AdditionalInfoType);
      }
    } catch (error) {
      parsedAdditionalInfo = null;
    }

    const typeCodeFromAdditionalInfo =
      typeof parsedAdditionalInfo?.certificate_type === "string"
        ? parsedAdditionalInfo.certificate_type.trim()
        : "";

    const typeCodeFromCertificate =
      typeof certificate.certificateType === "string"
        ? certificate.certificateType.trim()
        : "";

    const certificateTypeCode =
      typeCodeFromAdditionalInfo || typeCodeFromCertificate;

    let certificateCategory: CERTIFICATE_TEMPLATES | null = null;

    switch (certificateTypeCode.toUpperCase()) {
      case "IELTS":
        certificateCategory = CERTIFICATE_TEMPLATES.IELTS;
        break;
      case "TOEIC":
        certificateCategory = CERTIFICATE_TEMPLATES.TOEIC;
        break;
      case "CN001":
      case "KS01":
        certificateCategory = CERTIFICATE_TEMPLATES.GRADUATION_CERTIFICATE;
        break;
      default:
        certificateCategory = null;
    }

    return {
      ...certificate,
      validFromText: certificate.validFrom
        ? formatDate(certificate.validFrom)
        : t("not_updated"),
      validToText: certificate.validTo
        ? formatDate(certificate.validTo)
        : t("not_updated"),
      certificateCategory,
      author: author
        ? {
            ...author,
            authorName: author.authorName?.trim() || t("not_updated"),
            authorIdCard: author.authorIdCard?.trim() || t("not_updated"),
            authorEmail: author.authorEmail?.trim() || t("not_updated"),
            authorDob: author.authorDob
              ? formatDate(author.authorDob)
              : t("not_updated"),
            authorImage: author.authorImage?.trim(),
            additionalInfo: parsedAdditionalInfo ?? undefined,
          }
        : null,
    };
  }, [certificate, t]);

  const additionalInfo = formattedCertificate?.author?.additionalInfo as
    | AdditionalInfoType
    | undefined;
  const certificateCategory = formattedCertificate?.certificateCategory;
  const isGraduationCategory =
    certificateCategory === CERTIFICATE_TEMPLATES.GRADUATION_CERTIFICATE;
  const isIeltsCategory = certificateCategory === CERTIFICATE_TEMPLATES.IELTS;

  const DetailItem = ({
    label,
    value,
  }: {
    label: string;
    value: string | number | null | undefined;
  }) => (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900/60">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {label}
      </p>
      <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
        {value ?? t("not_updated")}
      </p>
    </div>
  );

  return (
    <div className="mx-auto max-w-[600px] px-4">
      {isLoading && (
        <div className="rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-200">
          {t("certificate_loading")}
        </div>
      )}

      {error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 shadow-sm dark:border-red-700/40 dark:bg-red-900/30 dark:text-red-100">
          <NoData
            title={t("certificate_detail_error_title")}
            description={t("certificate_detail_error_description")}
            isTranslation
          />
        </div>
      )}

      {!isLoading && !error && !formattedCertificate && (
        <div className="rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-200">
          {t("certificate_no_data")}
        </div>
      )}

      {formattedCertificate && (
        <div className="space-y-6 py-6">
          <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900/60">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              {t("certificate_summary")}
            </h2>
            <div className="grid grid-cols-1 gap-4">
              <DetailItem
                label={t("certificate_code")}
                value={formattedCertificate.certificateCode}
              />
              <DetailItem
                label={t("certificate_type_name")}
                value={formattedCertificate.certificateType}
              />
              <DetailItem
                label={t("certificate_organization")}
                value={formattedCertificate.organizationName}
              />
              <DetailItem
                label={t("certificate_valid_from")}
                value={formattedCertificate.validFromText}
              />
              <DetailItem
                label={t("certificate_valid_to")}
                value={formattedCertificate.validToText}
              />
              <DetailItem
                label={t("certificate_grant_level")}
                value={formattedCertificate.author?.grantLevel}
              />
            </div>
          </div>

          {formattedCertificate.author && (
            <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900/60">
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                {t("certificate_holder_section")}
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <DetailItem
                  label={t("certificate_holder_name")}
                  value={formattedCertificate.author.authorName}
                />
                <DetailItem
                  label={t("certificate_holder_email")}
                  value={formattedCertificate.author.authorEmail}
                />
                <DetailItem
                  label={t("certificate_holder_country_code")}
                  value={formattedCertificate.author.authorCountryCode}
                />
                <DetailItem
                  label={t("certificate_holder_id_card")}
                  value={formattedCertificate.author.authorIdCard}
                />
                <DetailItem
                  label={t("certificate_holder_birthday")}
                  value={formattedCertificate.author.authorDob}
                />
              </div>

              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  {t("certificate_documents")}
                </p>
                {formattedCertificate.author.authorDocuments?.length ? (
                  <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-200">
                    {formattedCertificate.author.authorDocuments.map(
                      (doc, index) => (
                        <li key={`${doc}-${index}`} className="break-all">
                          {doc}
                        </li>
                      )
                    )}
                  </ul>
                ) : (
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    {t("certificate_documents_empty")}
                  </p>
                )}
              </div>
            </div>
          )}

          {certificateCategory && (
            <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900/60">
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                {t("other_information")}
              </h3>

              {additionalInfo ? (
                <>
                  {isGraduationCategory && (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <DetailItem
                        label={t("reg_no")}
                        value={normalizeString(additionalInfo.reg_no)}
                      />
                      <DetailItem
                        label={t("serial_number")}
                        value={normalizeString(additionalInfo.serial_number)}
                      />
                    </div>
                  )}

                  {isIeltsCategory && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <DetailItem
                          label={t("test_report")}
                          value={normalizeString(additionalInfo.test_report)}
                        />
                        <DetailItem
                          label={t("candidate_number")}
                          value={normalizeString(
                            additionalInfo.candidate_number
                          )}
                        />
                        <DetailItem
                          label={t("candidate_sex")}
                          value={getGenderValue(additionalInfo.candidate_sex)}
                        />
                        <DetailItem
                          label={t("first_language")}
                          value={getLanguageValue(
                            additionalInfo.first_language
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                        <DetailItem
                          label={t("listening")}
                          value={normalizeString(
                            additionalInfo.listening_result
                          )}
                        />
                        <DetailItem
                          label={t("speaking")}
                          value={normalizeString(
                            additionalInfo.speaking_result
                          )}
                        />
                        <DetailItem
                          label={t("writing")}
                          value={normalizeString(additionalInfo.writing_result)}
                        />
                        <DetailItem
                          label={t("reading")}
                          value={normalizeString(additionalInfo.reading_result)}
                        />
                      </div>
                    </div>
                  )}
                  {!isGraduationCategory && !isIeltsCategory && (
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      {t("certificate_no_data")}
                    </p>
                  )}
                </>
              ) : (
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  {t("certificate_no_data")}
                </p>
              )}
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="button"
              onClick={certificateImageModal.onOpen}
              disabled={!ipfsHash}
              className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {t("view_certificate")}
            </button>
          </div>
        </div>
      )}

      <CertificateImageModal
        opened={certificateImageModal.isOpen}
        onClose={certificateImageModal.onClose}
        certificate={certificate}
        fullScreen
        certificateCategory={formattedCertificate?.certificateCategory}
      />
    </div>
  );
};
