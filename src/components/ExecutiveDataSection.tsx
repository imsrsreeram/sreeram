import { usePortfolioData } from "../cms/context";
import React, { useState, useId } from "react";

export const ExecutiveDataSection: React.FC = () => {
  const gradientId = useId();
  const PORTFOLIO_DATA = usePortfolioData();

  const [activeMilestone, setActiveMilestone] = useState<number | null>(null);
  const [confidenceLevel, setConfidenceLevel] = useState<"90" | "95" | "99">(
    "95",
  );

  const milestones =
    PORTFOLIO_DATA.componentDetails.ExecutiveDataSection.milestones;

  return (
    <section className="w-full py-space-xl bg-primary text-on-primary relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-on-tertiary-container/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col gap-space-xs mb-space-xl">
          <div className="flex items-center gap-2">
            <span className="w-6 h-[2px] bg-secondary-fixed" />
            <span className="font-label-md text-label-md text-secondary-fixed uppercase tracking-widest font-semibold">
              {PORTFOLIO_DATA.copy.ExecutiveDataSection.text1}
            </span>
          </div>
          <h2 className="font-headline-xl text-headline-xl text-on-primary font-bold">
            {PORTFOLIO_DATA.copy.ExecutiveDataSection.text2}
          </h2>
          <p className="font-body-md text-body-md text-on-primary-container max-w-xl">
            {PORTFOLIO_DATA.copy.ExecutiveDataSection.text3}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-center">
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 flex flex-col gap-space-md shadow-2xl">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-label-md text-label-md text-secondary-fixed uppercase tracking-wider font-semibold">
                {PORTFOLIO_DATA.copy.ExecutiveDataSection.text4}
              </span>
              <div className="flex items-center gap-3">
                <span className="font-label-sm text-label-sm text-on-tertiary-container font-mono bg-[var(--color-tertiary-container)] px-2.5 py-1 rounded-md border border-[var(--color-on-tertiary-container)]/30">
                  {PORTFOLIO_DATA.copy.ExecutiveDataSection.text5}
                </span>
                <div className="flex items-center gap-1 bg-white/10 p-1 rounded-lg text-[10px] font-mono">
                  {(["90", "95", "99"] as const).map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => setConfidenceLevel(lvl)}
                      className={`px-1.5 py-0.5 rounded cursor-pointer ${
                        confidenceLevel === lvl
                          ? "bg-secondary text-white font-bold"
                          : "text-surface-variant hover:text-white"
                      }`}
                      title={`${lvl}% Confidence Interval`}
                    >
                      {lvl}
                      {PORTFOLIO_DATA.copy.ExecutiveDataSection.text6}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="relative">
              <svg className="w-full h-44" fill="none" viewBox="0 0 600 160">
                <defs>
                  <linearGradient
                    id={gradientId}
                    x1="0%"
                    x2="0%"
                    y1="0%"
                    y2="100%"
                  >
                    <stop
                      offset="0%"
                      stopColor="var(--color-secondary-container)"
                      stopOpacity="0.45"
                    />
                    <stop
                      offset="100%"
                      stopColor="var(--color-secondary-container)"
                      stopOpacity="0.0"
                    />
                  </linearGradient>
                </defs>
                <path
                  d="M 0,130 Q 80,110 150,80 T 300,95 T 450,40 T 600,20 L 600,160 L 0,160 Z"
                  fill={`url(#${gradientId})`}
                />
                <path
                  d="M 0,130 Q 80,110 150,80 T 300,95 T 450,40 T 600,20"
                  stroke="var(--color-secondary-container)"
                  strokeWidth="2.5"
                />

                <line
                  stroke="rgba(255,255,255,0.08)"
                  strokeDasharray="4 4"
                  x1="0"
                  x2="600"
                  y1="40"
                  y2="40"
                />
                <line
                  stroke="rgba(255,255,255,0.08)"
                  strokeDasharray="4 4"
                  x1="0"
                  x2="600"
                  y1="80"
                  y2="80"
                />
                <line
                  stroke="rgba(255,255,255,0.08)"
                  strokeDasharray="4 4"
                  x1="0"
                  x2="600"
                  y1="120"
                  y2="120"
                />

                {milestones.map((m) => {
                  const isActive = activeMilestone === m.id;
                  return (
                    <g
                      key={m.id}
                      className="cursor-pointer"
                      onClick={() => setActiveMilestone(m.id)}
                    >
                      <circle
                        cx={m.cx}
                        cy={m.cy}
                        fill="var(--color-tertiary-fixed-dim)"
                        r={isActive ? 6 : 4}
                        className="transition-all hover:scale-150"
                      />
                      {isActive && (
                        <circle
                          cx={m.cx}
                          cy={m.cy}
                          stroke="var(--color-tertiary-fixed-dim)"
                          strokeWidth="2"
                          fill="none"
                          r="10"
                          className="animate-ping"
                        />
                      )}
                    </g>
                  );
                })}
              </svg>

              {activeMilestone && (
                <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-black/90 border border-[var(--color-tertiary-fixed-dim)]/40 p-2.5 rounded-lg text-xs text-center backdrop-blur-md animate-in fade-in duration-100 z-20">
                  <span className="font-bold text-[var(--color-tertiary-fixed-dim)] block">
                    {milestones.find((m) => m.id === activeMilestone)?.label}{" "}
                    {PORTFOLIO_DATA.copy.ExecutiveDataSection.text7}
                    {milestones.find((m) => m.id === activeMilestone)?.val}
                    {PORTFOLIO_DATA.copy.ExecutiveDataSection.text8}
                  </span>
                  <span className="text-surface-variant text-[11px]">
                    {milestones.find((m) => m.id === activeMilestone)?.desc}
                  </span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10 text-center font-mono">
              <div className="p-2 rounded bg-white/5">
                <span className="font-label-sm text-[11px] text-surface-variant block font-sans">
                  {PORTFOLIO_DATA.copy.ExecutiveDataSection.text9}
                </span>
                <span className="font-headline-sm text-[16px] text-on-primary font-bold">
                  {PORTFOLIO_DATA.copy.ExecutiveDataSection.text10}
                </span>
              </div>
              <div className="p-2 rounded bg-white/5">
                <span className="font-label-sm text-[11px] text-surface-variant block font-sans">
                  {PORTFOLIO_DATA.copy.ExecutiveDataSection.text11}
                </span>
                <span className="font-headline-sm text-[16px] text-tertiary-fixed-dim font-bold">
                  {confidenceLevel === "99"
                    ? "± 1.8%"
                    : confidenceLevel === "95"
                      ? "± 2.4%"
                      : "± 3.1%"}
                </span>
              </div>
              <div className="p-2 rounded bg-white/5">
                <span className="font-label-sm text-[11px] text-surface-variant block font-sans">
                  {PORTFOLIO_DATA.copy.ExecutiveDataSection.text12}
                </span>
                <span className="font-headline-sm text-[16px] text-secondary-fixed font-bold">
                  {PORTFOLIO_DATA.copy.ExecutiveDataSection.text13}
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col gap-space-md">
            <div className="p-6 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 flex flex-col gap-2 hover:bg-white/10 transition-colors">
              <span className="font-label-sm text-label-sm text-secondary-fixed uppercase tracking-wider font-semibold">
                {PORTFOLIO_DATA.copy.ExecutiveDataSection.text14}
              </span>
              <h4 className="font-headline-sm text-headline-sm text-on-primary font-bold">
                {PORTFOLIO_DATA.copy.ExecutiveDataSection.text15}
              </h4>
              <p className="font-body-sm text-body-sm text-surface-variant leading-relaxed">
                {PORTFOLIO_DATA.copy.ExecutiveDataSection.text16}
              </p>
            </div>

            <div className="p-6 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 flex flex-col gap-2 hover:bg-white/10 transition-colors">
              <span className="font-label-sm text-label-sm text-tertiary-fixed-dim uppercase tracking-wider font-semibold">
                {PORTFOLIO_DATA.copy.ExecutiveDataSection.text17}
              </span>
              <h4 className="font-headline-sm text-headline-sm text-on-primary font-bold">
                {PORTFOLIO_DATA.copy.ExecutiveDataSection.text18}
              </h4>
              <p className="font-body-sm text-body-sm text-surface-variant leading-relaxed">
                {PORTFOLIO_DATA.copy.ExecutiveDataSection.text19}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
