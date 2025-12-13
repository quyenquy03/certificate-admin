"use client";

import { Modal, type BaseModalProps, InfoRowItem } from "@/components";
import { GENDER_LABELS, LANGUAGE_LABELS } from "@/constants";
import {
  CERTIFICATE_TEMPLATES,
  CERTIFICATE_REQUEST_TYPES,
  CERTIFICATE_STATUSES,
  GENDERS,
  LANGUAGES,
} from "@/enums";
import { formatDate } from "@/helpers";
import { AdditionalInfoType, CertificateResponseType } from "@/types";
import { Box, Flex, Text, ActionIcon, Grid, GridCol } from "@mantine/core";
import { useTranslations } from "next-intl";
import { useCallback, useMemo } from "react";
import { FiCopy } from "react-icons/fi";
import { HiOutlineQrCode } from "react-icons/hi2";

type CertificateDetailModalProps = {
  certificate: CertificateResponseType | null;
  onSignSuccess?: () => void;
  isOrganizationOwner?: boolean;
  canSign?: boolean;
  canApprove?: boolean;
  canRevoke?: boolean;
  onApproveCertificate?: (certificate: CertificateResponseType) => void;
  onRevokeCertificate?: (certificate: CertificateResponseType) => void;
  onSignCertificate?: (certificate: CertificateResponseType) => void;
} & Omit<BaseModalProps, "children">;

