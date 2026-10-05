import { usePortfolioData } from "../cms/context";
import React, { useState, useMemo } from "react";
import { PORTFOLIO_DATA, Capability } from "../data/portfolioData";

export const BusinessCapabilities: React.FC = () => {
  const PORTFOLIO_DATA = usePortfolioData();

  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCapability, setSelectedCapability] =
    useState<Capability | null>(null);

  const categories = [
    { id: "all", label: "All Disciplines" },
    { id: "marketing", label: "Marketing & Growth" },
    { id: "analytics", label: "Analytics & Data" },
    { id: "operations", label: "Operations & SCM" },
    { id: "tools", label: "Enterprise Tools" },
  ];

  const filteredCapabilities = useMemo(() => {
    return PORTFOLIO_DATA.capabilities.filter((cap) => {
      const matchesCategory =
        activeCategory === "all" ? true : cap.category === activeCategory;
      const matchesSearch =
        searchQuery.trim() === ""
          ? true
          : cap.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            cap.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            cap.tags.some((t) =>
              t.toLowerCase().includes(searchQuery.toLowerCase()),
            );
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <section className="w-full py-space-xl bg-surface-container-low">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md mb-space-lg">
          <div className="flex flex-col gap-space-xs">
            <div className="flex items-center gap-2">
              <span className="w-6 h-[2px] bg-secondary" />
              <span className="font-label-md text-label-md text-secondary uppercase tracking-widest font-semibold">
                {PORTFOLIO_DATA.copy.BusinessCapabilities.text1}
              </span>
            </div>
            <h2 className="font-headline-xl text-headline-xl text-primary font-bold">
              {PORTFOLIO_DATA.copy.BusinessCapabilities.text2}
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
              {PORTFOLIO_DATA.copy.BusinessCapabilities.text3}
            </p>
          </div>

          <div className="relative min-w-[240px] max-w-xs w-full">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">
              {PORTFOLIO_DATA.copy.BusinessCapabilities.text4}
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search competencies (e.g. Power BI, DAX)..."
              className="w-full pl-9 pr-3 py-2 bg-surface-container-lowest text-xs rounded-xl border border-surface-container-highest focus:outline-none focus:ring-2 focus:ring-secondary text-primary placeholder:text-on-surface-variant/70 shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-on-surface-variant hover:text-primary"
              >
                {PORTFOLIO_DATA.copy.BusinessCapabilities.text5}
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-space-lg pb-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer ${
                activeCategory === cat.id
                  ? "bg-primary text-on-primary shadow-xs"
                  : "bg-surface-container-lowest text-on-surface-variant hover:text-primary hover:bg-surface-container"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
          {filteredCapabilities.map((cap) => {
            const isWide =
              cap.id === "process-architecture" && activeCategory === "all";
            return (
              <div
                key={cap.id}
                onClick={() => setSelectedCapability(cap)}
                className={`p-6 rounded-xl bg-surface-container-lowest shadow-sm hover:shadow-md hover:bg-surface-container-high/40 transition-all duration-200 flex flex-col justify-between group cursor-pointer border border-surface-container-high ${
                  isWide ? "sm:col-span-2 lg:col-span-2" : ""
                }`}
              >
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center group-hover:bg-secondary group-hover:text-on-secondary transition-colors">
                      <span className="material-symbols-outlined text-[22px]">
                        {cap.icon}
                      </span>
                    </div>
                    <span className="material-symbols-outlined text-surface-variant group-hover:text-secondary transition-colors text-[18px]">
                      {PORTFOLIO_DATA.copy.BusinessCapabilities.text6}
                    </span>
                  </div>

                  <span className="font-headline-sm text-headline-sm text-primary font-bold">
                    {cap.title}
                  </span>

                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    {cap.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-surface-container flex items-center justify-between">
                  <span className="text-secondary font-label-sm text-label-sm uppercase tracking-wider font-semibold">
                    {cap.tags.join(" • ")}
                  </span>
                  <span className="text-[11px] font-bold text-on-surface-variant group-hover:text-secondary flex items-center gap-0.5">
                    {PORTFOLIO_DATA.copy.BusinessCapabilities.text7}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {selectedCapability && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-150">
            <div className="bg-surface-container-lowest w-full max-w-lg rounded-2xl p-6 sm:p-8 shadow-2xl border border-surface-container-high relative">
              <button
                onClick={() => setSelectedCapability(null)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close capability dialog"
              >
                {PORTFOLIO_DATA.copy.BusinessCapabilities.text8}
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[28px]">
                    {selectedCapability.icon}
                  </span>
                </div>
                <div>
                  <span className="font-label-sm text-[11px] text-secondary uppercase tracking-widest font-bold">
                    {PORTFOLIO_DATA.copy.BusinessCapabilities.text9}
                  </span>
                  <h3 className="font-headline-md text-headline-md text-primary font-bold">
                    {selectedCapability.title}
                  </h3>
                </div>
              </div>

              <div className="flex flex-col gap-4 text-sm text-on-surface">
                <div>
                  <span className="font-bold text-xs text-on-surface-variant uppercase tracking-wider block mb-1">
                    {PORTFOLIO_DATA.copy.BusinessCapabilities.text10}
                  </span>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    {selectedCapability.description}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-surface-container-low border border-surface-container-highest">
                  <span className="font-bold text-xs text-secondary uppercase tracking-wider block mb-1">
                    {PORTFOLIO_DATA.copy.BusinessCapabilities.text11}
                  </span>
                  <p className="font-body-sm text-body-sm text-on-surface leading-relaxed">
                    {selectedCapability.details}
                  </p>
                </div>

                <div>
                  <span className="font-bold text-xs text-on-surface-variant uppercase tracking-wider block mb-1.5">
                    {PORTFOLIO_DATA.copy.BusinessCapabilities.text12}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {selectedCapability.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-surface-container-high text-primary rounded-lg text-xs font-semibold"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-surface-container flex justify-end">
                <button
                  onClick={() => setSelectedCapability(null)}
                  className="px-5 py-2 bg-primary text-white hover:bg-secondary rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                >
                  {PORTFOLIO_DATA.copy.BusinessCapabilities.text13}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
