import { useTranslations } from "next-intl";
import { ButtonIcon, ButtonIconType } from "../buttonIcon";
import { BiSolidArrowToTop } from "react-icons/bi";

export const ButtonImport = ({
  tooltipLabel = "import",
  showTooltip = true,
  buttonProps,
  ...args
}: ButtonIconType) => {
  const t = useTranslations();
  return (
    <ButtonIcon
      icon={<BiSolidArrowToTop size={25} />}
      showTooltip={showTooltip}
      tooltipLabel={t(tooltipLabel)}
      buttonProps={{
        size: "lg",
        gradient: { from: "yellow", to: "purple", deg: 45 },
        ...buttonProps,
      }}
      {...args}
    />
  );
};
