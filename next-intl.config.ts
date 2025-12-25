import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async ({ requestLocale }) => {
  const locales = ["en", "vi"];

  let locale: string = (await requestLocale) ?? "vi";
  if (!locales.includes(locale)) {
    locale = "vi";
  }

  return {
    locale,
    messages: (await import(`./src/messages/${locale}.json`)).default,
  };
});
