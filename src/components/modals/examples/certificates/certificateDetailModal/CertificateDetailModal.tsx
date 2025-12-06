"use client";

import CertificateABI from "@/abis/CertificateABI.json";
import { Modal, type BaseModalProps, InfoRowItem } from "@/components";
import {
  ARBITRUM_SEPOLIA_RPC_URL,
  ARBITRUM_SEPOLIA_URL,
  envs,
} from "@/constants";
import { CERTIFICATE_REQUEST_TYPES, CERTIFICATE_STATUSES } from "@/enums";
import { formatDate } from "@/helpers";
import { useSubmitCertificateForVerify } from "@/mutations";
import { CertificateResponseType } from "@/types";
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

const getSigningErrorMessage = (error: unknown) => {
  if (isInsufficientFundsError(error)) {
    return "Bạn không đủ ETH trong tài khoản để thanh toán phí gas trên Arbitrum testnet.";
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Unable to sign certificate. Please try again.";
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

  const handleSignCertificate = async () => {
    if (!certificate || isSigning) return;

    const contractAddress = envs.CONTRACT_ADDRESS?.trim();
    if (!contractAddress || contractAddress === "no value") {
      notifications.show({
        title: "Certificate signing",
        message: "Contract address is not configured.",
        color: "red",
      });
      return;
    }

    const provider = getMetaMaskProvider();
    if (!provider) {
      notifications.show({
        title: "Certificate signing",
        message: "MetaMask wallet is not detected in this browser.",
        color: "red",
      });
      return;
    }

    const authorProfile = certificate.authorProfile;
    if (!authorProfile) {
      notifications.show({
        title: "Certificate signing",
        message: "Author profile is missing on this certificate.",
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
    if (!certificateId) missingFields.push("certificate id");
    if (!organizationId) missingFields.push("organization id");
    if (!certificateTypeId) missingFields.push("certificate type");
    if (!holderIdCard) missingFields.push("holder id card");
    if (!holderCountryCode) missingFields.push("holder country");
    if (Number.isNaN(normalizedGrantLevel)) missingFields.push("grant level");
    if (!expireTime) missingFields.push("expire time");
    if (!ipfsHash) missingFields.push("certificate hash");

    if (missingFields.length) {
      notifications.show({
        title: "Certificate signing",
        message: `Missing data: ${missingFields.join(", ")}.`,
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
        title: "Certificate signing",
        message: `Submitted certificate on-chain. Tx: ${tx.hash}`,
        color: "green",
      });
    } catch (error) {
      console.error("sign_certificate_error", error);
      notifications.show({
        title: "Certificate signing",
        message: getSigningErrorMessage(error),
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
