"use client";

import { ButtonIcon, Modal, type BaseModalProps } from "@/components";
import {
  Badge,
  Box,
  Button,
  Flex,
  List,
  Paper,
  Text,
  ThemeIcon,
} from "@mantine/core";
import { useTranslations } from "next-intl";
import { type ChangeEvent, type DragEvent, useRef, useState } from "react";
import { FiFileText, FiTrash2, FiUploadCloud } from "react-icons/fi";

type ImportCertificateModalProps = {} & Omit<BaseModalProps, "children">;

export const ImportCertificateModal = ({
  opened,
  onClose,
  ...props
}: ImportCertificateModalProps) => {
  const t = useTranslations();
  const formRef = useRef<HTMLFormElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const hasFile = Boolean(selectedFile);

  const handleConfirm = () => {
    // confirm import
  };

  const formatFileSize = (file?: File | null) => {
    if (!file) return "";
    const size = file.size;
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(2)} MB`;
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (selectedFile) {
      event.target.value = "";
      return;
    }
    const file = event.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    event.target.value = "";
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (selectedFile) return;
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (!file) return;
    setSelectedFile(file);
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (selectedFile) return;
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleBrowseClick = () => {
    if (selectedFile) return;
    fileInputRef.current?.click();
  };

  const handleClearFile = () => setSelectedFile(null);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      header={t("import_certificate")}
      size="lg"
      contentClassNames={{
        headerBox:
          "px-4 py-2 bg-gradient-to-r from-indigo-500/20 via-indigo-500/10 to-transparent dark:from-indigo-500/25 dark:via-indigo-500/15 dark:to-slate-900/80",
        closeButton: "top-3 right-3",
      }}
      footerProps={{
        showFooter: true,
      }}
      onConfirm={handleConfirm}
      {...props}
    >
      <form ref={formRef} className="space-y-5">
        <Paper
          shadow="xs"
          className="space-y-3 overflow-hidden rounded-sm border border-indigo-100 bg-gradient-to-r from-indigo-50 via-white to-indigo-50 p-4 dark:border-indigo-500/20 dark:from-slate-900/60 dark:via-slate-900/40 dark:to-slate-900/60"
        >
          <Flex align="center" gap={10}>
            <Text className="text-sm font-semibold text-slate-800 dark:text-slate-100">
              {t("import_certificate_from_excel_title")}
            </Text>
          </Flex>
          <Text className="text-sm text-slate-600 dark:text-slate-300">
            {t("import_certificate_from_excel_desc")}
          </Text>
          <List
            className="text-xs text-slate-500 dark:text-slate-400"
            spacing={4}
            icon={<FiFileText />}
          >
            <List.Item>{t("import_certificate_formats_hint")}</List.Item>
            <List.Item>{t("import_certificate_template_hint")}</List.Item>
            <List.Item>{t("import_certificate_password_hint")}</List.Item>
          </List>
        </Paper>

        <Box className="relative overflow-hidden rounded-sm border border-indigo-100 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.12),transparent_35%),radial-gradient(circle_at_80%_50%,rgba(34,211,238,0.12),transparent_32%)]" />
          <Flex
            direction="column"
            align="center"
            gap={12}
            className={`relative p-6 text-center ${
              hasFile ? "cursor-not-allowed" : "cursor-pointer"
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={handleBrowseClick}
          >
            <Flex
              direction="column"
              align="center"
              gap={8}
              className={`w-full max-w-xl rounded-sm border-2 border-dashed p-6 transition-all ${
                isDragging
                  ? "border-indigo-500 bg-indigo-50/80 shadow-md dark:border-indigo-400 dark:bg-slate-800/40"
                  : "border-slate-300 hover:border-indigo-400 hover:bg-indigo-50/40 dark:border-slate-700 dark:hover:border-indigo-400/60 dark:hover:bg-slate-800/30"
              } ${hasFile ? "opacity-90" : ""}`}
            >
              <ThemeIcon
                radius="xl"
                size={52}
                variant="light"
                color="indigo"
                className="shadow-sm"
              >
                <FiUploadCloud className="h-6 w-6" />
              </ThemeIcon>
              <Flex direction="column" gap={4} align="center">
                <Text fw={700} className="text-slate-800 dark:text-slate-100">
                  {t("import_certificate_drop_title")}
                </Text>
                <Text size="sm" c="dimmed" className="max-w-md">
                  {t("import_certificate_drop_desc")}
                </Text>
              </Flex>

              {selectedFile ? (
                <Flex
                  align="center"
                  justify="space-between"
                  gap={10}
                  className="w-full max-w-md rounded-lg bg-indigo-50 px-3 py-2 text-indigo-900 dark:bg-indigo-500/10 dark:text-indigo-100"
                >
                  <div className="flex min-w-0 flex-col">
                    <Text className="truncate text-sm font-semibold">
                      {selectedFile.name}
                    </Text>
                    <Text size="xs" c="dimmed" className="text-start">
                      {t("import_certificate_selected_size", {
                        size: formatFileSize(selectedFile),
                      })}
                    </Text>
                  </div>
                  <ButtonIcon
                    onClick={handleClearFile}
                    icon={<FiTrash2 className="h-3.5 w-3.5" />}
                  />
                </Flex>
              ) : (
                <Text size="xs" c="dimmed">
                  {t("import_certificate_no_file")}
                </Text>
              )}
            </Flex>
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              className="hidden"
              onChange={handleFileChange}
            />
          </Flex>
        </Box>
      </form>
    </Modal>
  );
};
