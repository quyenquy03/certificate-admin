"use client";

import CertificateABI from "@/abis/CertificateABI.json";
import { Modal, type BaseModalProps } from "@/components/modals/bases";
import { envs } from "@/constants";
import { formatDate } from "@/helpers";
import { CertificateResponseType } from "@/types";
import { Box, Flex, Text, ActionIcon } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { BrowserProvider, Contract } from "ethers";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { FiCopy } from "react-icons/fi";
import { HiOutlineQrCode } from "react-icons/hi2";

type CertificateDetailModalProps = {
  certificate: CertificateResponseType | null;
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
  rpcUrls: ["https://sepolia-rollup.arbitrum.io/rpc"],
  blockExplorerUrls: ["https://sepolia-explorer.arbitrum.io"],
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

const getDisplayValue = (value?: string | null, fallback?: string) => {
  const trimmed = value?.trim();
  if (trimmed && trimmed.length > 0) return trimmed;
  return fallback ?? "";
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
  ...props
}: CertificateDetailModalProps) => {
  const t = useTranslations();
  const [isSigning, setIsSigning] = useState(false);

  const author = certificate?.authorProfile;
  const authorName = getDisplayValue(author?.authorName, t("not_updated"));
  const authorEmail = getDisplayValue(author?.authorEmail, t("not_updated"));
  const authorIdCard = getDisplayValue(author?.authorIdCard, t("not_updated"));
  const authorDob =
    (author?.authorDob && formatDate(author.authorDob)) ?? t("not_updated");

  const copyToClipboard = async (value?: string | null) => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
    } catch (error) {
      console.error("copy_error", error);
    }
  };

  const renderCopyableRow = (
    label: string,
    value?: string | null,
    options?: { allowCopy?: boolean }
  ) => {
    const displayValue = getDisplayValue(value, t("not_updated"));
    const allowCopy = options?.allowCopy && !!value && value.trim().length > 0;

    return (
      <Flex
        gap={8}
        align="center"
        className="rounded-lg border border-slate-200 px-3 py-3 dark:border-slate-700"
      >
        <Flex direction="column" gap={4} className="flex-1 min-w-0">
          <Text className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {label}
          </Text>
          <Text className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
            {displayValue}
          </Text>
        </Flex>
        {allowCopy && (
          <ActionIcon
            variant="subtle"
            color="blue"
            onClick={() => copyToClipboard(value)}
          >
            <FiCopy />
          </ActionIcon>
        )}
      </Flex>
    );
  };

  if (!certificate) {
    return (
      <Modal
        opened={opened}
        onClose={onClose}
        header={t("certificate_detail")}
        {...props}
      >
        <Text className="text-sm text-slate-500 dark:text-slate-400">
          {t("not_updated")}
        </Text>
      </Modal>
    );
  }

  const summaryItems = [
    {
      key: "code",
      label: t("certificate_code"),
      value: certificate.code ? `${certificate.code}` : t("not_updated"),
      allowCopy: Boolean(certificate.code),
    },
    {
      key: "hash",
      label: t("certificate_hash"),
      value:
        getDisplayValue(certificate.certificateHash, t("not_updated")) ?? "",
      allowCopy: Boolean(certificate.certificateHash),
    },
    {
      key: "certificateType",
      label: t("certificate_type_name"),
      value:
        getDisplayValue(certificate.certificateType?.name, t("not_updated")) ??
        "",
    },
  ];

  const txItems = [
    {
      key: "signed",
      label: t("signed_tx_hash"),
      value: certificate.signedTxHash,
    },
    {
      key: "approved",
      label: t("approved_tx_hash"),
      value: certificate.approvedTxHash,
    },
    {
      key: "revoked",
      label: t("revoked_tx_hash"),
      value: certificate.revokedTxHash,
    },
  ];

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
        certificateId,
        organizationId,
        certificateTypeId,
        holderIdCard,
        holderCountryCode,
        BigInt(normalizedGrantLevel),
        BigInt(expireTime!),
        ipfsHash
      );

      await tx.wait();

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

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      header={t("certificate_detail")}
      size="lg"
      footerProps={{
        showFooter: true,
        confirmText: "Sign",
      }}
      onConfirm={handleSignCertificate}
      isLoading={isSigning}
      {...props}
    >
      <Flex direction="column" gap={12}>
        <Box className="space-y-3 rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900/60">
          <Text className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {t("certificate_summary")}
          </Text>
          <Flex gap={8} wrap="wrap">
            {summaryItems.map((item) => (
              <Flex
                key={item.key}
                gap={8}
                className="flex-1 min-w-[180px] rounded-lg border border-slate-200 px-3 py-2 dark:border-slate-700"
              >
                <Flex direction="column" gap={2} className="min-w-0 flex-1">
                  <Text className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    {item.label}
                  </Text>
                  <Text className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
                    {item.value}
                  </Text>
                </Flex>
                {item.allowCopy && (
                  <ActionIcon
                    variant="subtle"
                    color="blue"
                    onClick={() => copyToClipboard(item.value)}
                  >
                    <FiCopy />
                  </ActionIcon>
                )}
              </Flex>
            ))}
            <Flex
              gap={8}
              className="flex-1 min-w-[180px] rounded-lg border border-slate-200 px-3 py-2 dark:border-slate-700"
            >
              <Flex direction="column" gap={2} className="min-w-0 flex-1">
                <Text className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  {t("valid_period")}
                </Text>
                <Text className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  {(formatDate(certificate.validFrom) || t("not_updated")) +
                    " - " +
                    (formatDate(certificate.validTo) || t("not_updated"))}
                </Text>
              </Flex>
            </Flex>
          </Flex>
        </Box>

        <Box className="space-y-3 rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900/60">
          <Text className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {t("certificate_author_section")}
          </Text>
          {renderCopyableRow(t("author_name"), authorName)}
          {renderCopyableRow(t("author_id_card"), authorIdCard, {
            allowCopy: Boolean(author?.authorIdCard),
          })}
          {renderCopyableRow(t("email"), authorEmail, {
            allowCopy: Boolean(author?.authorEmail),
          })}
          {renderCopyableRow(t("birthday"), authorDob)}
        </Box>

        <Flex gap={10}>
          <Box className="flex-1 space-y-3 rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900/60">
            <Text className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              {t("certificate_transactions_section")}
            </Text>
            {txItems.map((tx) => (
              <Flex
                key={tx.key}
                gap={8}
                align="center"
                className="rounded-lg border border-slate-200 px-3 py-2 dark:border-slate-700"
              >
                <Box className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-800/60 dark:text-slate-200">
                  <HiOutlineQrCode className="h-4 w-4" />
                </Box>
                <Flex direction="column" gap={2} className="min-w-0 flex-1">
                  <Text className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    {tx.label}
                  </Text>
                  <Text className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
                    {getDisplayValue(tx.value, t("not_updated"))}
                  </Text>
                </Flex>
                <ActionIcon
                  variant="subtle"
                  color="blue"
                  disabled={!tx.value}
                  onClick={() => tx.value && copyToClipboard(tx.value)}
                >
                  <FiCopy />
                </ActionIcon>
              </Flex>
            ))}
          </Box>
        </Flex>
      </Flex>
    </Modal>
  );
};
