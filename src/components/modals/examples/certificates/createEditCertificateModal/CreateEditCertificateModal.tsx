"use client";

import {
  FormDatePicker,
  FormInput,
  FormSelect,
  FormTextArea,
  Image,
  Modal,
  type BaseModalProps,
} from "@/components";
import { COUNTRY_OPTIONS, GENDER_OPTIONS, LANGUAGES } from "@/constants";
import {
  CERTIFICATE_ADDITIONAL_FIELD,
  CERTIFICATE_TEMPLATES,
  COUNTRIES,
  FORM_MODES,
} from "@/enums";
import { useUploadAuthorImage } from "@/mutations";
import { CertificateItemFormType, PreviewImageType } from "@/types";
import { Box, Grid, Loader, Stack, Text } from "@mantine/core";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import { notifications } from "@mantine/notifications";
import { BiX } from "react-icons/bi";

type CreateEditCertificateModalProps = {
  certificateItem: CertificateItemFormType | null;
  onSaveCertificateItem: (
    certificate: CertificateItemFormType,
    action: FORM_MODES
  ) => void;
  onCheckExistedAuthorId: (authorId: string, action: FORM_MODES) => boolean;
  certificateCategory: CERTIFICATE_TEMPLATES | null;
} & Omit<BaseModalProps, "children">;

const CERTIFICATE_ITEM_DEFAULT: CertificateItemFormType = {
  authorName: "",
  authorIdCard: "",
  authorDob: null,
  authorEmail: "",
  authorCountryCode: COUNTRIES.VIETNAM,
  grantLevel: 0,
  domain: "",
};

