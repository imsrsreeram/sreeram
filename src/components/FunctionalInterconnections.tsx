import React, { useState } from "react";
import { usePortfolioData } from "../cms/context";

export const FunctionalInterconnections: React.FC = () => {
  const PORTFOLIO_DATA = usePortfolioData();

  const [hoveredQuadrant, setHoveredQuadrant] = useState<string | null>(null);
  const [activeQuadrant, setActiveQuadrant] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simStep, setSimStep] = useState<number>(0);

  const quadrants = PORTFOLIO_DATA.interconnections.quadrants;

  const currentKey = hoveredQuadrant || activeQuadrant;
  const currentQuadrant = quadrants.find((q) => q.id === currentKey);

  const memoText = currentQuadrant
    ? currentQuadrant.explanation
    : "Hover over or click any quadrant above to inspect how functional inputs flow systematically through Analytics, Operations, and Delivery channels.";

  const handleSimulate = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setSimStep(0);

    const steps = ["marketing", "analytics", "operations", "supplychain"];
    steps.forEach((st, idx) => {
      setTimeout(() => {
        setSimStep(idx + 1);
        setActiveQuadrant(st);
        if (idx === steps.length - 1) {
          setTimeout(() => {
            setIsSimulating(false);
          }, 2000);
        }
      }, idx * 1200);
    });
  };

  return (
    <section className="w-full py-space-xl bg-surface-container-low">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md mb-space-xl">
          <div className="flex flex-col gap-space-xs">
            <div className="flex items-center gap-2">
              <span className="w-6 h-[2px] bg-secondary" />
              <span className="font-label-md text-label-md text-secondary uppercase tracking-widest font-semibold">
                {PORTFOLIO_DATA.copy.FunctionalInterconnections.text1}
              </span>
            </div>
            <h2 className="font-headline-xl text-headline-xl text-primary font-bold">
              {PORTFOLIO_DATA.copy.FunctionalInterconnections.text2}
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
              {PORTFOLIO_DATA.copy.FunctionalInterconnections.text3}
            </p>
          </div>

          <button
            onClick={handleSimulate}
            disabled={isSimulating}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-label-md text-xs font-semibold transition-all shadow-xs cursor-pointer ${
              isSimulating
                ? "bg-secondary text-white ring-2 ring-secondary/50"
                : "bg-surface-container-lowest hover:bg-primary hover:text-white text-primary border border-surface-container-highest"
            }`}
          >
            <span
              className={`material-symbols-outlined text-[18px] ${isSimulating ? "animate-spin" : ""}`}
            >
              {isSimulating ? "sync" : "play_circle"}
            </span>
            <span>
              {isSimulating
                ? `Tracing Flow (Step ${simStep}/4)...`
                : "Simulate Strategy Cycle"}
            </span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-md">
          {quadrants.map((quad, qIdx) => {
            const isHighlighted = currentKey === quad.id;
            const isStepActive = isSimulating && simStep === qIdx + 1;

            return (
              <div
                key={quad.id}
                onMouseEnter={() => setHoveredQuadrant(quad.id)}
                onMouseLeave={() => setHoveredQuadrant(null)}
                onClick={() =>
                  setActiveQuadrant(activeQuadrant === quad.id ? null : quad.id)
                }
                className={`quadrant-card p-6 rounded-xl bg-surface-container-lowest shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col justify-between gap-4 border ${
                  isHighlighted || isStepActive
                    ? "ring-2 ring-secondary border-secondary scale-102 shadow-md bg-surface-container-lowest"
                    : "border-surface-container hover:border-secondary/40"
                }`}
                data-quadrant={quad.id}
              >
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center transition-colors"
                      style={{
                        backgroundColor: `${quad.color}15`,
                        color: quad.color,
                      }}
                    >
                      <span className="material-symbols-outlined">
                        {quad.icon}
                      </span>
                    </div>

                    {isStepActive && (
                      <span className="px-2 py-0.5 rounded-full bg-secondary text-white text-[10px] font-bold animate-pulse">
                        {PORTFOLIO_DATA.copy.FunctionalInterconnections.text4}
                      </span>
                    )}
                  </div>

                  <h3 className="font-headline-md text-headline-md text-primary font-bold">
                    {quad.title}
                  </h3>

                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    {quad.summary}
                  </p>
                </div>

                <div
                  className="pt-3 border-t border-surface-container flex items-center gap-1.5 font-label-sm text-label-sm font-semibold"
                  style={{ color: quad.color }}
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {PORTFOLIO_DATA.copy.FunctionalInterconnections.text5}
                  </span>
                  <span>
                    {PORTFOLIO_DATA.copy.FunctionalInterconnections.text6}
                    {quad.output}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-space-md p-6 rounded-xl bg-surface-container-highest/60 flex items-center gap-4 transition-all border border-surface-container-high shadow-xs">
          <span className="material-symbols-outlined text-secondary text-[28px] shrink-0 animate-pulse">
            {PORTFOLIO_DATA.copy.FunctionalInterconnections.text7}
          </span>
          <div className="flex flex-col gap-1">
            <span className="font-label-md text-label-md text-primary font-bold uppercase tracking-wider">
              {PORTFOLIO_DATA.copy.FunctionalInterconnections.text8}
            </span>
            <p className="font-body-sm text-body-sm text-on-surface leading-relaxed">
              {memoText}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
