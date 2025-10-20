import { useTranslations } from "next-intl";
import { TbChevronLeft } from "react-icons/tb";

type PasswordSettingTab = {
  onBack: () => void;
};

export const PasswordSettingTab = ({ onBack }: PasswordSettingTab) => {
  const t = useTranslations();
  return (
    <div>
      <div className="flex items-center h-12 rounded-lg px-2 gap-2 bg-gray-800">
        <span
          onClick={onBack}
          className="w-8 h-8 select-none bg-gray-700 cursor-pointer shadow-sm shadow-gray-500 hover:bg-gray-600 active:bg-gray-700 flex items-center justify-center rounded-md transition-all"
        >
          <TbChevronLeft className="w-5 h-5" />
        </span>
        <p className="flex-1 text-center font-semibold">
          {t("password_setting")}
        </p>
      </div>
    </div>
  );
};
