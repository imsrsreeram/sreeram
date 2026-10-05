import React, { useState } from "react";
import { usePortfolioData } from "../cms/context";

export const IndustryExposure: React.FC = () => {
  const PORTFOLIO_DATA = usePortfolioData();

  const [selectedStage, setSelectedStage] = useState<number>(1);
  const exp = PORTFOLIO_DATA.experience;

  return (
    <section className="w-full py-space-xl bg-surface-container-lowest shadow-sm border-y border-surface-container">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-space-xs mb-space-xl">
          <div className="flex items-center gap-2">
            <span className="w-6 h-[2px] bg-secondary" />
            <span className="font-label-md text-label-md text-secondary uppercase tracking-widest font-semibold">
              {PORTFOLIO_DATA.copy.IndustryExposure.text1}
            </span>
          </div>
          <h2 className="font-headline-xl text-headline-xl text-primary font-bold">
            {PORTFOLIO_DATA.copy.IndustryExposure.text2}
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
            {exp.summary}
          </p>
        </div>

        <div className="p-8 sm:p-12 rounded-xl bg-surface shadow-md flex flex-col gap-space-xl border border-surface-container-high">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md border-b border-surface-container-high pb-8">
            <div className="flex items-center gap-space-md">
              <div className="w-16 h-16 rounded-xl bg-primary text-on-primary flex items-center justify-center font-stat-metric text-2xl font-bold shrink-0 ring-2 ring-secondary/20">
                {PORTFOLIO_DATA.copy.IndustryExposure.text3}
              </div>
              <div className="flex flex-col">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-headline-lg text-headline-lg text-primary font-bold">
                    {exp.company}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-surface-container-high text-on-surface font-label-sm text-label-sm font-semibold">
                    {exp.year}
                  </span>
                </div>
                <span className="font-body-md text-body-md text-on-surface-variant">
                  {exp.role}
                </span>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-container-high text-on-surface border border-surface-container-highest">
              <span className="w-2.5 h-2.5 rounded-full bg-on-tertiary-container animate-pulse" />
              <span className="font-label-md text-label-md font-semibold">
                {exp.sector}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-space-md">
            {exp.vectors.map((vec) => (
              <div
                key={vec.id}
                className="flex flex-col gap-1 p-3.5 rounded-xl bg-surface-container-low border border-surface-container-highest hover:bg-surface-container-high transition-colors"
              >
                <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider font-semibold">
                  {vec.id} {PORTFOLIO_DATA.copy.IndustryExposure.text4}
                </span>
                <span className="font-headline-sm text-headline-sm text-primary font-bold">
                  {vec.title}
                </span>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  {vec.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="p-6 sm:p-8 rounded-xl bg-surface-container-low flex flex-col gap-space-md border border-surface-container-high">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="font-label-md text-label-md text-primary font-bold uppercase tracking-wider">
                {PORTFOLIO_DATA.copy.IndustryExposure.text5}
              </span>
              <span className="font-label-sm text-label-sm text-on-tertiary-container flex items-center gap-1.5 font-semibold">
                <span className="w-2 h-2 rounded-full bg-on-tertiary-container animate-ping" />
                {PORTFOLIO_DATA.copy.IndustryExposure.text6}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-space-md relative items-stretch">
              {exp.stages.map((stg) => {
                const isSelected = selectedStage === stg.stage;
                return (
                  <div
                    key={stg.stage}
                    onClick={() => setSelectedStage(stg.stage)}
                    className={`p-4 rounded-xl shadow-sm flex flex-col justify-between gap-2 relative cursor-pointer transition-all duration-200 border ${
                      isSelected
                        ? "bg-surface-container-lowest ring-2 ring-secondary border-secondary scale-102 shadow-md"
                        : "bg-surface-container-lowest border-surface-container hover:border-secondary/40"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-label-sm text-label-sm text-secondary font-bold">
                        {PORTFOLIO_DATA.copy.IndustryExposure.text7}
                        {stg.stage}
                      </span>
                      <span
                        className={`material-symbols-outlined text-[22px] ${
                          stg.stage === 4
                            ? "text-on-tertiary-container"
                            : "text-secondary"
                        }`}
                      >
                        {stg.icon}
                      </span>
                    </div>

                    <div className="flex flex-col gap-1">
                      <span className="font-headline-sm text-[16px] font-bold text-primary">
                        {stg.title}
                      </span>
                      <p className="font-body-sm text-[12px] text-on-surface-variant leading-relaxed">
                        {stg.subtitle}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-surface-container flex items-center justify-between text-[11px] text-secondary font-semibold">
                      <span>{PORTFOLIO_DATA.copy.IndustryExposure.text8}</span>
                      <span>{PORTFOLIO_DATA.copy.IndustryExposure.text9}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {selectedStage && (
              <div className="p-4 rounded-xl bg-surface-container-lowest border border-secondary/20 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in fade-in duration-150">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[20px]">
                      {exp.stages[selectedStage - 1].icon}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] uppercase tracking-wider font-bold text-secondary block">
                      {PORTFOLIO_DATA.copy.IndustryExposure.text10}
                      {selectedStage}{" "}
                      {PORTFOLIO_DATA.copy.IndustryExposure.text11}
                      {exp.stages[selectedStage - 1].title}
                    </span>
                    <p className="text-xs text-on-surface font-medium">
                      {PORTFOLIO_DATA.copy.IndustryExposure.text12}
                      {exp.stages[selectedStage - 1].keyFocus}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0 text-xs font-mono">
                  <div className="bg-surface-container-low px-3 py-1.5 rounded-lg border border-surface-container">
                    <span className="text-on-surface-variant text-[10px] block font-sans">
                      {PORTFOLIO_DATA.copy.IndustryExposure.text13}
                    </span>
                    <span className="font-bold text-secondary">
                      {exp.stages[selectedStage - 1].temp}
                    </span>
                  </div>
                  <div className="bg-surface-container-low px-3 py-1.5 rounded-lg border border-surface-container">
                    <span className="text-on-surface-variant text-[10px] block font-sans">
                      {PORTFOLIO_DATA.copy.IndustryExposure.text14}
                    </span>
                    <span className="font-bold text-on-tertiary-container">
                      {exp.stages[selectedStage - 1].kpi}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
