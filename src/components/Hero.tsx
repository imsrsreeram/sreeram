import { safeURL, HERO_DEFAULTS } from "../cms/model";
import { useMedia, useMediaQuery } from "../cms/media";
import React, { useState, useEffect, useRef } from "react";
import { usePortfolioData } from "../cms/context";

interface HeroProps {
  onOpenResumeModal: () => void;
  onOpenContactModal: () => void;
  /** Hero picture path (content.profileImage). */
  heroImage?: string;
  /** Hero picture / banner settings (content.hero). */
  hero?: Partial<typeof HERO_DEFAULTS>;
}

const SHAPE: Record<string, string> = {
  circle: "rounded-full",
  rounded: "rounded-[2rem]",
  square: "rounded-xl",
};

export const Hero: React.FC<HeroProps> = ({
  onOpenResumeModal,
  onOpenContactModal,
  heroImage = "",
  hero,
}) => {
  const PORTFOLIO_DATA = usePortfolioData();
  const opts = { ...HERO_DEFAULTS, ...(hero || {}) };
  const isPhone = useMediaQuery("(max-width: 767px)");
  const overlay = Math.min(90, Math.max(0, Number(opts.bannerOverlay) || 0));
  const overlayLeft = Math.min(92, overlay + 15);
  const showNodeChips = opts.showNodes !== false;
  // Picture and banner each try the deployed copy first, then the GitHub copy,
  // so a just-published upload shows up before the site rebuild finishes.
  const photoM = useMedia(heroImage);
  const bannerPath =
    isPhone && opts.bannerMobile ? opts.bannerMobile : opts.banner || opts.bannerMobile;
  const bannerM = useMedia(bannerPath);
  const photo = photoM.src;
  const hasPhoto = !photoM.failed;
  const poster = hasPhoto && opts.layout === "poster";
  const cutout = opts.imageShape === "cutout";
  const hasBanner = !bannerM.failed;

  const [activeNode, setActiveNode] = useState<string | null>(null);
  // The cursor halo follows the pointer without re-rendering React (smooth),
  // and is skipped on touch devices where it would only cost battery.
  const haloRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches)
      return;
    let raf = 0;
    let x = 0;
    let y = 0;
    const apply = () => {
      raf = 0;
      if (haloRef.current)
        haloRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };
    const onMove = (e: MouseEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (!raf) raf = requestAnimationFrame(apply);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const nodes = PORTFOLIO_DATA.componentDetails.Hero.nodes;

  const chipsBlock = (
    <div className="flex w-full max-w-[480px] flex-col items-center gap-space-sm">
      <div className="flex flex-wrap justify-center gap-2">
        {nodes.map((node) => {
          const isSelected = activeNode === node.id;
          return (
            <button
              key={node.id}
              type="button"
              aria-pressed={isSelected}
              onClick={() => setActiveNode(isSelected ? null : node.id)}
              className={`px-3 py-2 min-h-9 rounded-lg shadow-sm transition-all duration-200 flex items-center gap-1.5 border border-surface-container-high ${
                isSelected
                  ? "bg-primary text-on-primary ring-2 ring-secondary"
                  : "bg-surface-container-lowest text-on-surface hover:bg-primary hover:text-on-primary"
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${node.color}`} />
              <span className="font-label-sm text-label-sm uppercase font-semibold">
                {node.label}
              </span>
            </button>
          );
        })}
      </div>
      {activeNode && (
        <div className="w-full rounded-xl border border-secondary/30 bg-surface-container-lowest/95 p-3 text-center shadow-md backdrop-blur-md">
          <span className="font-label-sm text-[11px] font-bold text-secondary uppercase tracking-wider">
            {nodes.find((n) => n.id === activeNode)?.label}{" "}
            {PORTFOLIO_DATA.copy.Hero.text25}
          </span>
          <p className="font-body-sm text-[12px] text-on-surface-variant">
            {nodes.find((n) => n.id === activeNode)?.detail}
          </p>
        </div>
      )}
    </div>
  );

  return (
    <div className="relative w-full">
      {/* Interactive Pointer Tracking Canvas Layer */}
      <div
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden opacity-45 transition-opacity"
        data-ambient="true"
      >
        <div
          ref={haloRef}
          className="absolute left-0 top-0 hidden [@media(hover:hover)_and_(pointer:fine)]:block w-[500px] h-[500px] -ml-[250px] -mt-[250px] rounded-full will-change-transform"
          style={{
            transform: "translate3d(-999px,-999px,0)",
            background:
              "radial-gradient(circle, color-mix(in srgb, var(--color-secondary) 16%, transparent) 0%, transparent 68%)",
          }}
          data-cursor-halo="true"
        />
      </div>

      {/* SECTION 1: HERO VIEWPORT */}
      <section
        className={`relative z-10 w-full overflow-hidden pt-space-lg ${poster ? "pb-0" : "pb-space-xl"}`}
        data-hero-banner={hasBanner ? "true" : undefined}
      >
        {hasBanner && (
          <div
            aria-hidden={opts.bannerAlt ? undefined : true}
            className="pointer-events-none absolute inset-0 -z-10"
            data-testid="hero-banner"
          >
            <img
              src={bannerM.src}
              alt={opts.bannerAlt || ""}
              className="h-full w-full object-cover"
              style={{ objectPosition: opts.bannerFocus }}
              decoding="async"
              fetchPriority="high"
              onError={bannerM.onError}
            />
            {/* Theme-coloured wash keeps the text readable on any photo, light or dark theme */}
            <div
              className={`absolute inset-0 ${poster ? "lg:hidden" : ""}`}
              style={{
                background: `color-mix(in srgb, var(--color-surface) ${overlay}%, transparent)`,
              }}
            />
            {poster && (
              <div
                className="absolute inset-0 hidden lg:block"
                style={{
                  background: `linear-gradient(90deg, color-mix(in srgb, var(--color-surface) ${overlayLeft}%, transparent) 0%, color-mix(in srgb, var(--color-surface) ${overlayLeft}%, transparent) 40%, color-mix(in srgb, var(--color-surface) ${Math.max(overlay - 45, 8)}%, transparent) 100%)`,
                }}
              />
            )}
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[var(--color-surface)] to-transparent" />
          </div>
        )}
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`grid grid-cols-1 lg:grid-cols-12 gap-space-lg lg:gap-space-xl items-center ${
              poster
                ? "lg:min-h-[700px]"
                : hasPhoto
                  ? "lg:min-h-[778px]"
                  : "min-h-[680px] lg:min-h-[778px]"
            }`}
          >
            {/* Left Analysis Column */}
            <div className="lg:col-span-7 flex flex-col gap-space-md min-w-0">
              <div className="inline-flex items-center gap-2 self-start px-3 py-1.5 rounded-lg bg-surface-container-high text-on-surface border border-surface-container-highest shadow-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse" />
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-bold">
                  {PORTFOLIO_DATA.copy.Hero.text1}
                </span>
              </div>

              <div className="flex flex-col gap-space-xs">
                <h1
                  className={
                    poster
                      ? "font-display-lg text-primary tracking-tight break-words uppercase font-extrabold leading-[0.95] text-[clamp(2.6rem,9vw,6rem)]"
                      : "font-display-lg text-display-lg text-primary tracking-tight break-words"
                  }
                >
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

              {poster && showNodeChips && (
                <div className="max-w-2xl [&>div>div:first-child]:justify-start">
                  {chipsBlock}
                </div>
              )}

              {/* Core Call to Actions */}
              <div className="flex flex-wrap items-center gap-space-sm pt-space-sm [&>a]:min-h-11 [&>button]:min-h-11">
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
              <div className="grid grid-cols-3 gap-space-sm sm:gap-space-md pt-space-md mt-space-sm border-t border-surface-container-high/60">
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
            <div
              className={`lg:col-span-5 relative flex items-center justify-center min-w-0 ${
                poster
                  ? "order-last self-end justify-center lg:justify-end"
                  : hasPhoto
                    ? "order-first lg:order-last"
                    : ""
              }`}
            >
              {hasPhoto && poster && (
                <figure
                  className="flex w-full justify-center lg:justify-end"
                  data-testid="hero-photo"
                >
                  <img
                    src={photo}
                    alt={opts.imageAlt || PORTFOLIO_DATA.profile.name}
                    className="block h-[340px] sm:h-[460px] lg:h-[640px] w-auto max-w-full object-contain object-bottom drop-shadow-[0_20px_40px_rgba(0,0,0,0.35)]"
                    style={{
                      objectPosition: `${opts.imageFocus === "center" ? "bottom" : opts.imageFocus}`,
                    }}
                    decoding="async"
                    fetchPriority="high"
                    onError={photoM.onError}
                  />
                </figure>
              )}
              {hasPhoto && !poster && (
                <figure
                  className="flex w-full flex-col items-center gap-space-md"
                  data-testid="hero-photo"
                >
                  {cutout ? (
                    <img
                      src={photo}
                      alt={opts.imageAlt || PORTFOLIO_DATA.profile.name}
                      className="block w-full max-w-[280px] sm:max-w-[340px] lg:max-w-[440px] max-h-[460px] lg:max-h-[560px] h-auto object-contain drop-shadow-[0_18px_36px_rgba(0,0,0,0.3)]"
                      decoding="async"
                      fetchPriority="high"
                      onError={photoM.onError}
                    />
                  ) : (
                    <div
                      className={`relative w-full max-w-[240px] sm:max-w-[300px] md:max-w-[340px] lg:max-w-[420px] aspect-square overflow-hidden border-4 border-surface-container-lowest bg-surface-container-low shadow-xl ring-1 ring-surface-container-highest ${
                        SHAPE[opts.imageShape] || SHAPE.circle
                      }`}
                    >
                      <img
                        src={photo}
                        alt={opts.imageAlt || PORTFOLIO_DATA.profile.name}
                        className="h-full w-full object-cover"
                        style={{ objectPosition: opts.imageFocus }}
                        decoding="async"
                        fetchPriority="high"
                        onError={photoM.onError}
                      />
                    </div>
                  )}
                  {showNodeChips && chipsBlock}
                </figure>
              )}
              {!hasPhoto && (
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
              )}
            </div>
          </div>

          {/* Minimal Scroll Anchor Indicator */}
          <div
            className={`flex-col items-center justify-center pt-space-lg ${poster ? "hidden" : "flex"}`}
          >
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
