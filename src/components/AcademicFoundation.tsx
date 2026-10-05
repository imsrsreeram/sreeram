import { usePortfolioData } from "../cms/context";
import React, { useState } from "react";
import { PORTFOLIO_DATA, EducationItem } from "../data/portfolioData";

export const AcademicFoundation: React.FC = () => {
  const PORTFOLIO_DATA = usePortfolioData();

  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  return (
    <section className="w-full py-space-xl">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-space-xs mb-space-xl">
          <div className="flex items-center gap-2">
            <span className="w-6 h-[2px] bg-secondary" />
            <span className="font-label-md text-label-md text-secondary uppercase tracking-widest font-semibold">
              {PORTFOLIO_DATA.copy.AcademicFoundation.text1}
            </span>
          </div>
          <h2 className="font-headline-xl text-headline-xl text-primary font-bold">
            {PORTFOLIO_DATA.copy.AcademicFoundation.text2}
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-xl">
            {PORTFOLIO_DATA.copy.AcademicFoundation.text3}
          </p>
        </div>

        {/* Vertical Chronological Timeline Pathway */}
        <div className="relative pl-6 sm:pl-10 ml-2 sm:ml-4 border-l-2 border-surface-container-high flex flex-col gap-space-lg">
          {PORTFOLIO_DATA.education.map((item: EducationItem, idx: number) => {
            const isExpanded = expandedIndex === idx;
            return (
              <div
                key={idx}
                className="relative flex flex-col md:flex-row md:items-center justify-between gap-space-md p-space-lg rounded-xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-all border border-surface-container-high"
              >
                <span
                  className={`absolute -left-[31px] sm:-left-[47px] top-6 w-5 h-5 rounded-full flex items-center justify-center ${
                    item.statusType === "active"
                      ? "bg-secondary-fixed ring-4 ring-secondary/20"
                      : "bg-surface-container-high"
                  }`}
                >
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      item.statusType === "active"
                        ? "bg-secondary animate-pulse"
                        : item.statusType === "conferred"
                          ? "bg-primary"
                          : "bg-outline"
                    }`}
                  />
                </span>

                <div className="flex flex-col gap-1.5 flex-1 pr-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded font-label-sm text-label-sm uppercase font-semibold ${
                        item.statusType === "active"
                          ? "bg-secondary/10 text-secondary"
                          : "bg-surface-container-high text-on-surface"
                      }`}
                    >
                      {item.degree}
                    </span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
                      {item.cohort}
                    </span>
                  </div>

                  <h3 className="font-headline-md text-headline-md text-primary font-bold">
                    {item.institution}
                  </h3>

                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    {item.description}
                  </p>

                  {isExpanded && item.highlights && (
                    <div className="mt-3 pt-3 border-t border-surface-container flex flex-col gap-1.5 animate-in fade-in duration-150">
                      <span className="text-[11px] font-bold text-secondary uppercase tracking-wider">
                        {PORTFOLIO_DATA.copy.AcademicFoundation.text4}
                      </span>
                      <ul className="space-y-1 text-xs text-on-surface">
                        {item.highlights.map((hl, hIdx) => (
                          <li key={hIdx} className="flex items-start gap-1.5">
                            <span className="text-secondary font-bold">
                              {PORTFOLIO_DATA.copy.AcademicFoundation.text5}
                            </span>
                            <span>{hl}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <button
                    onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                    className="self-start text-[11px] font-semibold text-secondary hover:text-primary transition-colors flex items-center gap-1 mt-1 cursor-pointer"
                  >
                    <span>
                      {isExpanded
                        ? "Hide Details"
                        : "View Coursework Highlights"}
                    </span>
                    <span className="material-symbols-outlined text-[14px]">
                      {isExpanded ? "expand_less" : "expand_more"}
                    </span>
                  </button>
                </div>

                <div className="flex flex-wrap gap-x-3 gap-y-1 md:flex-nowrap md:flex-col items-start md:items-end justify-between md:shrink-0 pl-4 border-l border-surface-container-high/70 md:min-w-[130px] min-w-0">
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">
                    {item.metricLabel}
                  </span>
                  <span className="font-stat-metric text-[32px] font-extrabold text-primary">
                    {item.metricValue}
                  </span>
                  <span
                    className={`font-label-sm text-label-sm font-semibold ${
                      item.statusType === "active"
                        ? "text-on-tertiary-container"
                        : "text-on-surface-variant"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
