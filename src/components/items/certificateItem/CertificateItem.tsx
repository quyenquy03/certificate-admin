import { CERTIFICATE_STATUSES } from "@/enums";
import { CertificateResponseType } from "@/types";
import {
  ActionIcon,
  Badge,
  Box,
  Flex,
  Text,
  Tooltip,
} from "@mantine/core";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";
import {
  ButtonMore,
  DropdownMenu,
  DropdownMenuItemProps,
} from "@/components";
import { HiOutlineQrCode } from "react-icons/hi2";
import {
  PiEnvelopeSimple,
  PiCalendarCheck,
  PiTrafficConeThin,
  PiShieldCheck,
} from "react-icons/pi";
import { BiShow, BiEdit, BiTrash } from "react-icons/bi";
import { FiCopy } from "react-icons/fi";

type CertificateItemProps = {
  certificate: CertificateResponseType;
  onClick?: (certificate: CertificateResponseType) => void;
  onShowDetail?: (certificate: CertificateResponseType) => void;
  onUpdate?: (certificate: CertificateResponseType) => void;
  onDelete?: (certificate: CertificateResponseType) => void;
};

const STATUS_COLOR: Partial<Record<CERTIFICATE_STATUSES, string>> = {
  [CERTIFICATE_STATUSES.CREATED]: "#2563EB",
};

const formatDate = (value?: string | null) => {
  if (!value) return "";
  return dayjs(value).format("DD/MM/YYYY");
};

