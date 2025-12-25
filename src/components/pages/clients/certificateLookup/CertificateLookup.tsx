"use client";

import {
  type ChangeEvent,
  type FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Group,
  Paper,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useTranslations } from "next-intl";
import { useZxing } from "react-zxing";
import { FiCornerUpLeft, FiSearch, FiUploadCloud } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { BrowserMultiFormatReader } from "@zxing/library";
import { PAGE_URLS } from "@/constants";
import { envs } from "@/constants/envs";

type LookupMode = "qr" | "code";

export const CertificateLookup = () => {
  const t = useTranslations();
  const router = useRouter();
  const [mode, setMode] = useState<LookupMode>("qr");
  const [codeValue, setCodeValue] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [scannerPaused, setScannerPaused] = useState(true);
  const [hasMediaDevices, setHasMediaDevices] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const decodeSessionRef = useRef(0);

  const isQrMode = mode === "qr";
  const isScannerPaused = !isQrMode || scannerPaused || !hasMediaDevices;

  const handleTriggerUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setMode("qr");
    setScannerPaused(true);
    setCameraError(null);
    void decodeQrFromFile(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const getErrorMessage = (error: unknown) => {
    if (error && typeof error === "object") {
      const asError = error as { message?: string; name?: string };
      if (asError.name === "NotAllowedError") {
        return t("certificate_lookup_camera_permission_error", {
          default:
            "Camera permission blocked. Please allow access and try again.",
        });
      }
      if (asError.name === "NotFoundError") {
        return t("certificate_lookup_camera_not_supported", {
          default:
            "Camera access is not available on this device. Please upload a QR photo instead.",
        });
      }
      if (asError.message) return String(asError.message);
    }
    return t("certificate_lookup_camera_error_default", {
      default: "Cannot start camera. Please check permissions.",
    });
  };

  const extractCertificateCode = (rawValue: string) => {
    const trimmed = rawValue.trim();
    const baseUrl = envs.FRONTEND_URL.trim().replace(/\/+$/, "");
    if (!trimmed || baseUrl === "no value") return null;
    if (!trimmed.startsWith(baseUrl)) return null;

    try {
      const scannedUrl = new URL(trimmed);
      const base = new URL(baseUrl);
      if (scannedUrl.origin !== base.origin) return null;

      const basePath = base.pathname.replace(/\/+$/, "");
      const lookupPath = `${basePath}${PAGE_URLS.CERTIFICATE_LOOKUP}`;
      if (!scannedUrl.pathname.startsWith(`${lookupPath}/`)) return null;

      const codeSegment = scannedUrl.pathname.slice(lookupPath.length + 1);
      const code = codeSegment.split("/")[0];
      return code ? decodeURIComponent(code) : null;
    } catch {
      return null;
    }
  };

  const decodeQrFromFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setCameraError(
        t("certificate_lookup_qr_invalid", {
          default: "Please upload an image file.",
        })
      );
      if (hasMediaDevices) setScannerPaused(false);
      return;
    }

    decodeSessionRef.current += 1;
    const currentSession = decodeSessionRef.current;
    const reader = new BrowserMultiFormatReader();
    const imageUrl = URL.createObjectURL(file);

    try {
      const result = await reader.decodeFromImageUrl(imageUrl);
      if (currentSession !== decodeSessionRef.current) return;
      const extractedCode = extractCertificateCode(result.getText());
      if (!extractedCode) {
        setCameraError(
          t("certificate_lookup_qr_invalid", {
            default: "QR code is not a valid certificate link.",
          })
        );
        return;
      }
      setCameraError(null);
      setCodeValue(extractedCode);
      setMode("code");
    } catch {
      if (currentSession !== decodeSessionRef.current) return;
      setCameraError(
        t("certificate_lookup_qr_invalid", {
          default: "Unable to read QR from the image. Please try another photo.",
        })
      );
      if (hasMediaDevices) setScannerPaused(false);
    } finally {
      reader.reset();
      URL.revokeObjectURL(imageUrl);
    }
  };

  const { ref: videoRef } = useZxing({
    paused: isScannerPaused,
    timeBetweenDecodingAttempts: 200,
    constraints: {
      video: {
        facingMode: "environment",
      },
    },
    onDecodeResult: (result) => {
      const extractedCode = extractCertificateCode(result.getText());
      if (!extractedCode) return;
      setCameraError(null);
      setCodeValue(extractedCode);
      setMode("code");
    },
    onDecodeError: () => {
      // Ignore frame decode errors; decoding continues automatically.
    },
    onError: (error) => {
      setScannerPaused(true);
      setCameraError(getErrorMessage(error));
    },
  });

  useEffect(() => {
    if (isQrMode) {
      setCameraError(null);
      setIsCameraReady(false);
      if (hasMediaDevices) setScannerPaused(false);
    }
  }, [isQrMode, hasMediaDevices]);

  const handleSubmitCode = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // TODO: connect API lookup
    router.push(
      `${PAGE_URLS.CERTIFICATE_LOOKUP}/${encodeURIComponent(codeValue)}`
    );
  };

  const handleResumeCamera = () => {
    if (!hasMediaDevices) return;
    setCameraError(null);
    setIsCameraReady(false);
    setScannerPaused(false);
  };

  useEffect(() => {
    if (typeof navigator === "undefined") return;
    const supported = !!navigator.mediaDevices?.getUserMedia;
    setHasMediaDevices(supported);
    if (!supported) {
      setCameraError(
        t("certificate_lookup_camera_not_supported", {
          default:
            "Camera access is not available on this device. Please upload a QR photo instead.",
        })
      );
      setScannerPaused(true);
    }
  }, [t]);

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.2),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(99,102,241,0.12),transparent_30%),radial-gradient(circle_at_50%_80%,rgba(56,189,248,0.12),transparent_32%)]" />
      <Box className="relative mx-auto max-w-4xl px-6 py-14 text-center text-slate-900 dark:text-slate-100 sm:px-8 md:py-20">
        <Stack gap="md" align="center">
          <Badge color="indigo" variant="light" radius="xl">
            {t("certificate_lookup_badge")}
          </Badge>
          <Title
            order={1}
            className="text-4xl font-semibold text-slate-900 dark:text-slate-100 sm:text-5xl"
          >
            {t("certificate_lookup_title")}
          </Title>
          <Text size="lg" c="dimmed" maw={720}>
            {t("certificate_lookup_subtitle")}
          </Text>
        </Stack>

        <Paper
          radius="xl"
          shadow="xl"
          className="relative mt-10 border border-slate-200 bg-white text-left dark:border-indigo-500/20 dark:bg-slate-950/80"
        >
          <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/60 to-transparent" />
          <Stack gap="lg" className="p-6 sm:p-8">
            <Stack gap="xs" align="center">
              <Title
                order={3}
                className="text-2xl text-slate-900 dark:text-slate-100"
              >
                {isQrMode
                  ? t("certificate_lookup_qr_mode_title")
                  : t("certificate_lookup_code_mode_title")}
              </Title>
              <Text c="dimmed" className="max-w-2xl">
                {isQrMode
                  ? t("certificate_lookup_qr_mode_desc")
                  : t("certificate_lookup_code_mode_desc")}
              </Text>
              <Badge
                color="indigo"
                variant="outline"
                radius="lg"
                leftSection={
                  <span className="block h-2 w-2 rounded-full bg-emerald-400" />
                }
              >
                {isQrMode
                  ? t("certificate_lookup_status_qr")
                  : t("certificate_lookup_status_code")}
              </Badge>
            </Stack>

            {isQrMode ? (
              <Stack gap="lg" align="center">
                <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 via-white to-slate-100 p-6 shadow-inner shadow-indigo-500/10 dark:border-indigo-500/20 dark:from-slate-900/70 dark:via-slate-950 dark:to-slate-950">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.16),transparent_30%),radial-gradient(circle_at_80%_60%,rgba(14,165,233,0.16),transparent_28%)]" />
                  <Stack align="center" gap="md" className="relative">
                    <div className="relative w-full max-w-[300px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-inner shadow-indigo-500/10 dark:border-indigo-500/25 dark:bg-slate-950/80">
                      <div className="relative aspect-square">
                        <video
                          ref={videoRef}
                          className="absolute inset-0 h-full w-full object-cover"
                          autoPlay
                          playsInline
                          muted
                          onPlay={() => setIsCameraReady(true)}
                        />
                        {(!isCameraReady || cameraError || scannerPaused) && (
                          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-white/85 via-white to-white/90 text-center dark:from-slate-900/80 dark:via-slate-950/90 dark:to-slate-950/80">
                            <div className="h-12 w-12 animate-pulse rounded-full border border-indigo-500/30 bg-indigo-500/10" />
                            <Text size="sm" c="dimmed" className="px-6">
                              {cameraError ??
                                t("certificate_lookup_cta_start_camera")}
                            </Text>
                            {(cameraError || scannerPaused) && (
                              <Button
                                size="xs"
                                color="indigo"
                                variant="light"
                                onClick={handleResumeCamera}
                              >
                                {t("certificate_lookup_cta_enable_camera")}
                              </Button>
                            )}
                          </div>
                        )}
                        <div className="pointer-events-none absolute inset-6 rounded-2xl border-2 border-indigo-400/70 shadow-[0_0_0_9999px_rgba(255,255,255,0.75)] dark:shadow-[0_0_0_9999px_rgba(15,23,42,0.65)]" />
                      </div>
                    </div>
                    <Stack gap={4} align="center">
                      <Text
                        fw={600}
                        className="text-slate-900 dark:text-slate-100"
                      >
                        {t("certificate_lookup_qr_hint_title")}
                      </Text>
                      <Text size="sm" c="dimmed" maw={520}>
                        {t("certificate_lookup_qr_hint_desc")}
                      </Text>
                      {fileName && (
                        <Text size="xs" c="indigo.2">
                          {t("certificate_lookup_file_selected", {
                            name: fileName,
                          })}
                        </Text>
                      )}
                      {cameraError && (
                        <Text size="xs" c="yellow.3">
                          {t("certificate_lookup_camera_error_prefix")}{" "}
                          {cameraError}
                        </Text>
                      )}
                    </Stack>
                  </Stack>
                </div>

                <Group justify="center" gap="md" wrap="wrap">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <Button
                    variant="outline"
                    color="indigo"
                    leftSection={<FiUploadCloud className="h-4 w-4" />}
                    onClick={handleTriggerUpload}
                  >
                    {t("certificate_lookup_cta_upload")}
                  </Button>
                  <Button
                    variant="light"
                    color="indigo"
                    leftSection={<FiSearch className="h-4 w-4" />}
                    onClick={() => setMode("code")}
                  >
                    {t("certificate_lookup_cta_to_code")}
                  </Button>
                </Group>
              </Stack>
            ) : (
              <form onSubmit={handleSubmitCode}>
                <Stack gap="md" align="center">
                  <Stack gap={4} align="center">
                    <Text
                      fw={600}
                      className="text-slate-900 dark:text-slate-100"
                    >
                      {t("certificate_lookup_code_label")}
                    </Text>
                    <Text size="xs" c="dimmed">
                      {t("certificate_lookup_code_hint")}
                    </Text>
                  </Stack>
                  <TextInput
                    value={codeValue}
                    onChange={(event) => setCodeValue(event.target.value)}
                    placeholder={t("certificate_lookup_code_placeholder")}
                    required
                    className="w-full max-w-[320px]"
                    size="md"
                    radius="xl"
                    classNames={{
                      input:
                        "bg-white border border-slate-200 text-slate-900 placeholder:text-slate-500 dark:border-indigo-500/30 dark:bg-slate-950/80 dark:text-slate-100",
                    }}
                    rightSection={
                      <ActionIcon
                        type="submit"
                        variant="filled"
                        color="indigo"
                        radius="lg"
                        aria-label={t("certificate_lookup_cta_search")}
                      >
                        <FiSearch className="h-4 w-4" />
                      </ActionIcon>
                    }
                  />

                  <Group justify="center" gap="sm">
                    <Button
                      type="button"
                      variant="light"
                      color="indigo"
                      leftSection={<FiCornerUpLeft className="h-4 w-4" />}
                      onClick={() => setMode("qr")}
                    >
                      {t("certificate_lookup_cta_back_qr")}
                    </Button>
                  </Group>
                </Stack>
              </form>
            )}
          </Stack>
        </Paper>
      </Box>
    </div>
  );
};
