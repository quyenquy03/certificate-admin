import {
  ActionIcon,
  ActionIconProps,
  Tooltip,
  TooltipProps,
} from "@mantine/core";
import { ReactNode } from "react";

export type ButtonIconType = {
  showTooltip?: boolean;
  onClick?: () => void;
  icon?: ReactNode;
  tooltipLabel?: string;
  tooltipProps?: TooltipProps;
  buttonProps?: ActionIconProps;
  disabled?: boolean;
};

export const ButtonIcon = ({
  showTooltip = false,
  onClick,
  icon,
  tooltipLabel = "",
  tooltipProps,
  buttonProps,
  disabled = false,
}: ButtonIconType) => {
  return (
    <Tooltip
      arrowPosition="side"
      arrowOffset={27}
      arrowSize={7}
      arrowRadius={2}
      label={tooltipLabel}
      withArrow
      position="bottom"
      disabled={!showTooltip || disabled}
      transitionProps={{
        duration: 500,
      }}
      {...tooltipProps}
    >
      <ActionIcon
        disabled={disabled}
        variant="gradient"
        onClick={onClick}
        className="hover:brightness-105 active:brightness-95 transition-all"
        {...buttonProps}
      >
        {icon}
      </ActionIcon>
    </Tooltip>
  );
};
