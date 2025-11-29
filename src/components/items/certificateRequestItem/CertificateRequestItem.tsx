import { CERTIFICATE_REQUEST_TYPES } from "@/enums";
import { formatDate } from "@/helpers";
import { CertificateRequestType } from "@/types";
import { Box, Flex, Text } from "@mantine/core";
import { useTranslations } from "next-intl";
import {
  ButtonMore,
  DropdownMenu,
  DropdownMenuItemProps,
  InfoRowItem,
} from "@/components";
import {
  PiCalendarCheck,
  PiCertificate,
  PiEnvelopeSimple,
  PiTrafficConeThin,
} from "react-icons/pi";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
import { BiCheckCircle, BiShow, BiXCircle } from "react-icons/bi";
import React from "react";

type CertificateRequestItemProps = {
  certificateRequest: CertificateRequestType;
  onClick?: (request: CertificateRequestType) => void;
  onShowDetail?: (request: CertificateRequestType) => void;
  onApprove?: (request: CertificateRequestType) => void;
  onReject?: (request: CertificateRequestType) => void;
};

const TYPE_COLOR: Partial<Record<CERTIFICATE_REQUEST_TYPES, string>> = {
  [CERTIFICATE_REQUEST_TYPES.SIGNUP]: "#2563EB",
  [CERTIFICATE_REQUEST_TYPES.REVOKE]: "#EF4444",
};

const normalizeValue = (value?: string | null) => value?.trim() || "";

export const CertificateRequestItem = ({
  certificateRequest,
  onClick,
  onShowDetail,
  onApprove,
  onReject,
}: CertificateRequestItemProps) => {
  const t = useTranslations();

  const author = certificateRequest.certificate?.authorProfile;
  const certificate = certificateRequest.certificate;
  const organization = certificateRequest.organization;

  const headerColor =
    TYPE_COLOR[certificateRequest.requestType] ?? "#2563EB";

  const authorName = normalizeValue(author?.authorName) || t("not_updated");
  const authorAvatar = normalizeValue(author?.authorImage);
  const authorInitial =
    authorName.charAt(0)?.toUpperCase() ||
    certificate?.certificateCode?.charAt(0)?.toUpperCase() ||
    "C";

  const actionMenuItems: DropdownMenuItemProps[] = [];

  if (onShowDetail) {
    actionMenuItems.push({
      id: "detail",
      label: t("view_detail"),
      leftIcon: <BiShow />,
      onClick: () => onShowDetail(certificateRequest),
    });
  }

  if (onApprove) {
    actionMenuItems.push({
      id: "approve",
      label: t("approve"),
      leftIcon: <BiCheckCircle />,
      onClick: () => onApprove(certificateRequest),
    });
  }

  if (onReject) {
    actionMenuItems.push({
      id: "reject",
      label: t("reject"),
      leftIcon: <BiXCircle />,
      onClick: () => onReject(certificateRequest),
    });
  }

  return (
    <Box
      className="min-h-28 relative rounded-lg bg-background-primary-light p-3 shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg dark:bg-background-primary-dark dark:shadow-slate-800"
      onClick={() => onClick?.(certificateRequest)}
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
          background: `linear-gradient(90deg, ${headerColor} 0%, ${headerColor}bb 100%)`,
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
                    background: `linear-gradient(135deg, ${headerColor}1A 0%, ${headerColor} 100%)`,
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
          icon={HiOutlineBuildingOffice2}
          label={t("certificate_organization")}
          value={organization?.name ?? t("not_updated")}
        />
        <InfoRowItem
          icon={PiCertificate}
          label={t("certificate_type_name")}
          value={
            (certificate as any)?.certificateType?.name ??
            (certificate as any)?.certificateTypeName ??
            certificate?.certificateType ??
            t("not_updated")
          }
        />
        <InfoRowItem
          icon={PiEnvelopeSimple}
          label={t("email")}
          value={author?.authorEmail ?? t("not_updated")}
        />
        <InfoRowItem
          icon={PiCalendarCheck}
          label={t("valid_period")}
          value={`${formatDate(certificate?.validFrom) || t("not_updated")} - ${
            formatDate(certificate?.validTo) || t("not_updated")
          }`}
        />

        <InfoRowItem
          icon={PiTrafficConeThin}
          label={t("birthday")}
          value={
            author?.authorDob ? formatDate(author.authorDob) : t("not_updated")
          }
        />
        <InfoRowItem
          icon={PiCalendarCheck}
          label={t("requested_at")}
          value={
            formatDate(certificateRequest.requestedTime) || t("not_updated")
          }
        />
      </Flex>
    </Box>
  );
};
