import { useTranslations } from "next-intl";
import { ButtonIcon, ButtonIconType } from "../buttonIcon";
import { BiPlus } from "react-icons/bi";

export const ButtonAdd = ({
  tooltipLabel = "add_new",
  showTooltip = true,
  buttonProps,
  ...args
}: ButtonIconType) => {
  const t = useTranslations();
  return (
    <ButtonIcon
      icon={<BiPlus size={25} />}
      showTooltip={showTooltip}
      tooltipLabel={t(tooltipLabel)}
      buttonProps={{
        size: "lg",
        gradient: { from: "blue", to: "cyan", deg: 90 },
        ...buttonProps,
      }}
      {...args}
    />
  );
};