export const CertificateItem = ({
  certificate,
  onClick,
  onShowDetail,
  onUpdate,
  onDelete,
}: CertificateItemProps) => {
  const t = useTranslations();
  const author = certificate.authorProfile;

  const normalize = (value?: string | null) => value?.trim() || "";
  const badgeColor = STATUS_COLOR[certificate.status] ?? "#0EA5E9";

  const authorName = normalize(author?.authorName) || t("not_updated");
  const authorAvatar = author?.authorImage?.trim();
  const authorInitial =
    authorName.charAt(0)?.toUpperCase() ||
    certificate.code?.charAt(0)?.toUpperCase() ||
    "C";

  const authorIdCard = normalize(author?.authorIdCard) || t("not_updated");
  const authorEmail = normalize(author?.authorEmail) || t("not_updated");
  const authorDob = formatDate(author?.authorDob) || t("not_updated");

  const txItems = [
    { key: "signed", label: t("signed_tx_hash"), value: certificate.signedTxHash },
    { key: "approved", label: t("approved_tx_hash"), value: certificate.approvedTxHash },
    { key: "revoked", label: t("revoked_tx_hash"), value: certificate.revokedTxHash },
  ];

  const actionMenuItems: DropdownMenuItemProps[] = [];
  if (onShowDetail) {
    actionMenuItems.push({
      id: "detail",
      label: t("view_detail"),
      leftIcon: <BiShow />,
      onClick: () => onShowDetail(certificate),
    });
  }
  if (onUpdate) {
    actionMenuItems.push({
      id: "update",
      label: t("update"),
      leftIcon: <BiEdit />,
      onClick: () => onUpdate(certificate),
    });
  }
  if (onDelete) {
    actionMenuItems.push({
      id: "delete",
      label: t("delete"),
      leftIcon: <BiTrash />,
      onClick: () => onDelete(certificate),
    });
  }

  const copyToClipboard = async (value?: string | null) => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
    } catch (error) {
      console.error("copy_error", error);
    }
  };

  return (
    <Box
      className="min-h-28 relative rounded-lg bg-background-primary-light p-3 shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg dark:bg-background-primary-dark dark:shadow-slate-800"
      onClick={() => onClick?.(certificate)}
    >
      {actionMenuItems.length > 0 && (
        <DropdownMenu items={actionMenuItems} position="bottom-end">
          <Box
            className="absolute top-3 right-3 z-10"
            onClick={(event) => event.stopPropagation()}
          >
            <ButtonMore />
          </Box>
        </DropdownMenu>
      )}
      <Box
        className="absolute inset-x-0 top-0 h-1 w-full rounded-t-lg"
        style={{
          background: `linear-gradient(90deg, ${badgeColor} 0%, ${badgeColor}bb 100%)`,
        }}
      />

      <Flex gap={12} align="center" justify="space-between" className="pb-4">
        <Flex gap={12} align="center" className="min-w-0">
          <Box
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-slate-100 text-base font-semibold text-slate-600 dark:bg-slate-800/60 dark:text-slate-100"
            style={
              authorAvatar
                ? {
                    backgroundImage: `url(${authorAvatar})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }
                : {
                    background: `linear-gradient(135deg, ${badgeColor}1A 0%, ${badgeColor} 100%)`,
                    color: "#fff",
                  }
            }
          >
            {!authorAvatar && authorInitial}
          </Box>
          <Flex direction="column" gap={4} className="min-w-0">
            <Text className="truncate text-base font-semibold text-slate-900 dark:text-slate-100">
              {authorName}
            </Text>
            <Text className="truncate text-xs text-slate-500 dark:text-slate-400">
              {authorIdCard}
            </Text>
          </Flex>
        </Flex>
      </Flex>

      <Flex gap={8} direction="column">
        <Flex
          gap={10}
          className="rounded-md border border-slate-200 px-3 py-3 dark:border-slate-700"
        >
          <Box className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-800/60 dark:text-slate-200">
            <PiEnvelopeSimple className="h-4 w-4" />
          </Box>
          <Flex direction="column" gap={4} className="min-w-0 flex-1">
            <Text className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              {t("email")}
            </Text>
            <Text className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
              {authorEmail}
            </Text>
          </Flex>
        </Flex>

        <Flex
          gap={10}
          className="rounded-md border border-slate-200 px-3 py-3 dark:border-slate-700"
        >
          <Box className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-800/60 dark:text-slate-200">
            <PiCalendarCheck className="h-4 w-4" />
          </Box>
          <Flex direction="column" gap={4} className="min-w-0 flex-1">
            <Text className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              {t("valid_period")}
            </Text>
            <Text className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
              {(formatDate(certificate.validFrom) || t("not_updated")) +
                " - " +
                (formatDate(certificate.validTo) || t("not_updated"))}
            </Text>
          </Flex>
        </Flex>

        <Flex gap={12} wrap="wrap">
          <Flex
            gap={10}
            className="flex-1 min-w-[200px] items-center rounded-md border border-slate-200 px-3 py-3 dark:border-slate-700"
          >
            <Box className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-800/60 dark:text-slate-200">
              <PiTrafficConeThin className="h-4 w-4" />
            </Box>
            <Flex direction="column" gap={4} className="min-w-0 flex-1">
              <Text className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                {t("birthday")}
              </Text>
              <Text className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
                {authorDob}
              </Text>
            </Flex>
          </Flex>

          <Flex
            gap={10}
            className="flex-1 min-w-[200px] items-center rounded-md border border-slate-200 px-3 py-3 dark:border-slate-700"
          >
            <Box className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-800/60 dark:text-slate-200">
              <PiShieldCheck className="h-4 w-4" />
            </Box>
            <Flex direction="column" gap={4} className="min-w-0 flex-1">
              <Text className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                {t("status")}
              </Text>
              <Badge
                size="sm"
                variant="light"
                styles={{
                  root: {
                    backgroundColor: `${badgeColor}20`,
                    color: badgeColor,
                  },
                }}
              >
                {t(certificate.status as any)}
              </Badge>
            </Flex>
          </Flex>
        </Flex>
      </Flex>

      <Flex direction="column" gap={8} className="mt-3">
        {txItems.map((item) => {
          const displayValue = normalize(item.value) || t("not_updated");
          const disabled = !normalize(item.value);

          return (
            <Flex
              key={item.key}
              gap={10}
              align="center"
              className="rounded-md border border-slate-200 px-3 py-3 dark:border-slate-700"
            >
              <Box className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-800/60 dark:text-slate-200">
                <HiOutlineQrCode className="h-4 w-4" />
              </Box>
              <Flex direction="column" gap={4} className="min-w-0 flex-1">
                <Text className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  {item.label}
                </Text>
                <Text className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
                  {displayValue}
                </Text>
              </Flex>
              <Tooltip label={t("copy")} withArrow disabled={disabled}>
                <ActionIcon
                  variant="subtle"
                  color="blue"
                  disabled={disabled}
                  onClick={(e) => {
                    e.stopPropagation();
                    copyToClipboard(item.value);
                  }}
                >
                  <FiCopy />
                </ActionIcon>
              </Tooltip>
            </Flex>
          );
        })}
      </Flex>
    </Box>
  );
};




