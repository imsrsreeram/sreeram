import React from "react";
import { usePortfolioData } from "../cms/context";

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResumeModal: React.FC<ResumeModalProps> = ({
  isOpen,
  onClose,
}) => {
  const PORTFOLIO_DATA = usePortfolioData();

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-surface-container-lowest w-full max-w-4xl rounded-2xl shadow-2xl border border-surface-container-high flex flex-col max-h-[92vh] overflow-hidden">
        <div className="px-6 py-4 border-b border-surface-container-high flex items-center justify-between bg-surface-container-low shrink-0">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-secondary text-[24px]">
              {PORTFOLIO_DATA.copy.ResumeModal.text1}
            </span>
            <div>
              <h3 className="font-headline-sm text-sm sm:text-base font-bold text-primary">
                {PORTFOLIO_DATA.copy.ResumeModal.text2}
              </h3>
              <span className="text-[11px] text-on-surface-variant">
                {PORTFOLIO_DATA.copy.ResumeModal.text3}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-lowest hover:bg-surface-container text-xs font-semibold text-primary border border-surface-container-highest transition-colors cursor-pointer"
              title="Print or Save as PDF"
            >
              <span className="material-symbols-outlined text-[16px]">
                {PORTFOLIO_DATA.copy.ResumeModal.text4}
              </span>
              <span>{PORTFOLIO_DATA.copy.ResumeModal.text5}</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              {PORTFOLIO_DATA.copy.ResumeModal.text6}
            </button>
          </div>
        </div>

        <div className="p-6 sm:p-10 overflow-y-auto flex flex-col gap-6 text-xs text-on-surface print:p-0">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-surface-container-high pb-6">
            <div>
              <h1 className="font-display-lg text-2xl sm:text-3xl text-primary font-bold">
                {PORTFOLIO_DATA.copy.ResumeModal.text7}
              </h1>
              <p className="text-secondary font-semibold text-sm mt-0.5">
                {PORTFOLIO_DATA.copy.ResumeModal.text8}
              </p>
              <p className="text-on-surface-variant text-[11px] mt-1">
                {PORTFOLIO_DATA.copy.ResumeModal.text9}
                {PORTFOLIO_DATA.profile.email}
              </p>
            </div>
            <div className="flex flex-col sm:items-end gap-1 shrink-0 bg-surface-container-low p-3 rounded-xl border border-surface-container">
              <span className="text-[11px] font-bold text-secondary uppercase">
                {PORTFOLIO_DATA.copy.ResumeModal.text10}
              </span>
              <span className="text-xl font-black text-primary font-mono">
                {PORTFOLIO_DATA.copy.ResumeModal.text11}
              </span>
              <span className="text-[10px] text-on-tertiary-container font-semibold">
                {PORTFOLIO_DATA.copy.ResumeModal.text12}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <h4 className="font-bold text-xs uppercase tracking-wider text-secondary border-b border-surface-container pb-1">
              {PORTFOLIO_DATA.copy.ResumeModal.text13}
            </h4>
            <p className="text-on-surface-variant leading-relaxed text-xs">
              {PORTFOLIO_DATA.profile.bio}
            </p>
          </div>

          <div className="flex flex-col gap-1.5">
            <h4 className="font-bold text-xs uppercase tracking-wider text-secondary border-b border-surface-container pb-1">
              {PORTFOLIO_DATA.copy.ResumeModal.text14}
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
              {PORTFOLIO_DATA.capabilities.map((c) => (
                <div
                  key={c.id}
                  className="p-2 rounded bg-surface-container-low border border-surface-container"
                >
                  <span className="font-bold text-primary block">
                    {c.title}
                  </span>
                  <span className="text-[10px] text-on-surface-variant">
                    {c.tags.slice(0, 2).join(" • ")}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h4 className="font-bold text-xs uppercase tracking-wider text-secondary border-b border-surface-container pb-1">
              {PORTFOLIO_DATA.copy.ResumeModal.text15}
            </h4>
            <div className="space-y-3">
              {PORTFOLIO_DATA.education.map((edu, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-start gap-4"
                >
                  <div>
                    <span className="font-bold text-primary text-xs">
                      {edu.degree}
                    </span>
                    <p className="text-on-surface-variant text-[11px]">
                      {edu.institution} {PORTFOLIO_DATA.copy.ResumeModal.text16}
                      {edu.cohort}
                      {PORTFOLIO_DATA.copy.ResumeModal.text17}
                    </p>
                    <p className="text-on-surface-variant text-[11px] mt-0.5">
                      {edu.description}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-bold text-primary font-mono text-xs">
                      {edu.metricValue}
                    </span>
                    <span className="text-[10px] text-on-surface-variant block">
                      {edu.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h4 className="font-bold text-xs uppercase tracking-wider text-secondary border-b border-surface-container pb-1">
              {PORTFOLIO_DATA.copy.ResumeModal.text18}
            </h4>
            <div className="space-y-3">
              {PORTFOLIO_DATA.projects.map((proj) => (
                <div
                  key={proj.id}
                  className="p-3 rounded-xl bg-surface-container-low border border-surface-container flex flex-col gap-1"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-primary text-xs">
                      {proj.title}
                    </span>
                    <span className="text-[10px] font-bold text-secondary font-mono">
                      {PORTFOLIO_DATA.copy.ResumeModal.text19}
                      {proj.keyMetric.value}
                    </span>
                  </div>
                  <p className="text-on-surface-variant text-[11px]">
                    {proj.summary}
                  </p>
                  <p className="text-[10px] text-primary mt-1">
                    <strong>{PORTFOLIO_DATA.copy.ResumeModal.text20}</strong>{" "}
                    {proj.insights[2]?.desc || proj.insights[0]?.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <h4 className="font-bold text-xs uppercase tracking-wider text-secondary border-b border-surface-container pb-1">
              {PORTFOLIO_DATA.copy.ResumeModal.text21}
            </h4>
            <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container flex flex-col gap-1">
              <div className="flex justify-between">
                <span className="font-bold text-primary text-xs">
                  {PORTFOLIO_DATA.experience.company}
                </span>
                <span className="text-[10px] text-on-surface-variant font-mono">
                  {PORTFOLIO_DATA.experience.year}
                </span>
              </div>
              <p className="text-on-surface-variant text-[11px]">
                {PORTFOLIO_DATA.experience.role}
              </p>
              <p className="text-[10px] text-on-surface-variant mt-1">
                {PORTFOLIO_DATA.copy.ResumeModal.text22}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <h4 className="font-bold text-xs uppercase tracking-wider text-secondary border-b border-surface-container pb-1">
              {PORTFOLIO_DATA.copy.ResumeModal.text23}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {PORTFOLIO_DATA.certifications.map((c) => (
                <div
                  key={c.title}
                  className="p-2.5 rounded bg-surface-container-low border border-surface-container flex justify-between items-center"
                >
                  <div>
                    <span className="font-bold text-primary block">
                      {c.title}
                    </span>
                    <span className="text-[10px] text-on-surface-variant">
                      {c.issuer}
                    </span>
                  </div>
                  <span className="font-bold text-secondary text-xs font-mono">
                    {c.score}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="px-6 py-3 border-t border-surface-container-high bg-surface-container-low flex justify-between items-center shrink-0">
          <span className="text-[11px] text-on-surface-variant">
            {PORTFOLIO_DATA.copy.ResumeModal.text24}
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-primary text-white rounded-xl text-xs font-semibold hover:bg-secondary transition-colors cursor-pointer"
          >
            {PORTFOLIO_DATA.copy.ResumeModal.text25}
          </button>
        </div>
      </div>
    </div>
  );
};
