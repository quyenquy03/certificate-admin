"use client";

import CertificateABI from "@/abis/CertificateABI.json";
import { certificateApis } from "@/apis";
import { ARBITRUM_SEPOLIA_RPC_URL, envs } from "@/constants";
import { COUNTRIES } from "@/enums";
import { formatDate } from "@/helpers";
import { CertificateDetailType } from "@/types";
import { Contract, JsonRpcProvider } from "ethers";
import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { CertificateImageModal } from "@/components/modals";
import { useDisclose } from "@/hooks";

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
    return {
      ...certificate,
      validFromText: certificate.validFrom
        ? formatDate(certificate.validFrom)
        : t("not_updated"),
      validToText: certificate.validTo
        ? formatDate(certificate.validTo)
        : t("not_updated"),
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
          }
        : null,
    };
  }, [certificate, t]);

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
    <div className="mx-auto max-w-6xl px-6">
      {isLoading && (
        <div className="rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-200">
          {t("certificate_loading")}
        </div>
      )}

      {error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 shadow-sm dark:border-red-700/40 dark:bg-red-900/30 dark:text-red-100">
          {error}
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
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
            <div className="grid gap-6 md:grid-cols-[1fr,2fr]">
              <div className="flex flex-col items-center gap-3 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900/60">
                {formattedCertificate.author.authorImage ? (
                  <img
                    src={formattedCertificate.author.authorImage}
                    alt={formattedCertificate.author.authorName}
                    className="h-40 w-32 rounded-lg object-cover shadow"
                  />
                ) : (
                  <div className="flex h-40 w-32 items-center justify-center rounded-lg border border-dashed border-slate-300 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
                    {t("no_image")}
                  </div>
                )}
                <div className="text-center">
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {formattedCertificate.author.authorName}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {formattedCertificate.author.authorEmail}
                  </p>
                </div>
              </div>

              <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900/60">
                <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                  {t("certificate_holder_section")}
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <DetailItem
                    label={t("certificate_holder_id_card")}
                    value={formattedCertificate.author.authorIdCard}
                  />
                  <DetailItem
                    label={t("certificate_holder_country_code")}
                    value={formattedCertificate.author.authorCountryCode}
                  />
                  <DetailItem
                    label={t("certificate_holder_birthday")}
                    value={formattedCertificate.author.authorDob}
                  />
                  <DetailItem
                    label={t("certificate_holder_email")}
                    value={formattedCertificate.author.authorEmail}
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
      />
    </div>
  );
};
