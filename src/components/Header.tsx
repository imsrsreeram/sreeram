import { navigationLinks } from "../cms/model";
import { usePortfolioData } from "../cms/context";
import React, { useState, useEffect, useRef } from "react";

interface HeaderProps {
  activeSection: string;
  onOpenResumeModal: () => void;
  onOpenContactModal: () => void;
  onDownloadResume: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeSection,
  onOpenResumeModal,
  onOpenContactModal,
  onDownloadResume,
}) => {
  const PORTFOLIO_DATA = usePortfolioData();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = navigationLinks(window.__CMS_CONTENT);

  // Every navigation option is always shown. If there are too many for one
  // line the links wrap onto a second line instead of hiding in a menu.
  const barRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = barRef.current;
    if (!el) return;
    // Page content needs to know how tall the fixed header is.
    const publish = () =>
      document.documentElement.style.setProperty(
        "--header-h",
        el.offsetHeight + "px",
      );
    publish();
    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", publish);
      return () => window.removeEventListener("resize", publish);
    }
    const ro = new ResizeObserver(publish);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 w-full z-40 transition-[background-color,box-shadow,padding] duration-200 ${
        isScrolled
          ? "bg-surface/95 backdrop-blur-sm shadow-[0_2px_12px_rgba(0,0,0,0.06)] py-1"
          : "bg-surface/85 backdrop-blur-sm shadow-[0_1px_8px_rgba(0,0,0,0.04)] py-0"
      }`}
    >
      <div
        ref={barRef}
        className="h-20 xl:h-auto xl:py-2 max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-x-4 gap-y-1 xl:flex-wrap"
      >
        {/* Brand / Logo */}
        <a
          href="#home"
          className="flex items-center gap-2 sm:gap-3 min-w-0 shrink group transition-transform active:scale-95"
        >
          {!imgError && PORTFOLIO_DATA.profile.logo ? (
            <img
              alt="Sreeram S R Monogram Logo"
              className="h-8 w-auto max-w-[96px] shrink-0 object-contain transition-opacity"
              src={PORTFOLIO_DATA.profile.logo || ""}
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-8 h-8 shrink-0 rounded-lg bg-primary-container text-white flex items-center justify-center font-bold text-xs ring-1 ring-secondary shadow-sm">
              <span className="text-white">
                {PORTFOLIO_DATA.copy.Header.text1}
              </span>
              <span className="text-[var(--color-on-tertiary-container)]">
                {PORTFOLIO_DATA.copy.Header.text2}
              </span>
            </div>
          )}
          <div className="flex flex-col min-w-0">
            <span className="font-headline-sm text-headline-sm tracking-tight text-on-surface group-hover:text-secondary transition-colors truncate">
              {PORTFOLIO_DATA.profile.name}
            </span>
            <span className="hidden sm:block truncate font-label-sm text-[11px] text-on-surface-variant uppercase tracking-wider">
              {PORTFOLIO_DATA.profile.title}
            </span>
          </div>
        </a>

        {/* Desktop Navigation: all options, right-aligned beside the brand */}
        <nav
          className="header-nav hidden xl:flex flex-1 min-w-0 flex-wrap items-center justify-end gap-x-0.5 gap-y-0.5 xl:order-2"
          aria-label="Primary"
        >
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.id}
                href={link.href}
                target={link.newTab ? "_blank" : undefined}
                rel="noopener noreferrer"
                className={`whitespace-nowrap px-2.5 py-1.5 rounded-lg text-[13px] font-semibold transition-colors duration-150 ${
                  isActive
                    ? "bg-surface-container-high text-primary font-bold shadow-xs"
                    : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low"
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-1 sm:gap-3 shrink-0 xl:order-3 xl:basis-full xl:justify-end xl:border-t xl:border-surface-container-high xl:pt-2">
          <button
            onClick={onOpenResumeModal}
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 border border-surface-container-highest bg-surface-container-lowest hover:bg-surface-container-high text-on-surface rounded-xl font-label-md text-label-md transition-colors shadow-none text-xs"
            title="View Executive Summary / Profile Brief"
          >
            <span className="material-symbols-outlined text-[16px] text-secondary">
              {PORTFOLIO_DATA.copy.Header.text5}
            </span>
            <span>{PORTFOLIO_DATA.copy.Header.text6}</span>
          </button>

          <button
            onClick={onOpenContactModal}
            aria-label={PORTFOLIO_DATA.copy.Header.text8}
            className="inline-flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2 min-h-10 bg-primary text-on-primary hover:bg-secondary hover:text-on-secondary rounded-xl font-label-md text-label-md transition-all duration-200 shadow-sm text-xs sm:text-sm font-semibold"
          >
            <span className="material-symbols-outlined text-[16px]">
              {PORTFOLIO_DATA.copy.Header.text7}
            </span>
            <span className="hidden min-[400px]:inline">
              {PORTFOLIO_DATA.copy.Header.text8}
            </span>
          </button>

          <button
            type="button"
            onClick={onDownloadResume}
            title="Download resume"
            aria-label="Download resume"
            className="hidden md:inline-flex items-center justify-center gap-1.5 h-8 min-w-8 px-2 xl:px-3 rounded-full bg-primary hover:bg-secondary text-on-primary shrink-0 transition-colors shadow-xs text-xs font-semibold"
          >
            <span className="material-symbols-outlined text-on-primary text-[18px]">
              download
            </span>
            <span className="hidden xl:inline">Download Resume</span>
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden inline-flex h-11 w-11 items-center justify-center rounded-lg text-on-surface hover:bg-surface-container-high transition-colors"
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            <span className="material-symbols-outlined text-[24px]">
              {mobileMenuOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden max-h-[calc(100dvh-5rem)] overflow-y-auto overscroll-contain bg-surface-container-lowest/98 backdrop-blur-2xl border-b border-surface-container-high px-4 sm:px-6 py-4 shadow-xl flex flex-col gap-2 animate-in slide-in-from-top duration-200">
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-surface-container">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                target={link.newTab ? "_blank" : undefined}
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2.5 min-h-11 rounded-lg text-sm font-medium break-words ${
                  activeSection === link.id
                    ? "bg-secondary text-on-secondary font-bold"
                    : "text-on-surface-variant hover:bg-surface-container"
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="flex flex-col gap-2 pt-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenResumeModal();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-surface-container-highest text-sm font-semibold text-primary bg-surface-container-low"
            >
              <span className="material-symbols-outlined text-[18px]">
                {PORTFOLIO_DATA.copy.Header.text10}
              </span>
              <span>{PORTFOLIO_DATA.copy.Header.text11}</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onDownloadResume();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-surface-container-highest text-sm font-semibold text-primary bg-surface-container-low"
            >
              <span className="material-symbols-outlined text-[18px]">
                download
              </span>
              <span>Download Resume</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenContactModal();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-primary text-white text-sm font-semibold shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px]">
                {PORTFOLIO_DATA.copy.Header.text12}
              </span>
              <span>{PORTFOLIO_DATA.copy.Header.text13}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
