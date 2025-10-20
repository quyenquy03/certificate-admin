import { Button } from "@mantine/core";
import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations();
  return (
    <div>
      <Button>{t("home")}</Button>
    </div>
  );
}
