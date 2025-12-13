"use client";

import CertificateABI from "@/abis/CertificateABI.json";
import { Modal, type BaseModalProps } from "@/components";
import {
  ARBITRUM_SEPOLIA_RPC_URL,
  ARBITRUM_SEPOLIA_URL,
  envs,
} from "@/constants";
import { CertificateResponseType } from "@/types";
import { Box, Stack, Text, ThemeIcon } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { BrowserProvider, Contract } from "ethers";
import { useTranslations } from "next-intl";
import { useCallback, useMemo, useState } from "react";
import { PiCheckCircleBold } from "react-icons/pi";

type SignCertificateModalProps = {
  certificate: CertificateResponseType | null;
  onSignSuccess?: () => void;
} & Omit<BaseModalProps, "children" | "onConfirm" | "isLoading">;

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

const getSigningErrorMessage = (
  error: unknown,
  t: ReturnType<typeof useTranslations>
) => {
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

export const SignCertificateModal = ({
  certificate,
  opened = false,
  onClose,
  onSignSuccess,
  ...props
}: SignCertificateModalProps) => {
  const t = useTranslations();
  const [isSigning, setIsSigning] = useState(false);

  const certificateCode = certificate?.code?.trim() || t("not_updated");
  const authorName =
    certificate?.authorProfile?.authorName?.trim() || t("not_updated");
  const certificateTypeName =
    certificate?.certificateType?.name?.trim() || t("not_updated");

  const summary = useMemo(() => {
    if (!certificate) return [];
    return [
      {
        label: t("certificate_code"),
        value: certificate.code || t("not_updated"),
      },
      {
        label: t("author_name"),
        value: authorName,
      },
      {
        label: t("certificate_type_name"),
        value: certificateTypeName,
      },
    ];
  }, [certificate, t]);

  const handleSignCertificate = useCallback(async () => {
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

      notifications.show({
        title: t("certificate_signing"),
        message: t("certificate_submitted_success", { hash: tx.hash }),
        color: "green",
      });
      onSignSuccess?.();
      onClose?.();
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
  }, [certificate, isSigning, t, onSignSuccess, onClose]);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      header={
        <Text className="text-center text-lg font-semibold text-blue-900 dark:text-blue-100">
          {t("certificate_signing")}
        </Text>
      }
      contentClassNames={{
        wrapper:
          "rounded-2xl overflow-hidden bg-white dark:bg-dark-7 shadow-xl border border-blue-100/60 dark:border-blue-900/30",
        headerBox:
          "border-none bg-gradient-to-r from-blue-200 via-indigo-200 to-cyan-200 dark:from-blue-900/40 dark:via-indigo-900/40 dark:to-cyan-900/30 px-5 py-3",
        closeButton:
          "top-3 right-3 bg-white/60 hover:bg-white/70 text-blue-600 dark:bg-white/10 dark:text-blue-100 shadow-sm",
        closeIcon: "text-xl",
        footerBox: "border-none bg-blue-50/80 px-1 py-3 dark:bg-dark-6",
        footerActions: "justify-end gap-3",
        cancelButton:
          "border-blue-200 text-blue-600 hover:bg-blue-50 dark:border-blue-900/40 dark:text-blue-200 dark:hover:bg-blue-900/20",
        confirmButton: "bg-blue-600 hover:bg-blue-500",
      }}
      footerProps={{
        showFooter: true,
        confirmText: t("sign_certificate"),
        cancelText: t("cancel"),
      }}
      onConfirm={handleSignCertificate}
      isLoading={isSigning}
      radius="lg"
      size="md"
      {...props}
    >
      <Stack gap="md" className="px-1">
        <Stack gap={12} align="center">
          <ThemeIcon
            radius="xl"
            size={64}
            color="blue"
            variant="light"
            className="shadow-inner"
          >
            <PiCheckCircleBold className="text-3xl" />
          </ThemeIcon>
          <Text
            ta="center"
            className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed"
          >
            {t("sign_certificate_confirmation", { code: certificateCode })}
          </Text>
        </Stack>
        <Box className="rounded-lg border border-blue-100/70 bg-blue-50/80 px-4 py-3 text-center dark:border-blue-900/40 dark:bg-blue-950/40">
          <Stack gap={4} align="center">
            <Text fw={600} className="text-sm text-blue-700 dark:text-blue-200">
              {certificateCode}
            </Text>
          </Stack>
        </Box>
        <Box className="space-y-2 rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900/60">
          {summary.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between text-sm"
            >
              <Text className="text-slate-600 dark:text-slate-300">
                {item.label}
              </Text>
              <Text className="font-semibold text-sm text-slate-900 dark:text-white">
                {item.value}
              </Text>
            </div>
          ))}
        </Box>
      </Stack>
    </Modal>
  );
};
