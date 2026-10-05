import { safeURL } from "../cms/model";
import React, { useState, useEffect } from "react";
import { usePortfolioData } from "../cms/context";

interface HeroProps {
  onOpenResumeModal: () => void;
  onOpenContactModal: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onOpenResumeModal,
  onOpenContactModal,
}) => {
  const PORTFOLIO_DATA = usePortfolioData();

  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const nodes = PORTFOLIO_DATA.componentDetails.Hero.nodes;

  return (
    <div className="relative w-full">
      {/* Interactive Pointer Tracking Canvas Layer */}
      <div
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden opacity-45 transition-opacity"
        data-ambient="true"
      >
        <div
          className="absolute w-[500px] h-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr from-secondary/15 via-on-tertiary-container/10 to-transparent blur-3xl transition-transform duration-100 ease-out will-change-transform"
          style={{
            transform: `translate3d(${mousePos.x}px, ${mousePos.y}px, 0)`,
          }}
          data-cursor-halo="true"
        />
      </div>

      {/* SECTION 1: HERO VIEWPORT */}
      <section className="relative z-10 w-full overflow-hidden pb-space-xl pt-space-lg">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-center min-h-[680px] lg:min-h-[778px]">
            {/* Left Analysis Column */}
            <div className="lg:col-span-7 flex flex-col gap-space-md">
              <div className="inline-flex items-center gap-2 self-start px-3 py-1.5 rounded-lg bg-surface-container-high text-on-surface border border-surface-container-highest shadow-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse" />
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-bold">
                  {PORTFOLIO_DATA.copy.Hero.text1}
                </span>
              </div>

              <div className="flex flex-col gap-space-xs">
                <h1 className="font-display-lg text-display-lg text-primary tracking-tight">
                  {PORTFOLIO_DATA.profile.name}
                </h1>
                <p className="font-headline-md text-headline-md text-on-surface-variant font-semibold">
                  {PORTFOLIO_DATA.copy.Hero.text2}
                  <span className="text-secondary">
                    {PORTFOLIO_DATA.copy.Hero.text3}
                  </span>{" "}
                  {PORTFOLIO_DATA.copy.Hero.text4}
                </p>
              </div>

              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl leading-relaxed">
                {PORTFOLIO_DATA.profile.bio}
              </p>

              {/* Core Call to Actions */}
              <div className="flex flex-wrap items-center gap-space-sm pt-space-sm">
                <a
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-on-primary hover:bg-secondary transition-all duration-200 font-label-lg text-label-lg shadow-sm"
                  href={safeURL(PORTFOLIO_DATA.profile.ctaLinks.profile)}
                >
                  <span>{PORTFOLIO_DATA.copy.Hero.text5}</span>
                  <span className="material-symbols-outlined text-[18px]">
                    {PORTFOLIO_DATA.copy.Hero.text6}
                  </span>
                </a>

                <a
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface transition-all duration-200 font-label-lg text-label-lg border border-surface-container-highest"
                  href={safeURL(PORTFOLIO_DATA.profile.ctaLinks.projects)}
                >
                  <span>{PORTFOLIO_DATA.copy.Hero.text7}</span>
                  <span className="material-symbols-outlined text-[18px]">
                    {PORTFOLIO_DATA.copy.Hero.text8}
                  </span>
                </a>

                <button
                  onClick={onOpenResumeModal}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-surface-container-lowest hover:bg-surface-container-low text-primary border border-surface-container-highest transition-all duration-200 font-label-lg text-label-lg shadow-xs"
                >
                  <span className="material-symbols-outlined text-[18px] text-secondary">
                    {PORTFOLIO_DATA.copy.Hero.text9}
                  </span>
                  <span>{PORTFOLIO_DATA.copy.Hero.text10}</span>
                </button>

                <a
                  className="inline-flex items-center gap-1.5 px-4 py-3 rounded-xl text-secondary hover:text-primary transition-colors font-label-lg text-label-lg"
                  href={safeURL(PORTFOLIO_DATA.profile.ctaLinks.linkedIn)}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {PORTFOLIO_DATA.copy.Hero.text11}
                  </span>
                  <span>{PORTFOLIO_DATA.copy.Hero.text12}</span>
                </a>
              </div>

              {/* Quantitative Institutional Anchors */}
              <div className="grid grid-cols-3 gap-space-md pt-space-md mt-space-sm border-t border-surface-container-high/60">
                <div className="flex flex-col group cursor-default">
                  <span className="font-stat-metric text-stat-metric text-primary group-hover:text-secondary transition-colors">
                    {PORTFOLIO_DATA.copy.Hero.text13}
                  </span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                    {PORTFOLIO_DATA.copy.Hero.text14}
                  </span>
                  <span className="text-[11px] text-secondary font-medium mt-0.5">
                    {PORTFOLIO_DATA.copy.Hero.text15}
                  </span>
                </div>

                <div className="flex flex-col group cursor-default">
                  <span className="font-stat-metric text-stat-metric text-secondary group-hover:scale-105 transition-transform origin-left">
                    {PORTFOLIO_DATA.copy.Hero.text16}
                  </span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                    {PORTFOLIO_DATA.copy.Hero.text17}
                  </span>
                  <span className="text-[11px] text-on-surface-variant font-medium mt-0.5">
                    {PORTFOLIO_DATA.copy.Hero.text18}
                  </span>
                </div>

                <div className="flex flex-col group cursor-default">
                  <span className="font-stat-metric text-stat-metric text-on-tertiary-container group-hover:scale-105 transition-transform origin-left">
                    {PORTFOLIO_DATA.copy.Hero.text19}
                  </span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                    {PORTFOLIO_DATA.copy.Hero.text20}
                  </span>
                  <span className="text-[11px] text-on-tertiary-container font-medium mt-0.5">
                    {PORTFOLIO_DATA.copy.Hero.text21}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Abstract Interconnected Strategic Node System */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              <div className="relative w-full aspect-square max-w-[480px] rounded-full bg-surface-container-low p-space-md shadow-md flex items-center justify-center overflow-hidden border border-surface-container-high">
                {/* Dynamic Animated Analytical Gridlines */}
                <svg
                  className="absolute inset-0 w-full h-full"
                  fill="none"
                  viewBox="0 0 500 500"
                >
                  <circle
                    className="text-surface-variant"
                    cx="250"
                    cy="250"
                    r="210"
                    stroke="currentColor"
                    strokeDasharray="4 4"
                    strokeWidth="1.2"
                  />
                  <circle
                    className="text-surface-container-high"
                    cx="250"
                    cy="250"
                    r="140"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <circle
                    className="text-surface-container"
                    cx="250"
                    cy="250"
                    r="70"
                    stroke="currentColor"
                    strokeWidth="1"
                  />
                  <line
                    className="text-surface-container-highest"
                    stroke="currentColor"
                    strokeWidth="1"
                    x1="250"
                    x2="250"
                    y1="40"
                    y2="460"
                  />
                  <line
                    className="text-surface-container-highest"
                    stroke="currentColor"
                    strokeWidth="1"
                    x1="40"
                    x2="460"
                    y1="250"
                    y2="250"
                  />
                  <line
                    className="text-surface-container-high"
                    stroke="currentColor"
                    strokeDasharray="6 6"
                    x1="100"
                    x2="400"
                    y1="100"
                    y2="400"
                  />
                  <line
                    className="text-surface-container-high"
                    stroke="currentColor"
                    strokeDasharray="6 6"
                    x1="100"
                    x2="400"
                    y1="400"
                    y2="100"
                  />
                  <path
                    className="text-secondary/40"
                    d="M 250,70 L 400,200 L 360,380 L 140,380 L 100,200 Z"
                    fill="currentColor"
                    fillOpacity="0.03"
                    stroke="currentColor"
                    strokeDasharray="8 4"
                    strokeWidth="1.5"
                  />
                  <circle
                    className="text-secondary fill-current animate-ping"
                    cx="250"
                    cy="70"
                    r="4"
                  />
                  <circle
                    className="text-on-tertiary-container fill-current animate-ping"
                    cx="360"
                    cy="380"
                    r="4"
                  />
                </svg>

                {/* Center Core Strategic Hub */}
                <div
                  onClick={() => setActiveNode(null)}
                  className="z-20 flex flex-col items-center justify-center w-28 h-28 rounded-full bg-primary text-on-primary shadow-xl text-center p-2 transform hover:scale-105 transition-all duration-300 cursor-pointer select-none ring-4 ring-secondary/20"
                >
                  <span className="material-symbols-outlined text-[24px] text-secondary-fixed">
                    {PORTFOLIO_DATA.copy.Hero.text22}
                  </span>
                  <span className="font-headline-sm text-[13px] leading-tight font-bold tracking-wider mt-1">
                    {PORTFOLIO_DATA.copy.Hero.text23}
                  </span>
                  <span className="font-label-sm text-[9px] text-surface-variant uppercase">
                    {PORTFOLIO_DATA.copy.Hero.text24}
                  </span>
                </div>

                {/* Orbiting Strategic Functional Nodes */}
                {nodes.map((node) => {
                  const isSelected = activeNode === node.id;
                  return (
                    <div
                      key={node.id}
                      className={`absolute ${node.position} z-20 group cursor-pointer transition-transform duration-200 hover:scale-110`}
                      onMouseEnter={() => setActiveNode(node.id)}
                      onClick={() =>
                        setActiveNode(activeNode === node.id ? null : node.id)
                      }
                    >
                      <div
                        className={`px-3 py-1.5 rounded-lg text-on-surface shadow-md transition-all duration-200 flex items-center gap-1.5 border border-surface-container-high ${
                          isSelected
                            ? "bg-primary text-on-primary scale-110 ring-2 ring-secondary"
                            : "bg-surface-container-lowest hover:bg-primary hover:text-on-primary"
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${node.color}`}
                        />
                        <span className="font-label-sm text-label-sm uppercase font-semibold">
                          {node.label}
                        </span>
                      </div>
                    </div>
                  );
                })}

                {/* Active Node Flyout Card */}
                {activeNode && (
                  <div className="absolute bottom-3 left-4 right-4 z-30 bg-surface-container-lowest/95 backdrop-blur-md p-3 rounded-xl border border-secondary/30 shadow-lg text-center animate-in fade-in zoom-in-95 duration-150">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-label-sm text-[11px] font-bold text-secondary uppercase tracking-wider">
                        {nodes.find((n) => n.id === activeNode)?.label}{" "}
                        {PORTFOLIO_DATA.copy.Hero.text25}
                      </span>
                      <button
                        onClick={() => setActiveNode(null)}
                        className="text-on-surface-variant hover:text-primary text-xs"
                      >
                        {PORTFOLIO_DATA.copy.Hero.text26}
                      </button>
                    </div>
                    <p className="font-body-sm text-[12px] text-on-surface-variant">
                      {nodes.find((n) => n.id === activeNode)?.detail}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Minimal Scroll Anchor Indicator */}
          <div className="flex flex-col items-center justify-center pt-space-lg">
            <a
              className="group flex flex-col items-center gap-1 text-on-surface-variant hover:text-secondary transition-colors"
              href={safeURL(PORTFOLIO_DATA.profile.ctaLinks.profile)}
            >
              <span className="font-label-sm text-label-sm uppercase tracking-widest text-[10px]">
                {PORTFOLIO_DATA.copy.Hero.text27}
              </span>
              <span className="material-symbols-outlined text-[20px] animate-bounce">
                {PORTFOLIO_DATA.copy.Hero.text28}
              </span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
