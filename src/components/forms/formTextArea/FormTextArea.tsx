"use client";

import { cn } from "@/helpers";
import { Textarea, TextareaProps, TextInputProps } from "@mantine/core";
import { useTranslations } from "next-intl";
import React from "react";
import {
  FieldErrors,
  FieldValues,
  RegisterOptions,
  UseFormRegister,
} from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";

type FormTextAreaProps = {
  name: string;
  name_label: string;
  name_placeholder?: string;
  hasError?: boolean;
  isTranslate?: boolean;
  errors: FieldErrors<FieldValues>;
  register: UseFormRegister<FieldValues>;
  rules?: RegisterOptions;
  classNames?: {
    label?: string;
    description?: string;
    error?: string;
    input?: string;
    required?: string;
    root?: string;
    section?: string;
    wrapper?: string;
  };
} & TextareaProps;

export const FormTextArea = ({
  name,
  name_label,
  name_placeholder,
  hasError,
  isTranslate,
  rules,
  register,
  errors,
  classNames,
  ...rest
}: FormTextAreaProps) => {
  const t = useTranslations();

  const isError = hasError || !!errors?.[name];

  return (
    <div>
      <Textarea
        {...register(name, {
          ...rules,
        })}
        name={name}
        label={isTranslate ? t(name_label) : name_label}
        classNames={{
          label: cn("text-gray-700 dark:text-gray-200", classNames?.label),
          input: cn("rounded-sm", classNames?.input),
          error: "hidden",
          ...classNames,
        }}
        error={isError}
        placeholder={
          isTranslate && name_placeholder
            ? t(name_placeholder)
            : name_placeholder
        }
        autoComplete="off"
        {...rest}
      />
      {errors && (
        <ErrorMessage
          errors={errors}
          name={name}
          render={({ message }) =>
            message && message.trim() !== "" ? (
              <p className="mt-1 text-element-alert text-xs font-normal leading-normal">
                {isTranslate ? t(message) : message}
              </p>
            ) : null
          }
        />
      )}
    </div>
  );
};
