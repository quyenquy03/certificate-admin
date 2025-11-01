"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FiMenu, FiX } from "react-icons/fi";
import { cn } from "@/helpers";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Giới thiệu", id: "gioi-thieu" },
  { label: "Cách hoạt động & Lợi ích", id: "cach-hoat-dong-loi-ich" },
  { label: "Đối tác", id: "doi-tac" },
  { label: "Liên hệ", id: "lien-he" },
] as const;

export const Header = () => {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState<string | undefined>(
    navItems[0]?.id
  );
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
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

    navItems.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const handleNavigate = (id?: string) => {
    if (!id) return;
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

  return (
    <header
      className={cn(
        "sticky inset-x-0 top-0 z-50 border-b border-indigo-500/10 backdrop-blur",
        scrolled
          ? "bg-slate-950/85 shadow-lg shadow-indigo-500/5"
          : "bg-slate-950/75"
      )}
    >
      <div className="mx-auto flex h-[60px] max-w-6xl items-center justify-between gap-6 px-6 sm:px-8">
        <Link
          href={`#${navItems[0]?.id}`}
          className="flex items-center gap-2 text-lg font-semibold tracking-tight text-slate-100"
          onClick={(event) => {
            event.preventDefault();
            handleNavigate(navItems[0]?.id);
          }}
        >
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-indigo-500/15 text-indigo-300">
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
                "after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:bg-indigo-400 after:transition-transform after:duration-300 after:content-['']",
                activeSection === item.id
                  ? "text-indigo-300 after:scale-x-100"
                  : "text-slate-300 hover:text-indigo-200"
              )}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full text-indigo-200 transition hover:text-indigo-100 lg:hidden"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-expanded={mobileOpen}
          aria-controls="mobile-navigation"
          aria-label="Toggle navigation"
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
          className="border-t border-indigo-500/10 bg-slate-950/95 lg:hidden"
        >
          <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-4 sm:px-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavigate(item.id)}
                className={cn(
                  "w-full rounded-lg px-4 py-2 text-left text-sm font-medium text-slate-200 transition-colors",
                  activeSection === item.id
                    ? "bg-indigo-500/15 text-indigo-200"
                    : "hover:bg-slate-900"
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
