"use client";

import CertificateABI from "@/abis/CertificateABI.json";
import { Modal, type BaseModalProps, InfoRowItem } from "@/components";
import {
  ARBITRUM_SEPOLIA_RPC_URL,
  ARBITRUM_SEPOLIA_URL,
  envs,
  GENDER_LABELS,
  LANGUAGE_LABELS,
} from "@/constants";
import {
  CERTIFICATE_CATEGORIES,
  CERTIFICATE_REQUEST_TYPES,
  CERTIFICATE_STATUSES,
  GENDERS,
  LANGUAGES,
} from "@/enums";
import { formatDate } from "@/helpers";
import { useSubmitCertificateForVerify } from "@/mutations";
import { AdditionalInfoType, CertificateResponseType } from "@/types";
import { Box, Flex, Text, ActionIcon, Grid, GridCol } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { BrowserProvider, Contract } from "ethers";
import { useTranslations } from "next-intl";
import { useCallback, useMemo, useState } from "react";
import { FiCopy } from "react-icons/fi";
import { HiOutlineQrCode } from "react-icons/hi2";

type CertificateDetailModalProps = {
  certificate: CertificateResponseType | null;
  onSignSuccess?: () => void;
} & Omit<BaseModalProps, "children">;

type Eip1193Provider = {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  isMetaMask?: boolean;
  providers?: Eip1193Provider[];
};

type TranslateFn = ReturnType<typeof useTranslations>;

const ARBITRUM_TESTNET_PARAMS = {
  chainId: "0x66eee",
  chainName: "Arbitrum Sepolia",
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: [ARBITRUM_SEPOLIA_RPC_URL],
  blockExplorerUrls: [ARBITRUM_SEPOLIA_URL],
};

const getMetaMaskProvider = (): Eip1193Provider | undefined => {
  if (typeof window === "undefined") return undefined;
  const anyWindow = window as typeof window & {
    ethereum?: Eip1193Provider & { providers?: Eip1193Provider[] };
  };
  const { ethereum } = anyWindow ?? {};

  if (!ethereum) return undefined;

  if (Array.isArray(ethereum.providers)) {
    return ethereum.providers.find((provider) => provider?.isMetaMask);
  }

  if (ethereum.isMetaMask) return ethereum;

  return undefined;
};

const isInsufficientFundsError = (error: unknown) => {
  const code = (error as { code?: string | number })?.code;
  if (
    code === "INSUFFICIENT_FUNDS" ||
    code === "INSUFFICIENT_FUNDS_ERROR" ||
    code === -32000
  ) {
    return true;
  }

  const message = (error as { message?: string })?.message?.toLowerCase();
  return message?.includes("insufficient funds") ?? false;
};

const getSigningErrorMessage = (error: unknown, t: TranslateFn) => {
  if (isInsufficientFundsError(error)) {
    return t("sign_certificate_insufficient_funds");
  }
  if (error instanceof Error) {
    return error.message;
  }
  return t("sign_certificate_error_generic");
};

const ensureArbitrumTestnet = async (provider: Eip1193Provider) => {
  const targetChainId = ARBITRUM_TESTNET_PARAMS.chainId;
  const currentChainId = (await provider.request({
    method: "eth_chainId",
  })) as string | undefined;

  if (currentChainId?.toLowerCase() === targetChainId.toLowerCase()) {
    return;
  }

  try {
    await provider.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: targetChainId }],
    });
  } catch (error) {
    const requestError = error as { code?: number };
    if (requestError?.code === 4902) {
      await provider.request({
        method: "wallet_addEthereumChain",
        params: [ARBITRUM_TESTNET_PARAMS],
      });
      await provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: targetChainId }],
      });
      return;
    }
    throw error;
  }
};