export const CreateEditCertificateModal = ({
  opened,
  onClose,
  certificateItem,
  onCheckExistedAuthorId,
  onSaveCertificateItem,
  certificateCategory,
  ...props
}: CreateEditCertificateModalProps) => {
  const t = useTranslations();
  const formRef = useRef<HTMLFormElement | null>(null);

  const [authorImage, setAuthorImage] = useState<PreviewImageType | null>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    clearErrors,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CertificateItemFormType>({
    defaultValues: CERTIFICATE_ITEM_DEFAULT,
  });

  const { mutateAsync: uploadAuthorImage, isPending: isUploadingAuthorImage } =
    useUploadAuthorImage();

  const isUploadingAvatar = isUploadingAuthorImage || authorImage?.isUploading;

  const onDropAvatar = async (acceptedFiles: Array<File>) => {
    if (!acceptedFiles.length || isUploadingAvatar || authorImage) return;

    const file = acceptedFiles[0];
    const newImage = {
      name: file.name,
      preview: URL.createObjectURL(file),
      isUploading: true,
    };
    setAuthorImage(newImage);

    try {
      const uploadResult = await uploadAuthorImage({ file });

      setAuthorImage({
        name: file.name,
        preview: uploadResult.accessUrl,
        isUploading: false,
      });
    } catch (error) {
      setAuthorImage(null);
      notifications.show({
        title: "Upload avatar failed",
        message: "There was an error uploading the image. Please try again.",
        color: "red",
      });
    } finally {
      if (newImage.preview.startsWith("blob:")) {
        URL.revokeObjectURL(newImage.preview);
      }
    }
  };

  const handleRemoveAvatar = () => {
    if (authorImage?.preview?.startsWith("blob:")) {
      URL.revokeObjectURL(authorImage.preview);
    }
    setAuthorImage(null);
  };

  const {
    getInputProps: getInputAvatarProps,
    getRootProps,
    open: onOpenDialogAvatar,
    isDragActive,
  } = useDropzone({
    onDrop: onDropAvatar,
    onDropRejected: () => {
      notifications.show({
        title: "Upload avatar failed",
        message: "File is not supported. Please choose a PNG or JPEG image.",
        color: "red",
      });
    },
    multiple: false,
    noClick: true,
    noKeyboard: true,
    disabled: Boolean(authorImage),
    accept: {
      "image/jpeg": [],
      "image/png": [],
    },
  });

  const onSubmit: SubmitHandler<CertificateItemFormType> = (values) => {
    const actionMode = certificateItem ? FORM_MODES.UPDATE : FORM_MODES.CREATE;

    const trimmedAuthorIdCard = values.authorIdCard.trim();
    if (onCheckExistedAuthorId(trimmedAuthorIdCard, actionMode)) {
      setError("authorIdCard", {
        type: "manual",
        message: "certificate_author_id_exists",
      });
      return;
    }
    onSaveCertificateItem(
      {
        ...values,
        authorIdCard: trimmedAuthorIdCard,
        authorImage: authorImage?.preview,
      },
      actionMode
    );
    handleClose();
  };

  const handleConfirmSubmit = () => {
    if (isSubmitting) return;
    formRef.current?.requestSubmit();
  };

  const handleClose = () => {
    clearErrors();
    onClose();
    reset();
    if (authorImage?.preview?.startsWith("blob:")) {
      URL.revokeObjectURL(authorImage.preview);
    }
    setAuthorImage(null);
  };

  useEffect(() => {
    if (certificateItem) {
      reset(certificateItem);
      if (certificateItem.authorImage) {
        setAuthorImage({
          name: certificateItem.authorName || "author-image",
          preview: certificateItem.authorImage,
          isUploading: false,
        });
      } else {
        setAuthorImage(null);
      }
      return;
    }

    reset(CERTIFICATE_ITEM_DEFAULT);
    clearErrors();
    setAuthorImage(null);
  }, [certificateItem, clearErrors, reset]);

  useEffect(() => {
    return () => {
      if (authorImage?.preview?.startsWith("blob:")) {
        URL.revokeObjectURL(authorImage.preview);
      }
    };
  }, [authorImage?.preview]);

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      header={t("certificate_detail")}
      size="lg"
      contentClassNames={{
        headerBox:
          "px-4 py-2 bg-gradient-to-r from-indigo-500/20 via-indigo-500/10 to-transparent dark:from-indigo-500/25 dark:via-indigo-500/15 dark:to-slate-900/80",
        closeButton: "top-3 right-3",
      }}
      footerProps={{
        showFooter: true,
      }}
      onConfirm={handleConfirmSubmit}
      {...props}
    >
      <form
        ref={formRef}
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <Stack gap="md">
          <Grid gutter="md">
            <Grid.Col span={{ base: 12, sm: 5 }}>
              <Box className="w-full h-full rounded-md flex gap-2 justify-center flex-col items-center p-2 transition border border-dashed border-slate-200 bg-slate-100">
                <Box
                  {...getRootProps()}
                  className={`w-[120px] h-[160px] flex items-center justify-center border-blue-80 border-[1px] rounded-sm relative overflow-hidden bg-white ${
                    isDragActive ? "ring-2 ring-blue-80" : ""
                  } ${
                    isUploadingAvatar
                      ? "cursor-not-allowed opacity-80"
                      : "cursor-pointer"
                  }`}
                  onClick={() => {
                    if (!isUploadingAvatar && !authorImage) {
                      onOpenDialogAvatar();
                    }
                  }}
                >
                  <input {...getInputAvatarProps()} />
                  {authorImage ? (
                    <>
                      <Image
                        src={authorImage.preview}
                        alt="Author avatar"
                        className="w-full h-full object-contain rounded-sm"
                      />
                      {isUploadingAvatar && (
                        <Box className="absolute inset-0 bg-white/70 flex items-center justify-center">
                          <Loader size="sm" color="blue" />
                        </Box>
                      )}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveAvatar();
                        }}
                        className="absolute top-1 right-1 z-10 w-6 h-6 flex items-center justify-center bg-white/60 border border-slate-200 rounded-full shadow-sm hover:bg-white"
                      >
                        <BiX className="text-gray-600" />
                      </button>
                    </>
                  ) : (
                    <Stack gap={4} align="center">
                      <Text className="text-center text-blue-80 text-xs whitespace-pre-wrap">
                        {"Avatar photo\n(3x4)"}
                      </Text>
                      <Text className="text-[11px] text-slate-500 text-center px-2">
                        Click hoặc kéo thả ảnh để tải lên
                      </Text>
                    </Stack>
                  )}
                </Box>
              </Box>
            </Grid.Col>

            <Grid.Col span={{ base: 12, sm: 7 }}>
              <Stack gap="md">
                <FormInput
                  name="authorName"
                  name_label="certificate_author_name_label"
                  name_placeholder="certificate_author_name_placeholder"
                  register={register as any}
                  errors={errors}
                  isTranslate
                  rules={{
                    required: "required_field",
                    validate: (value: string) =>
                      value.trim().length > 0 || "required_field",
                  }}
                />
                <FormInput
                  name="authorIdCard"
                  name_label="certificate_author_id_label"
                  name_placeholder="certificate_author_id_placeholder"
                  register={register as any}
                  errors={errors}
                  isTranslate
                  rules={{
                    required: "required_field",
                    validate: (value: string) =>
                      value.trim().length > 0 || "required_field",
                  }}
                />

                <FormInput
                  name="authorEmail"
                  name_label="certificate_author_email_label"
                  name_placeholder="certificate_author_email_placeholder"
                  register={register as any}
                  errors={errors}
                  isTranslate
                  rules={{
                    required: "required_field",
                    pattern: {
                      value:
                        /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/i,
                      message: "certificate_author_email_invalid",
                    },
                  }}
                />
              </Stack>
            </Grid.Col>
          </Grid>
          {certificateCategory ===
            CERTIFICATE_TEMPLATES.GRADUATION_CERTIFICATE && (
            <FormInput
              name="domain"
              name_label="domain_label"
              name_placeholder="domain_description"
              register={register as any}
              errors={errors}
              isTranslate
              rules={{
                required: "required_field",
                validate: (value: string) =>
                  value.trim().length > 0 || "required_field",
              }}
            />
          )}
          <Grid gutter="md">
            <Grid.Col span={{ base: 12, sm: 4 }}>
              <FormDatePicker
                name="authorDob"
                name_label="certificate_author_dob_label"
                name_placeholder="certificate_author_dob_placeholder"
                errors={errors}
                control={control as any}
                isTranslate
                maxDate={new Date()}
                rules={{
                  required: "required_field",
                }}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 4 }}>
              <FormSelect
                name="authorCountryCode"
                name_label="certificate_author_country_label"
                name_placeholder="certificate_author_country_placeholder"
                control={control as any}
                errors={errors}
                data={COUNTRY_OPTIONS}
                isTranslate
                allowDeselect={false}
                defaultValue={CERTIFICATE_ITEM_DEFAULT.authorCountryCode}
                rules={{
                  required: "required_field",
                }}
              />
            </Grid.Col>
            {certificateCategory ===
              CERTIFICATE_TEMPLATES.GRADUATION_CERTIFICATE && (
              <Grid.Col span={{ base: 12, sm: 4 }}>
                <FormInput
                  name="grantLevel"
                  name_label="certificate_grant_level"
                  name_placeholder="certificate_grant_level_placeholder"
                  type="number"
                  register={register as any}
                  errors={errors}
                  isTranslate
                  rules={{
                    required: "required_field",
                    valueAsNumber: true,
                    min: {
                      value: 0,
                      message: "certificate_grant_level_min",
                    },
                  }}
                />
              </Grid.Col>
            )}

            {certificateCategory === CERTIFICATE_TEMPLATES.IELTS && (
              <Grid.Col span={{ base: 12, sm: 4 }}>
                <FormSelect
                  name={CERTIFICATE_ADDITIONAL_FIELD.CANDIDATE_SEX}
                  name_label="candidate_sex"
                  name_placeholder="candidate_sex_placeholder"
                  control={control as any}
                  errors={errors}
                  data={GENDER_OPTIONS}
                  isTranslate
                  allowDeselect={false}
                  defaultValue={CERTIFICATE_ITEM_DEFAULT.candidate_sex}
                  rules={{
                    required: "required_field",
                  }}
                />
              </Grid.Col>
            )}
          </Grid>

          {certificateCategory ===
            CERTIFICATE_TEMPLATES.GRADUATION_CERTIFICATE && (
            <Grid gutter="md">
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <FormInput
                  name={CERTIFICATE_ADDITIONAL_FIELD.SERIAL_NUMBER}
                  name_label="certificate_serial_number_label"
                  name_placeholder="certificate_serial_number_placeholder"
                  register={register as any}
                  errors={errors}
                  isTranslate
                  rules={{
                    required: "required_field",
                  }}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <FormInput
                  name={CERTIFICATE_ADDITIONAL_FIELD.REG_NO}
                  name_label="certificate_reg_no_label"
                  name_placeholder="certificate_reg_no_placeholder"
                  register={register as any}
                  errors={errors}
                  isTranslate
                  rules={{
                    required: "required_field",
                  }}
                />
              </Grid.Col>
            </Grid>
          )}

          {certificateCategory === CERTIFICATE_TEMPLATES.IELTS && (
            <Grid gutter="md">
              <Grid.Col span={{ base: 12, sm: 4 }}>
                <FormInput
                  name={CERTIFICATE_ADDITIONAL_FIELD.CANDIDATE_NUMBER}
                  name_label="candidate_number"
                  name_placeholder="candidate_number_placeholder"
                  register={register as any}
                  errors={errors}
                  isTranslate
                  rules={{
                    required: "required_field",
                  }}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 4 }}>
                <FormSelect
                  name={CERTIFICATE_ADDITIONAL_FIELD.FIRST_LANGUAGE}
                  name_label="first_language"
                  name_placeholder="first_language_placeholder"
                  control={control as any}
                  errors={errors}
                  data={LANGUAGES}
                  isTranslate
                  allowDeselect={false}
                  defaultValue={CERTIFICATE_ITEM_DEFAULT.first_language}
                  rules={{
                    required: "required_field",
                  }}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 4 }}>
                <FormInput
                  name={CERTIFICATE_ADDITIONAL_FIELD.TEST_REPORT}
                  name_label="test_report"
                  name_placeholder="test_report_placeholder"
                  register={register as any}
                  errors={errors}
                  isTranslate
                  rules={{
                    required: "required_field",
                  }}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 6, sm: 3 }}>
                <FormInput
                  name={CERTIFICATE_ADDITIONAL_FIELD.LISTENING_RESULT}
                  name_label="listening"
                  name_placeholder="listening_placeholder"
                  type="number"
                  register={register as any}
                  errors={errors}
                  isTranslate
                  rules={{
                    required: "required_field",
                    validate: (value: string | number) =>
                      Number(value) > 0 || "certificate_skill_score_min",
                  }}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 6, sm: 3 }}>
                <FormInput
                  name={CERTIFICATE_ADDITIONAL_FIELD.READING_RESULT}
                  name_label="reading"
                  name_placeholder="reading_placeholder"
                  type="number"
                  register={register as any}
                  errors={errors}
                  isTranslate
                  rules={{
                    required: "required_field",
                    validate: (value: string | number) =>
                      Number(value) > 0 || "certificate_skill_score_min",
                  }}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 6, sm: 3 }}>
                <FormInput
                  name={CERTIFICATE_ADDITIONAL_FIELD.WRITING_RESULT}
                  name_label="writing"
                  name_placeholder="writing_placeholder"
                  type="number"
                  register={register as any}
                  errors={errors}
                  isTranslate
                  rules={{
                    required: "required_field",
                    validate: (value: string | number) =>
                      Number(value) > 0 || "certificate_skill_score_min",
                  }}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 6, sm: 3 }}>
                <FormInput
                  name={CERTIFICATE_ADDITIONAL_FIELD.SPEAKING_RESULT}
                  name_label="speaking"
                  name_placeholder="speaking_placeholder"
                  type="number"
                  register={register as any}
                  errors={errors}
                  isTranslate
                  rules={{
                    required: "required_field",
                    validate: (value: string | number) =>
                      Number(value) > 0 || "certificate_skill_score_min",
                  }}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12 }}>
                <FormTextArea
                  name={CERTIFICATE_ADDITIONAL_FIELD.ADMINISTRATOR_COMMENTS}
                  name_label="administrator_comments"
                  name_placeholder="administrator_comments_placeholder"
                  register={register as any}
                  errors={errors}
                  isTranslate
                  rows={5}
                  maxRows={10}
                />
              </Grid.Col>
            </Grid>
          )}
        </Stack>
      </form>
    </Modal>
  );
};
