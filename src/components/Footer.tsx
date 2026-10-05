import { navigationLinks } from "../cms/model";
import { usePortfolioData } from "../cms/context";
import React, { useState } from "react";

interface FooterProps {
  onOpenResumeModal: () => void;
  onOpenContactModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenResumeModal,
  onOpenContactModal,
}) => {
  const PORTFOLIO_DATA = usePortfolioData();

  const [imgError, setImgError] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="w-full bg-surface-container-lowest transition-colors shadow-[0_-1px_8px_rgba(0,0,0,0.03)] border-t border-surface-container">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-space-xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-space-lg mb-space-xl">
          <div className="md:col-span-5 flex flex-col gap-space-sm">
            <div className="flex items-center gap-space-sm">
              {!imgError && PORTFOLIO_DATA.profile.logo ? (
                <img
                  alt="Sreeram S R Monogram Logo"
                  className="h-7 w-auto object-contain"
                  src={PORTFOLIO_DATA.profile.logo || ""}
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="w-7 h-7 rounded bg-primary text-white flex items-center justify-center font-bold text-xs">
                  {PORTFOLIO_DATA.copy.Footer.text1}
                </div>
              )}
              <span className="font-headline-sm text-headline-sm text-on-surface tracking-tight font-bold">
                {PORTFOLIO_DATA.profile.name}
              </span>
            </div>

            <p className="font-body-sm text-body-sm text-on-surface-variant max-w-sm leading-relaxed">
              {PORTFOLIO_DATA.copy.Footer.text3}
            </p>

            <div className="flex items-center gap-space-xs pt-space-xs">
              <span className="inline-flex items-center gap-1.5 px-space-sm py-1 rounded-lg bg-surface-container-low text-on-surface font-label-sm text-label-sm border border-surface-container">
                <span className="w-1.5 h-1.5 rounded-full bg-on-tertiary-container animate-pulse" />
                {PORTFOLIO_DATA.copy.Footer.text4}
              </span>
            </div>
          </div>

          <div className="md:col-span-3 flex flex-col gap-space-xs">
            <span className="font-label-md text-label-md text-on-surface uppercase tracking-wider mb-space-xs font-bold">
              {PORTFOLIO_DATA.copy.Footer.text5}
            </span>
            {navigationLinks(window.__CMS_CONTENT).map((link) => (
              <a
                key={link.id}
                className="font-body-sm text-on-surface-variant hover:text-secondary"
                href={link.href}
                target={link.newTab ? "_blank" : undefined}
                rel="noopener noreferrer"
              >
                {link.label}
              </a>
            ))}
            <button
              onClick={onOpenResumeModal}
              className="font-body-sm text-body-sm text-secondary hover:text-primary transition-colors text-left font-semibold mt-1 cursor-pointer"
            >
              {PORTFOLIO_DATA.copy.Footer.text10}
            </button>
          </div>

          <div className="md:col-span-4 flex flex-col gap-space-xs">
            <span className="font-label-md text-label-md text-on-surface uppercase tracking-wider mb-space-xs font-bold">
              {PORTFOLIO_DATA.copy.Footer.text11}
            </span>
            <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
              {PORTFOLIO_DATA.copy.Footer.text12}
            </p>
            <div className="pt-space-xs">
              <button
                onClick={onOpenContactModal}
                className="font-label-md text-label-md text-secondary hover:text-primary transition-colors inline-flex items-center gap-1 font-semibold cursor-pointer"
              >
                {PORTFOLIO_DATA.copy.Footer.text13}
              </button>
            </div>
          </div>
        </div>

        <div className="pt-space-md border-t border-surface-container-high flex flex-col sm:flex-row items-center justify-between gap-space-sm">
          <span className="font-body-sm text-body-sm text-on-surface-variant text-xs">
            {PORTFOLIO_DATA.copy.Footer.text14}
          </span>

          <div className="flex items-center gap-space-md">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest text-[10px]">
              {PORTFOLIO_DATA.copy.Footer.text15}
            </span>
            <button
              onClick={scrollToTop}
              className="w-8 h-8 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary flex items-center justify-center transition-colors cursor-pointer"
              title="Back to Top"
            >
              <span className="material-symbols-outlined text-[18px]">
                {PORTFOLIO_DATA.copy.Footer.text16}
              </span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