export const CertificateDetailModal = ({
  certificate,
  opened,
  onClose,
  onSignSuccess,
  ...props
}: CertificateDetailModalProps) => {
  const t = useTranslations();
  const [isSigning, setIsSigning] = useState(false);

  const author = certificate?.authorProfile;

  const { mutateAsync: submitCertificateForVerify, isPending: isSubmitting } =
    useSubmitCertificateForVerify();

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
        return CERTIFICATE_CATEGORIES.IELTS;
      case "TOEIC":
        return CERTIFICATE_CATEGORIES.TOEIC;
      case "CN001":
      case "KS01":
        return CERTIFICATE_CATEGORIES.GRADUATION_CERTIFICATE;
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

  const handleSignCertificate = async () => {
    if (!certificate || isSigning) return;

    const contractAddress = envs.CONTRACT_ADDRESS?.trim();
    if (!contractAddress || contractAddress === "no value") {
      notifications.show({
        title: t("certificate_signing"),
        message: t("contract_address_not_configured"),
        color: "red",
      });
      return;
    }

    const provider = getMetaMaskProvider();
    if (!provider) {
      notifications.show({
        title: t("certificate_signing"),
        message: t("metamask_not_detected"),
        color: "red",
      });
      return;
    }

    const authorProfile = certificate.authorProfile;
    if (!authorProfile) {
      notifications.show({
        title: t("certificate_signing"),
        message: t("author_profile_missing"),
        color: "red",
      });
      return;
    }

    const certificateId = certificate.id?.trim();
    const organizationId = certificate.organizationId?.trim();
    const certificateTypeId = certificate.certificateTypeId?.trim();
    const holderIdCard = authorProfile.authorIdCard?.trim();
    const holderCountryCode = authorProfile.authorCountryCode;
    const rawGrantLevel = Number(authorProfile.grantLevel ?? 0);
    const normalizedGrantLevel = Number.isFinite(rawGrantLevel)
      ? Math.trunc(rawGrantLevel)
      : Number.NaN;
    const expireTime = certificate.validTo
      ? Math.floor(new Date(certificate.validTo).getTime() / 1000)
      : undefined;
    const ipfsHash = certificate.certificateHash?.trim();

    const missingFields: string[] = [];
    if (!certificateId) missingFields.push(t("certificate_id"));
    if (!organizationId) missingFields.push(t("organization_id"));
    if (!certificateTypeId) missingFields.push(t("certificate_type"));
    if (!holderIdCard) missingFields.push(t("author_id_card"));
    if (!holderCountryCode) missingFields.push(t("holder_country"));
    if (Number.isNaN(normalizedGrantLevel))
      missingFields.push(t("certificate_grant_level"));
    if (!expireTime) missingFields.push(t("valid_to"));
    if (!ipfsHash) missingFields.push(t("certificate_hash"));

    if (missingFields.length) {
      notifications.show({
        title: t("certificate_signing"),
        message: t("missing_certificate_data", {
          fields: missingFields.join(", "),
        }),
        color: "red",
      });
      return;
    }

    try {
      setIsSigning(true);
      await provider.request({ method: "eth_requestAccounts" });
      await ensureArbitrumTestnet(provider);
      const browserProvider = new BrowserProvider(provider as any);
      const signer = await browserProvider.getSigner();
      const contract = new Contract(contractAddress, CertificateABI, signer);

      const tx = await contract.submitCertificate(
        certificate.code,
        organizationId,
        certificateTypeId,
        holderIdCard,
        holderCountryCode,
        BigInt(normalizedGrantLevel),
        BigInt(expireTime!),
        ipfsHash
      );

      await tx.wait();

      onSignSuccess?.();

      notifications.show({
        title: t("certificate_signing"),
        message: t("certificate_submitted_success", { hash: tx.hash }),
        color: "green",
      });
    } catch (error) {
      console.error("sign_certificate_error", error);
      notifications.show({
        title: t("certificate_signing"),
        message: getSigningErrorMessage(error, t),
        color: "red",
      });
    } finally {
      setIsSigning(false);
    }
  };

  const handleClickConfirmButton = useCallback(() => {
    if (!certificate || !certificate?.status) return;
    switch (certificate.status) {
      case CERTIFICATE_STATUSES.CREATED:
        handleSignCertificate();
        return;
      default:
        return;
    }
  }, [certificate]);

  const modalConfirmText = useMemo(() => {
    switch (certificate?.status) {
      case CERTIFICATE_STATUSES.CREATED:
        return "sign_certificate";
      default:
        return "";
    }
  }, [certificate?.status]);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      header={t("certificate_detail")}
      size="lg"
      footerProps={{
        showFooter: true,
        confirmText: modalConfirmText !== "" ? t(modalConfirmText) : "",
        hideConfirmButton: modalConfirmText === "",
      }}
      onConfirm={handleClickConfirmButton}
      isLoading={isSigning || props.isLoading}
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
                CERTIFICATE_CATEGORIES.GRADUATION_CERTIFICATE && (
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

              {certificateCategory === CERTIFICATE_CATEGORIES.IELTS && (
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
