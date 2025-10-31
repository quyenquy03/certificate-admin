import { useTranslations } from "next-intl";
import { ButtonIcon, ButtonIconType } from "../buttonIcon";
import { BiDotsHorizontalRounded } from "react-icons/bi";

export const ButtonMore = ({
  tooltipLabel = "more",
  showTooltip = false,
  buttonProps,
  ...args
}: ButtonIconType) => {
  const t = useTranslations();
  return (
    <ButtonIcon
      icon={<BiDotsHorizontalRounded size={20} />}
      showTooltip={showTooltip}
      tooltipLabel={t(tooltipLabel)}
      buttonProps={{
        size: "md",
        gradient: { from: "green", to: "purple", deg: 120 },
        ...buttonProps,
      }}
      {...args}
    />
  );
};
