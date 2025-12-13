import { CERTIFICATE_STATUSES } from "@/enums";
import { CertificateResponseType } from "@/types";
import { ActionIcon, Badge, Box, Flex, Text } from "@mantine/core";
import { useTranslations } from "next-intl";
import {
  ButtonMore,
  DropdownMenu,
  DropdownMenuItemProps,
  InfoRowItem,
  Image,
} from "@/components";
import { IMAGES } from "@/constants";
import {
  PiEnvelopeSimple,
  PiCalendarCheck,
  PiTrafficConeThin,
  PiShieldCheck,
} from "react-icons/pi";
import { BiShow, BiEdit, BiTrash, BiCheckCircle, BiBlock } from "react-icons/bi";
import { formatDate } from "@/helpers";

type CertificateItemProps = {
  certificate: CertificateResponseType;
  onClick?: (certificate: CertificateResponseType) => void;
  onShowDetail?: (certificate: CertificateResponseType) => void;
  onUpdate?: (certificate: CertificateResponseType) => void;
  onDelete?: (certificate: CertificateResponseType) => void;
  onShowIssuerDetail?: (issuer: CertificateResponseType["issuer"]) => void;
  onApprove?: (certificate: CertificateResponseType) => void;
  onRevoke?: (certificate: CertificateResponseType) => void;
  onSign?: (certificate: CertificateResponseType) => void;
  canSign?: boolean;
  canApprove?: boolean;
  canRevoke?: boolean;
};

const STATUS_COLOR: Partial<Record<CERTIFICATE_STATUSES, string>> = {
  [CERTIFICATE_STATUSES.CREATED]: "#2563EB",
  [CERTIFICATE_STATUSES.SIGNED]: "#2563EB",
  [CERTIFICATE_STATUSES.VERIFIED]: "#16A34A",
  [CERTIFICATE_STATUSES.REVOKED]: "#DC2626",
};

export const CertificateItem = ({
  certificate,
  onClick,
  onShowDetail,
  onUpdate,
  onDelete,
  onShowIssuerDetail,
  onApprove,
  onRevoke,
  onSign,
  canSign,
  canApprove,
  canRevoke,
}: CertificateItemProps) => {
  const t = useTranslations();
  const author = certificate.authorProfile;
  const issuer = certificate.issuer;

  const normalize = (value?: string | null) => value?.trim() || "";
  const badgeColor = STATUS_COLOR[certificate.status] ?? "#0EA5E9";

  const authorName = normalize(author?.authorName) || t("not_updated");
  const authorAvatar = author?.authorImage?.trim();
  const authorInitial =
    authorName.charAt(0)?.toUpperCase() ||
    certificate.code?.charAt(0)?.toUpperCase() ||
    "C";
  const issuerAvatar = normalize(issuer?.avatar) || IMAGES.default.avatar;
  const issuerFullName =
    [normalize(issuer?.firstName), normalize(issuer?.lastName)]
      .filter(Boolean)
      .join(" ")
      .trim() || t("not_updated");
  const issuerEmail = normalize(issuer?.email) || t("not_updated");

  const actionMenuItems: DropdownMenuItemProps[] = [];
  if (onShowDetail) {
    actionMenuItems.push({
      id: "detail",
      label: t("view_detail"),
      leftIcon: <BiShow />,
      onClick: () => onShowDetail(certificate),
    });
  }
  if (canSign && onSign) {
    actionMenuItems.push({
      id: "sign",
      label: t("sign_certificate"),
      leftIcon: <BiCheckCircle />,
      onClick: () => onSign(certificate),
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
  if (canApprove && onApprove) {
    actionMenuItems.push({
      id: "approve",
      label: t("approve"),
      leftIcon: <BiCheckCircle />,
      onClick: () => onApprove(certificate),
    });
  }
  if (canRevoke && onRevoke) {
    actionMenuItems.push({
      id: "revoke",
      label: t("revoke"),
      leftIcon: <BiBlock />,
      onClick: () => onRevoke(certificate),
    });
  }

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
              {author?.authorIdCard ?? t("not_updated")}
            </Text>
          </Flex>
        </Flex>
      </Flex>

      <Flex gap={8} direction="column">
        <InfoRowItem
          icon={PiEnvelopeSimple}
          label={t("certificate_code")}
          value={certificate?.code ?? t("not_updated")}
          showCopyButton
        />

        <InfoRowItem
          icon={PiEnvelopeSimple}
          label={t("email")}
          value={author?.authorEmail ?? t("not_updated")}
        />

        <Flex gap={12} wrap="wrap">
          <div className="flex-1">
            <InfoRowItem
              icon={PiTrafficConeThin}
              label={t("birthday")}
              value={
                author?.authorDob
                  ? formatDate(author.authorDob)
                  : t("not_updated")
              }
            />
          </div>
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

        <InfoRowItem
          icon={PiEnvelopeSimple}
          label={t("certificate_type")}
          value={certificate?.certificateType?.name ?? t("not_updated")}
        />

        <InfoRowItem
          icon={PiCalendarCheck}
          label={t("valid_period")}
          value={`${formatDate(certificate.validFrom) || t("not_updated")} - ${
            formatDate(certificate.validTo) || t("not_updated")
          }`}
        />
        <Box className="rounded-lg border border-slate-200 px-3 py-3 dark:border-slate-700">
          <Text className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {t("issuer")}
          </Text>
          <Flex align="center" gap={12} justify="space-between">
            <Flex align="center" gap={12} className="min-w-0 flex-1">
              <Box className="relative h-10 w-10 shrink-0 overflow-hidden rounded-sm bg-slate-100 dark:bg-slate-800/60">
                <Image
                  src={issuerAvatar}
                  alt="issuer avatar"
                  className="h-full w-full object-cover"
                  wrapperClassName="h-full w-full"
                  fallbackSrc={IMAGES.default.avatar}
                />
              </Box>
              <Flex direction="column" gap={4} className="min-w-0">
                <Text className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {issuerFullName}
                </Text>
                <Text className="truncate text-xs text-slate-500 dark:text-slate-400">
                  {issuerEmail}
                </Text>
              </Flex>
            </Flex>
            <ActionIcon
              variant="light"
              color="blue"
              onClick={(event) => {
                event.stopPropagation();
                if (!issuer) return;
                onShowIssuerDetail?.(issuer);
              }}
            >
              <BiShow />
            </ActionIcon>
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
};
