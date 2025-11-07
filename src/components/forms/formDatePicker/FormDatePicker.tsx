"use client";

import { ErrorMessage } from "@hookform/error-message";
import {
  type DatePickerInputProps,
  DatePickerInput,
  DatesProvider,
} from "@mantine/dates";
import { useTranslations } from "next-intl";
import {
  Controller,
  FieldErrors,
  FieldValues,
  RegisterOptions,
  UseFormReturn,
} from "react-hook-form";
import "dayjs/locale/ja";

import "../style.css";
import { cn } from "@/helpers";

type FormDatePickerProps = {
  name: string;
  name_label?: string;
  name_placeholder: string;
  errors: FieldErrors<FieldValues>;
  control: UseFormReturn<FieldValues>["control"];
  isRequired?: boolean;
  classNames?: {
    wrapper?: string;
    label?: string;
    input?: string;
  };
  rules?: RegisterOptions;
  disabled?: boolean;
  isTranslate?: boolean;
} & DatePickerInputProps<"default">;

export function FormDatePicker({
  name,
  name_label,
  name_placeholder,
  errors,
  control,
  isRequired = true,
  classNames,
  rules = {},
  disabled = false,
  isTranslate = true,
  ...args
}: FormDatePickerProps) {
  const t = useTranslations();
  const placeholderLabel = isTranslate
    ? t(name_placeholder)
    : name_placeholder;

  return (
    <div className={cn("relative flex flex-col", classNames?.wrapper)}>
      <Controller
        name={name}
        control={control}
        rules={{
          required: isRequired ? t("required_field") : false,
          ...rules,
        }}
        render={({ field }) => (
          <DatesProvider settings={{ locale: "jaen" }}>
            <DatePickerInput
              {...args}
              {...field}
              placeholder={placeholderLabel}
              value={field.value}
              onChange={field.onChange}
              size="sm"
              disabled={disabled}
              label={isTranslate && name_label ? t(name_label) : name_label}
              valueFormat="DD/MM/YYYY"
              classNames={{
                label: cn(
                  "text-gray-700 dark:text-gray-200",
                  classNames?.label
                ),
                input: cn("rounded-sm", classNames?.input),
                error: "hidden",
                calendarHeaderLevel: "text-color-light",
                calendarHeaderControl: "text-color-light",
              }}
            />
          </DatesProvider>
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
