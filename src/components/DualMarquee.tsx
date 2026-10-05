import React from "react";
import { usePortfolioData } from "../cms/context";

export const DualMarquee: React.FC = () => {
  const PORTFOLIO_DATA = usePortfolioData();

  const { track1, track2 } = PORTFOLIO_DATA.marqueeTracks;

  return (
    <section className="w-full py-space-lg bg-surface-container-lowest overflow-hidden shadow-sm border-b border-surface-container">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 mb-space-sm">
        <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest font-semibold block">
          {PORTFOLIO_DATA.copy.DualMarquee.text1}
        </span>
        <h2 className="font-headline-sm text-headline-sm text-primary font-bold">
          {PORTFOLIO_DATA.copy.DualMarquee.text2}
        </h2>
      </div>

      <div className="w-full overflow-hidden flex whitespace-nowrap py-3 border-y border-surface-container group">
        <div className="flex items-center gap-space-md animate-marquee shrink-0 font-headline-sm text-[15px] font-bold text-primary">
          {track1.map((item, idx) => (
            <React.Fragment key={`t1-a-${idx}`}>
              <span className="hover:text-secondary transition-colors cursor-default">
                {item}
              </span>
              <span className="text-secondary">
                {PORTFOLIO_DATA.copy.DualMarquee.text3}
              </span>
            </React.Fragment>
          ))}
        </div>
        <div
          aria-hidden="true"
          className="flex items-center gap-space-md animate-marquee shrink-0 font-headline-sm text-[15px] font-bold text-primary"
        >
          {track1.map((item, idx) => (
            <React.Fragment key={`t1-b-${idx}`}>
              <span className="hover:text-secondary transition-colors cursor-default">
                {item}
              </span>
              <span className="text-secondary">
                {PORTFOLIO_DATA.copy.DualMarquee.text4}
              </span>
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="w-full overflow-hidden flex whitespace-nowrap py-3 mt-2 bg-surface-container-low group">
        <div className="flex items-center gap-space-md animate-marquee-reverse shrink-0 font-label-md text-[13px] font-semibold text-on-surface-variant">
          {track2.map((item, idx) => (
            <React.Fragment key={`t2-a-${idx}`}>
              <span className="hover:text-primary transition-colors cursor-default">
                {item}
              </span>
              <span className="text-on-tertiary-container">
                {PORTFOLIO_DATA.copy.DualMarquee.text5}
              </span>
            </React.Fragment>
          ))}
        </div>
        <div
          aria-hidden="true"
          className="flex items-center gap-space-md animate-marquee-reverse shrink-0 font-label-md text-[13px] font-semibold text-on-surface-variant"
        >
          {track2.map((item, idx) => (
            <React.Fragment key={`t2-b-${idx}`}>
              <span className="hover:text-primary transition-colors cursor-default">
                {item}
              </span>
              <span className="text-on-tertiary-container">
                {PORTFOLIO_DATA.copy.DualMarquee.text6}
              </span>
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
};
