import { Badge } from "@/components/badges";
import { Separator } from "@/components/separators";
import { useTranslations } from "next-intl";

export const landingPartners = [
  "EduChain Labs",
  "VeriTrust AI",
  "Global Accreditor",
  "SecureHire",
  "ChainProof Alliance",
];

export const LandingFooter = () => {
  const t = useTranslations("client_footer");

  return (
    <footer className="border-t border-slate-200 bg-white text-slate-700 dark:border-indigo-500/10 dark:bg-slate-950 dark:text-slate-400">
      <div className="mx-auto max-w-6xl px-6 py-12 sm:px-8">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
              CertifyChain
            </h3>
            <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
              {t("description")}
            </p>
          </div>
          <div>
            <h4 className="font-medium text-slate-800 dark:text-slate-200">
              {t("contact_title")}
            </h4>
            <ul className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>{t("contact_email")}: support@certifychain.io</li>
              <li>{t("contact_phone")}: +84 24 7300 1234</li>
              <li>{t("contact_office")}: 845 Innovation Drive, Tầng 3</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-slate-800 dark:text-slate-200">
              {t("partners_title")}
            </h4>
            <div className="mt-4 flex flex-wrap gap-2">
              {landingPartners.map((partner) => (
                <Badge
                  key={partner}
                  variant="outline"
                  className="border-indigo-500/30 bg-indigo-50 text-indigo-700 dark:bg-transparent dark:text-slate-300"
                >
                  {partner}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        <Separator className="my-8 border-slate-200 dark:border-indigo-500/10" />
        <div className="flex flex-col gap-4 text-sm text-slate-600 dark:text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} CertifyChain. {t("rights_reserved")}
          </p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-slate-800 dark:hover:text-slate-300">
              {t("policy_privacy")}
            </a>
            <a href="#" className="hover:text-slate-800 dark:hover:text-slate-300">
              {t("policy_terms")}
            </a>
            <a href="#" className="hover:text-slate-800 dark:hover:text-slate-300">
              {t("policy_support")}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;

