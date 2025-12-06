"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { FiMenu, FiMoon, FiSun, FiX } from "react-icons/fi";
import { cn } from "@/helpers";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "@/providers/ThemeProvider/ThemeProvider";
import { THEMES } from "@/enums";
import { useTranslations } from "next-intl";

const navIds = ["gioi-thieu", "cach-hoat-dong-loi-ich", "doi-tac", "lien-he"] as const;

export const Header = () => {
  const t = useTranslations("client_header");
  const pathname = usePathname();
  const router = useRouter();
  const isLandingPage = pathname === "/" || pathname === "";
  const [activeSection, setActiveSection] = useState<string | undefined>(navIds[0]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, setTheme } = useTheme();
  const isDark = theme === THEMES.DARK;

  const navItems = useMemo(
    () =>
      navIds.map((id) => ({
        id,
        label: t(`nav.${id}`),
      })),
    [t]
  );

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isLandingPage) {
      setActiveSection(undefined);
      return;
    }

    const hash =
      typeof window !== "undefined"
        ? window.location.hash.replace("#", "")
        : "";

    if (hash) {
      const el = document.getElementById(hash);
      if (el) {
        setActiveSection(hash);
        requestAnimationFrame(() => {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      }
    } else {
      setActiveSection(navIds[0]);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: 0.2 }
    );

    navIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [isLandingPage, pathname]);

  const handleNavigate = (id?: string) => {
    if (!id) return;
    if (!isLandingPage) {
      router.push(`/#${id}`);
      setMobileOpen(false);
      return;
    }
    const element = document.getElementById(id);
    setActiveSection(id);
    if (typeof window !== "undefined") {
      const href = `${pathname ?? ""}#${id}`;
      window.history.replaceState(null, "", href);
    }
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setMobileOpen(false);
  };

  const handleToggleTheme = () => {
    setTheme(isDark ? THEMES.LIGHT : THEMES.DARK);
  };

  return (
    <header
      className={cn(
        "sticky inset-x-0 top-0 z-50 border-b border-slate-200/80 backdrop-blur dark:border-indigo-500/10",
        scrolled
          ? "bg-white/90 shadow-lg shadow-indigo-500/5 dark:bg-slate-950/85"
          : "bg-white/80 dark:bg-slate-950/75"
      )}
    >
      <div className="mx-auto flex h-[60px] max-w-6xl items-center justify-between gap-6 px-6 sm:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100"
          onClick={(event) => {
            event.preventDefault();
            handleNavigate(navItems[0]?.id);
          }}
        >
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300">
            BC
          </span>
          CertifyChain
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNavigate(item.id)}
              className={cn(
                "relative whitespace-nowrap text-sm font-medium transition-colors",
                "after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:bg-indigo-500 after:transition-transform after:duration-300 after:content-['']",
                activeSection === item.id
                  ? "text-indigo-600 after:scale-x-100 dark:text-indigo-300"
                  : "text-slate-700 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-200"
              )}
            >
              {item.label}
            </button>
          ))}
          <button
            type="button"
            onClick={handleToggleTheme}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-indigo-700 transition hover:bg-indigo-50 dark:border-slate-700 dark:bg-slate-900 dark:text-indigo-200 dark:hover:bg-slate-800"
            aria-label={t("toggle_label")}
          >
            {isDark ? <FiSun className="h-5 w-5" /> : <FiMoon className="h-5 w-5" />}
          </button>
        </nav>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full text-indigo-700 transition hover:text-indigo-600 dark:text-indigo-200 dark:hover:text-indigo-100 lg:hidden"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-expanded={mobileOpen}
          aria-controls="mobile-navigation"
          aria-label={t("mobile_toggle_label")}
        >
          {mobileOpen ? (
            <FiX className="h-5 w-5" />
          ) : (
            <FiMenu className="h-5 w-5" />
          )}
        </button>
      </div>

      {mobileOpen && (
        <div
          id="mobile-navigation"
          className="border-t border-slate-200/80 bg-white/95 dark:border-indigo-500/10 dark:bg-slate-950/95 lg:hidden"
        >
          <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-4 sm:px-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavigate(item.id)}
                className={cn(
                  "w-full rounded-lg px-4 py-2 text-left text-sm font-medium text-slate-800 transition-colors dark:text-slate-200",
                  activeSection === item.id
                    ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-200"
                    : "hover:bg-slate-100 dark:hover:bg-slate-900"
                )}
              >
                {item.label}
              </button>
            ))}
            <div className="flex items-center justify-between rounded-lg bg-slate-100 px-4 py-3 text-sm font-medium text-slate-800 dark:bg-slate-900 dark:text-slate-200">
              <span>{t("theme_label")}</span>
              <button
                type="button"
                onClick={handleToggleTheme}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-indigo-700 transition hover:bg-indigo-50 dark:border-slate-700 dark:bg-slate-900 dark:text-indigo-200 dark:hover:bg-slate-800"
                aria-label={t("toggle_label")}
              >
                {isDark ? <FiSun className="h-5 w-5" /> : <FiMoon className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
