import React, { useState } from "react";
import { usePortfolioData } from "../cms/context";

export const Certifications: React.FC = () => {
  const PORTFOLIO_DATA = usePortfolioData();

  const [activeCert, setActiveCert] = useState<number | null>(null);

  return (
    <section className="w-full py-space-xl">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-space-xs mb-space-xl">
          <div className="flex items-center gap-2">
            <span className="w-6 h-[2px] bg-secondary" />
            <span className="font-label-md text-label-md text-secondary uppercase tracking-widest font-semibold">
              {PORTFOLIO_DATA.copy.Certifications.text1}
            </span>
          </div>
          <h2 className="font-headline-xl text-headline-xl text-primary font-bold">
            {PORTFOLIO_DATA.copy.Certifications.text2}
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-xl">
            {PORTFOLIO_DATA.copy.Certifications.text3}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg">
          {PORTFOLIO_DATA.certifications.map((cert, idx) => {
            const isExpanded = activeCert === idx;
            return (
              <div
                key={cert.title}
                className="p-8 rounded-xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-space-md border border-surface-container-high group"
              >
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <span
                      className={`px-3 py-1 rounded font-label-sm text-label-sm uppercase font-semibold ${
                        idx === 0
                          ? "bg-secondary/10 text-secondary"
                          : "bg-on-tertiary-container/10 text-on-tertiary-container"
                      }`}
                    >
                      {cert.issuer}
                    </span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
                      {cert.duration}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <h3 className="font-headline-md text-headline-md text-primary font-bold">
                      {cert.title}
                    </h3>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                      {cert.description}
                    </p>
                  </div>

                  {isExpanded && (
                    <div className="mt-2 pt-3 border-t border-surface-container flex flex-col gap-2 animate-in fade-in duration-150">
                      <span className="text-[11px] font-bold text-secondary uppercase tracking-wider">
                        {PORTFOLIO_DATA.copy.Certifications.text4}
                      </span>
                      <ul className="space-y-1.5 text-xs text-on-surface">
                        {cert.topics.map((t, tIdx) => (
                          <li key={tIdx} className="flex items-start gap-1.5">
                            <span className="text-secondary font-bold">
                              {PORTFOLIO_DATA.copy.Certifications.text5}
                            </span>
                            <span>{t}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <button
                    onClick={() => setActiveCert(isExpanded ? null : idx)}
                    className="self-start text-[11px] font-semibold text-secondary hover:text-primary transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span>
                      {isExpanded
                        ? "Hide Syllabus Topics"
                        : "View Accredited Syllabus Topics"}
                    </span>
                    <span className="material-symbols-outlined text-[14px]">
                      {isExpanded ? "expand_less" : "expand_more"}
                    </span>
                  </button>
                </div>

                <div className="pt-6 border-t border-surface-container-high flex items-center justify-between">
                  {idx === 0 ? (
                    <>
                      <div className="flex flex-col">
                        <span className="font-stat-metric text-[36px] text-secondary font-extrabold">
                          {cert.score}
                        </span>
                        <span className="font-label-sm text-label-sm text-on-surface-variant uppercase font-semibold">
                          {cert.scoreLabel}
                        </span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="font-headline-sm text-headline-sm text-primary font-bold">
                          {PORTFOLIO_DATA.copy.Certifications.text6}
                        </span>
                        <span className="font-label-sm text-label-sm text-on-tertiary-container font-semibold">
                          {PORTFOLIO_DATA.copy.Certifications.text7}
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex flex-col">
                        <span className="font-headline-md text-headline-md text-primary font-bold">
                          {cert.badge}
                        </span>
                        <span className="font-label-sm text-label-sm text-on-surface-variant uppercase font-semibold">
                          {cert.scoreLabel}
                        </span>
                      </div>
                      <div className="w-12 h-12 rounded-lg bg-surface-container-high flex items-center justify-center text-primary group-hover:bg-secondary group-hover:text-white transition-colors">
                        <span className="material-symbols-outlined text-[26px]">
                          {PORTFOLIO_DATA.copy.Certifications.text8}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
