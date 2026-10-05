import React, { useState } from "react";
import { usePortfolioData } from "../cms/context";

export const ExecutiveProfile: React.FC = () => {
  const PORTFOLIO_DATA = usePortfolioData();

  const [selectedPillar, setSelectedPillar] = useState<string | null>(null);

  return (
    <section className="w-full py-space-xl bg-surface-container-lowest shadow-sm border-y border-surface-container">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md pb-space-lg border-b border-surface-container-high">
          <div className="flex flex-col gap-space-xs max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="w-6 h-[2px] bg-secondary" />
              <span className="font-label-md text-label-md text-secondary uppercase tracking-widest font-semibold">
                {PORTFOLIO_DATA.copy.ExecutiveProfile.text1}
              </span>
            </div>
            <h2 className="font-headline-xl text-headline-xl text-primary font-bold">
              {PORTFOLIO_DATA.copy.ExecutiveProfile.text2}
            </h2>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-md">
            {PORTFOLIO_DATA.copy.ExecutiveProfile.text3}
          </p>
        </div>

        {/* Three Pillars Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-space-lg pt-space-xl">
          {PORTFOLIO_DATA.profile.pillars.map((pillar) => {
            const isExpanded = selectedPillar === pillar.id;
            return (
              <div
                key={pillar.id}
                className={`flex flex-col justify-between p-8 rounded-xl bg-surface hover:bg-surface-container-low transition-all duration-200 shadow-sm border border-surface-container-high group ${
                  isExpanded
                    ? "ring-2 ring-secondary bg-surface-container-low"
                    : ""
                }`}
              >
                <div className="flex flex-col gap-space-md">
                  <div className="flex items-center justify-between">
                    <span
                      className="font-headline-sm text-headline-sm font-bold"
                      style={{ color: pillar.accentColor }}
                    >
                      {pillar.id}
                    </span>
                    <span
                      className="material-symbols-outlined text-[28px] group-hover:scale-110 transition-transform"
                      style={{ color: pillar.accentColor }}
                    >
                      {pillar.icon}
                    </span>
                  </div>

                  <div className="flex flex-col gap-space-xs">
                    <h3 className="font-headline-md text-headline-md text-primary font-semibold">
                      {pillar.title}
                    </h3>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                      {pillar.description}
                    </p>
                  </div>

                  {/* Expandable Applied Points */}
                  {isExpanded && (
                    <div className="mt-2 pt-3 border-t border-surface-container flex flex-col gap-2 animate-in fade-in duration-200">
                      <span className="font-label-sm text-[11px] font-bold text-secondary uppercase tracking-wider">
                        {PORTFOLIO_DATA.copy.ExecutiveProfile.text4}
                      </span>
                      <ul className="space-y-1.5 text-xs text-on-surface">
                        {pillar.appliedPoints.map((pt, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-secondary font-bold">
                              {PORTFOLIO_DATA.copy.ExecutiveProfile.text5}
                            </span>
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="pt-space-md mt-space-md border-t border-surface-container flex flex-col gap-3">
                  <div className="flex flex-wrap gap-1.5">
                    {pillar.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 rounded bg-surface-container-high text-on-surface font-label-sm text-label-sm hover:bg-secondary/15 hover:text-secondary transition-colors"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() =>
                      setSelectedPillar(isExpanded ? null : pillar.id)
                    }
                    className="self-start text-xs font-semibold text-secondary hover:text-primary transition-colors flex items-center gap-1 mt-1 cursor-pointer"
                  >
                    <span>
                      {isExpanded
                        ? "Hide Applied Frameworks"
                        : "View Applied Frameworks"}
                    </span>
                    <span className="material-symbols-outlined text-[16px]">
                      {isExpanded ? "expand_less" : "expand_more"}
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
