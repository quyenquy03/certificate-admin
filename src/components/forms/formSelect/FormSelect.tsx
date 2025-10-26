"use client";

import { ErrorMessage } from "@hookform/error-message";
import { Select, SelectProps } from "@mantine/core";
import { useTranslations } from "next-intl";
import {
  Controller,
  FieldErrors,
  FieldValues,
  RegisterOptions,
  UseFormReturn,
} from "react-hook-form";

import "../style.css";

import { cn } from "@/helpers";

type FormSelectProps = {
  name: string;
  name_label?: string;
  name_placeholder?: string;
  errors: FieldErrors<FieldValues>;
  control?: UseFormReturn<FieldValues>["control"];
  isRequired?: boolean;
  data: { value: string | number; label: string | number }[];
  classNames?: {
    wrapper?: string;
    label?: string;
    input?: string;
  };
  rules?: RegisterOptions;
  disabled?: boolean;
  readonly?: boolean;
  children?: React.ReactNode;
  isTranslate?: boolean;
} & SelectProps;

export function FormSelect({
  name,
  name_label,
  name_placeholder,
  errors,
  control,
  data,
  isRequired = true,
  classNames,
  rules = {},
  disabled = false,
  isTranslate = true,
  readonly = false,
  children,
  ...args
}: FormSelectProps) {
  const t = useTranslations();

  return (
    <div className={cn("relative flex flex-col", classNames?.wrapper)}>
      <Controller
        name={name}
        control={control}
        rules={{
          required: isRequired ? t("required_field") : false,
          ...rules,
        }}
        defaultValue=""
        render={({ field }) => (
          <Select
            {...args}
            {...field}
            data={data}
            disabled={disabled}
            label={isTranslate && name_label ? t(name_label) : name_label}
            placeholder={name_placeholder && t(name_placeholder)}
            checkIconPosition="right"
            classNames={{
              label: cn("text-gray-700 dark:text-gray-200", classNames?.label),
              input: cn("rounded-sm", classNames?.input),
              error: "hidden",
              option: "text-color-light",
            }}
          />
        )}
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
}