export const CertificateDetailModal = ({
  certificate,
  opened,
  onClose,
  onSignSuccess,
  isOrganizationOwner = false,
  canSign,
  canApprove,
  canRevoke,
  onApproveCertificate,
  onRevokeCertificate,
  onSignCertificate,
  ...props
}: CertificateDetailModalProps) => {
  const t = useTranslations();

  const author = certificate?.authorProfile;

  const summaryItems = useMemo(() => {
    if (!certificate) return [];
    return [
      {
        key: "code",
        label: t("certificate_code"),
        value: certificate.code ? `${certificate.code}` : t("not_updated"),
        allowCopy: Boolean(certificate.code),
      },
      {
        key: "hash",
        label: t("certificate_hash"),
        value: certificate.certificateHash,
        allowCopy: Boolean(certificate.certificateHash),
      },
      {
        key: "certificateType",
        label: t("certificate_type_name"),
        value: certificate.certificateType?.name,
      },
      {
        key: "validDate",
        label: t("valid_period"),
        value: `${formatDate(certificate.validFrom) || t("not_updated")} - ${
          formatDate(certificate.validTo) || t("not_updated")
        }`,
      },
    ];
  }, [certificate]);

  const txItems = useMemo(() => {
    if (!certificate) return [];
    return [
      {
        key: "signed",
        label: t("signed_tx_hash"),
        value: certificate.signedTxHash ?? t("not_updated"),
        icon: HiOutlineQrCode,
        disabledCopyButton: !Boolean(certificate.signedTxHash),
      },
      {
        key: "approved",
        label: t("approved_tx_hash"),
        value: certificate.approvedTxHash ?? t("not_updated"),
        icon: HiOutlineQrCode,
        disabledCopyButton: !Boolean(certificate.approvedTxHash),
      },
      {
        key: "revoked",
        label: t("revoked_tx_hash"),
        value: certificate.revokedTxHash ?? t("not_updated"),
        icon: HiOutlineQrCode,
        disabledCopyButton: !Boolean(certificate.revokedTxHash),
      },
    ];
  }, [certificate]);

  const certificateCategory = useMemo(() => {
    if (!certificate) return null;

    const currentCertificateType = certificate.certificateType?.code;

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
  }, [certificate]);

  const additionalInfo = useMemo(() => {
    try {
      if (!certificate || !certificate.authorProfile?.additionalInfo)
        return null;

      const additionalInfo: AdditionalInfoType = JSON.parse(
        certificate.authorProfile.additionalInfo
      );

      return additionalInfo;
    } catch (error) {
      return null;
    }
  }, [certificate]);

  const normalizedCanSign = canSign ?? isOrganizationOwner;
  const normalizedCanApprove = canApprove ?? isOrganizationOwner;
  const normalizedCanRevoke = canRevoke ?? isOrganizationOwner;

  const modalAction = useMemo(() => {
    switch (certificate?.status) {
      case CERTIFICATE_STATUSES.CREATED:
        return {
          text: "sign_certificate",
          allowed: normalizedCanSign,
        };
      case CERTIFICATE_STATUSES.SIGNED:
        return {
          text: "approve",
          allowed: normalizedCanApprove,
        };
      case CERTIFICATE_STATUSES.VERIFIED:
        return {
          text: "revoke",
          allowed: normalizedCanRevoke,
        };
      default:
        return { text: "", allowed: false };
    }
  }, [
    certificate?.status,
    normalizedCanApprove,
    normalizedCanRevoke,
    normalizedCanSign,
  ]);

  const handleClickConfirmButton = useCallback(() => {
    if (!certificate || !certificate?.status) return;
    switch (certificate.status) {
      case CERTIFICATE_STATUSES.CREATED:
        onSignCertificate?.(certificate);
        return;
      case CERTIFICATE_STATUSES.SIGNED:
        onApproveCertificate?.(certificate);
        return;
      case CERTIFICATE_STATUSES.VERIFIED:
        onRevokeCertificate?.(certificate);
        return;
      default:
        return;
    }
  }, [certificate, onApproveCertificate, onRevokeCertificate]);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      header={t("certificate_detail")}
      size="lg"
      footerProps={{
        showFooter: true,
        confirmText: modalAction.text !== "" ? t(modalAction.text as any) : "",
        hideConfirmButton: modalAction.text === "" || !modalAction.allowed,
      }}
      onConfirm={handleClickConfirmButton}
      isLoading={props.isLoading}
      {...props}
    >
      <Flex direction="column" gap={12}>
        {certificate ? (
          <>
            <Box className="space-y-3 rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900/60">
              <Text className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                {t("certificate_summary")}
              </Text>
              <Grid columns={2}>
                {summaryItems.map((item) => (
                  <GridCol span={1} key={item.key}>
                    <InfoRowItem
                      label={item.label}
                      value={item.value}
                      showCopyButton={item.allowCopy}
                    />
                  </GridCol>
                ))}
              </Grid>
            </Box>
            <Box className="space-y-3 rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900/60">
              <Text className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                {t("certificate_author_section")}
              </Text>
              <InfoRowItem
                label={t("author_name")}
                value={author?.authorName ?? t("not_updated")}
              />
              <InfoRowItem
                label={t("author_id_card")}
                value={author?.authorIdCard ?? t("not_updated")}
                showCopyButton
              />
              <InfoRowItem
                label={t("email")}
                value={author?.authorEmail ?? t("not_updated")}
                showCopyButton
              />
              <InfoRowItem
                label={t("birthday")}
                value={
                  author?.authorDob
                    ? formatDate(author.authorDob)
                    : t("not_updated")
                }
              />
            </Box>

            <Box className="space-y-3 rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900/60">
              <Text className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                {t("other_information")}
              </Text>
              {certificateCategory ===
                CERTIFICATE_TEMPLATES.GRADUATION_CERTIFICATE && (
                <>
                  <InfoRowItem
                    label={t("reg_no")}
                    value={
                      (additionalInfo?.reg_no as string) ?? t("not_updated")
                    }
                  />
                  <InfoRowItem
                    label={t("serial_number")}
                    value={
                      (additionalInfo?.serial_number as string) ??
                      t("not_updated")
                    }
                    showCopyButton
                  />
                </>
              )}

              {certificateCategory === CERTIFICATE_TEMPLATES.IELTS && (
                <>
                  <Grid gutter="md">
                    <Grid.Col span={{ base: 12, sm: 6 }}>
                      <InfoRowItem
                        label={t("test_report")}
                        value={
                          (additionalInfo?.test_report as string) ??
                          t("not_updated")
                        }
                      />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, sm: 6 }}>
                      <InfoRowItem
                        label={t("candidate_number")}
                        value={
                          (additionalInfo?.candidate_number as string) ??
                          t("not_updated")
                        }
                      />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, sm: 6 }}>
                      <InfoRowItem
                        label={t("candidate_sex")}
                        value={
                          additionalInfo?.candidate_sex
                            ? t(
                                GENDER_LABELS[
                                  additionalInfo.candidate_sex as GENDERS
                                ]
                              )
                            : t("not_updated")
                        }
                      />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, sm: 6 }}>
                      <InfoRowItem
                        label={t("first_language")}
                        value={
                          additionalInfo?.first_language
                            ? t(
                                LANGUAGE_LABELS[
                                  additionalInfo?.first_language as LANGUAGES
                                ]
                              )
                            : t("not_updated")
                        }
                      />
                    </Grid.Col>
                    <Grid.Col span={{ base: 6, sm: 3 }}>
                      <InfoRowItem
                        label={t("listening")}
                        value={
                          (additionalInfo?.listening_result as string) ??
                          t("not_updated")
                        }
                      />
                    </Grid.Col>
                    <Grid.Col span={{ base: 6, sm: 3 }}>
                      <InfoRowItem
                        label={t("speaking")}
                        value={
                          (additionalInfo?.speaking_result as string) ??
                          t("not_updated")
                        }
                      />
                    </Grid.Col>
                    <Grid.Col span={{ base: 6, sm: 3 }}>
                      <InfoRowItem
                        label={t("writing")}
                        value={
                          (additionalInfo?.writing_result as string) ??
                          t("not_updated")
                        }
                      />
                    </Grid.Col>
                    <Grid.Col span={{ base: 6, sm: 3 }}>
                      <InfoRowItem
                        label={t("reading")}
                        value={
                          (additionalInfo?.reading_result as string) ??
                          t("not_updated")
                        }
                      />
                    </Grid.Col>
                  </Grid>
                </>
              )}
            </Box>

            <Flex gap={10}>
              <Box className="flex-1 w-full space-y-3 rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900/60">
                <Text className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  {t("certificate_transactions_section")}
                </Text>
                {txItems.map((tx) => (
                  <InfoRowItem
                    key={tx.key}
                    label={tx.label}
                    value={tx.value}
                    icon={tx.icon}
                    showCopyButton
                    disabledCopyButton={tx.disabledCopyButton}
                  />
                ))}
              </Box>
            </Flex>
          </>
        ) : (
          <Text className="text-sm text-slate-500 dark:text-slate-400">
            {t("not_updated")}
          </Text>
        )}
      </Flex>
    </Modal>
  );
};
