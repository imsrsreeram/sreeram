import { usePortfolioData } from "../cms/context";
import React, { useState } from "react";
import { PORTFOLIO_DATA, ProjectItem } from "../data/portfolioData";

export const SelectedProjects: React.FC = () => {
  const PORTFOLIO_DATA = usePortfolioData();

  const [activeProjectTab, setActiveProjectTab] = useState<
    Record<string, "methodology" | "findings" | "recommendations">
  >({
    "royal-enfield": "methodology",
    mylamparai: "methodology",
  });

  const [openedCaseModal, setOpenedCaseModal] = useState<ProjectItem | null>(
    null,
  );

  const reProject = PORTFOLIO_DATA.projects.find(
    (p) => p.id === "royal-enfield",
  )!;
  const mylamparaiProject = PORTFOLIO_DATA.projects.find(
    (p) => p.id === "mylamparai",
  )!;

  const handleTabChange = (
    projId: string,
    tab: "methodology" | "findings" | "recommendations",
  ) => {
    setActiveProjectTab((prev) => ({ ...prev, [projId]: tab }));
  };

  return (
    <section className="w-full py-space-xl">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-space-xs mb-space-xl">
          <div className="flex items-center gap-2">
            <span className="w-6 h-[2px] bg-secondary" />
            <span className="font-label-md text-label-md text-secondary uppercase tracking-widest font-semibold">
              {PORTFOLIO_DATA.copy.SelectedProjects.text1}
            </span>
          </div>
          <h2 className="font-headline-xl text-headline-xl text-primary font-bold">
            {PORTFOLIO_DATA.copy.SelectedProjects.text2}
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
            {PORTFOLIO_DATA.copy.SelectedProjects.text3}
          </p>
        </div>

        <div className="flex flex-col gap-space-xl">
          {/* Case 01: Royal Enfield Customer Satisfaction Study */}
          <div className="p-8 sm:p-10 rounded-xl bg-surface-container-lowest shadow-md flex flex-col gap-space-lg border border-surface-container-high hover:border-secondary/30 transition-all">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md border-b border-surface-container-high pb-6">
              <div className="flex flex-col gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded bg-secondary/10 text-secondary font-label-sm text-label-sm uppercase font-semibold">
                    {reProject.category}
                  </span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
                    {reProject.type}
                  </span>
                </div>
                <h3 className="font-headline-lg text-headline-lg text-primary font-bold">
                  {reProject.title}
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant max-w-3xl">
                  {reProject.summary}
                </p>
              </div>

              <div className="flex items-center gap-space-md shrink-0">
                <div className="flex flex-col text-left lg:text-right bg-surface-container-low px-4 py-2.5 rounded-xl border border-surface-container-highest">
                  <span className="font-stat-metric text-[34px] text-secondary font-black">
                    {reProject.keyMetric.value}
                  </span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase font-semibold">
                    {reProject.keyMetric.label}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 border-b border-surface-container pb-2">
              <button
                onClick={() => handleTabChange("royal-enfield", "methodology")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeProjectTab["royal-enfield"] === "methodology"
                    ? "bg-primary text-on-primary"
                    : "text-on-surface-variant hover:bg-surface-container"
                }`}
              >
                {PORTFOLIO_DATA.copy.SelectedProjects.text4}
              </button>
              <button
                onClick={() => handleTabChange("royal-enfield", "findings")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeProjectTab["royal-enfield"] === "findings"
                    ? "bg-primary text-on-primary"
                    : "text-on-surface-variant hover:bg-surface-container"
                }`}
              >
                {PORTFOLIO_DATA.copy.SelectedProjects.text5}
              </button>
              <button
                onClick={() =>
                  handleTabChange("royal-enfield", "recommendations")
                }
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeProjectTab["royal-enfield"] === "recommendations"
                    ? "bg-primary text-on-primary"
                    : "text-on-surface-variant hover:bg-surface-container"
                }`}
              >
                {PORTFOLIO_DATA.copy.SelectedProjects.text6}
              </button>
            </div>

            {activeProjectTab["royal-enfield"] === "methodology" && (
              <div className="flex flex-col gap-3 animate-in fade-in duration-150">
                <span className="font-label-md text-label-md text-primary uppercase tracking-wider font-semibold">
                  {PORTFOLIO_DATA.copy.SelectedProjects.text7}
                </span>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-space-sm">
                  {reProject.steps.map((st) => (
                    <div
                      key={st.step}
                      className="p-3.5 rounded-lg bg-surface-container-low flex flex-col gap-1 border border-surface-container-highest hover:bg-surface-container-high transition-colors"
                    >
                      <span className="font-label-sm text-label-sm text-secondary font-bold">
                        {st.step}
                      </span>
                      <span className="font-headline-sm text-[14px] text-primary font-semibold">
                        {st.title}
                      </span>
                      <span className="font-body-sm text-[12px] text-on-surface-variant">
                        {st.desc}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeProjectTab["royal-enfield"] === "findings" && (
              <div className="flex flex-col gap-3 animate-in fade-in duration-150">
                <span className="font-label-md text-label-md text-primary uppercase tracking-wider font-semibold">
                  {PORTFOLIO_DATA.copy.SelectedProjects.text8}
                </span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {reProject.detailedFindings.map((finding, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-surface-container-low border border-surface-container-highest flex flex-col gap-2"
                    >
                      <span className="w-6 h-6 rounded-full bg-secondary/15 text-secondary flex items-center justify-center text-xs font-bold">
                        {idx + 1}
                      </span>
                      <p className="text-xs text-on-surface leading-relaxed">
                        {finding}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeProjectTab["royal-enfield"] === "recommendations" && (
              <div className="flex flex-col gap-3 animate-in fade-in duration-150">
                <span className="font-label-md text-label-md text-primary uppercase tracking-wider font-semibold">
                  {PORTFOLIO_DATA.copy.SelectedProjects.text9}
                </span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {reProject.recommendations.map((rec, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-secondary/5 border border-secondary/20 flex flex-col gap-2"
                    >
                      <span className="font-label-sm text-[11px] font-bold text-secondary uppercase">
                        {PORTFOLIO_DATA.copy.SelectedProjects.text10}
                        {idx + 1}
                      </span>
                      <p className="text-xs text-primary leading-relaxed">
                        {rec}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md pt-space-xs">
              <div className="p-4 rounded-lg bg-surface flex flex-col gap-2 border border-surface-container">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase font-semibold">
                  {PORTFOLIO_DATA.copy.SelectedProjects.text11}
                </span>
                <div className="w-full bg-surface-container-high h-2.5 rounded-full overflow-hidden flex">
                  <div
                    className="bg-secondary h-full"
                    style={{ width: "68%" }}
                    title="68% High Delight"
                  />
                  <div
                    className="bg-on-tertiary-container h-full"
                    style={{ width: "22%" }}
                    title="22% Satisfied"
                  />
                  <div
                    className="bg-outline h-full"
                    style={{ width: "10%" }}
                    title="10% Friction"
                  />
                </div>
                <div className="flex justify-between font-label-sm text-[11px] text-on-surface-variant font-medium">
                  <span className="text-secondary font-bold">
                    {PORTFOLIO_DATA.copy.SelectedProjects.text12}
                  </span>
                  <span className="text-on-tertiary-container font-bold">
                    {PORTFOLIO_DATA.copy.SelectedProjects.text13}
                  </span>
                  <span className="text-outline font-bold">
                    {PORTFOLIO_DATA.copy.SelectedProjects.text14}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-surface flex flex-col gap-2 border border-surface-container">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase font-semibold">
                  {PORTFOLIO_DATA.copy.SelectedProjects.text15}
                </span>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-[20px]">
                    {PORTFOLIO_DATA.copy.SelectedProjects.text16}
                  </span>
                  <span className="font-headline-sm text-[15px] font-semibold text-primary">
                    {PORTFOLIO_DATA.copy.SelectedProjects.text17}
                  </span>
                </div>
                <span className="font-body-sm text-[12px] text-on-surface-variant">
                  {PORTFOLIO_DATA.copy.SelectedProjects.text18}
                </span>
              </div>

              <div className="p-4 rounded-lg bg-surface flex flex-col gap-2 border border-surface-container">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase font-semibold">
                  {PORTFOLIO_DATA.copy.SelectedProjects.text19}
                </span>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-on-tertiary-container text-[20px]">
                    {PORTFOLIO_DATA.copy.SelectedProjects.text20}
                  </span>
                  <span className="font-headline-sm text-[15px] font-semibold text-primary">
                    {PORTFOLIO_DATA.copy.SelectedProjects.text21}
                  </span>
                </div>
                <span className="font-body-sm text-[12px] text-on-surface-variant">
                  {PORTFOLIO_DATA.copy.SelectedProjects.text22}
                </span>
              </div>
            </div>
          </div>

          {/* Case 02: Rural Development Needs Study — Mylamparai */}
          <div className="p-8 sm:p-10 rounded-xl bg-surface-container-lowest shadow-md flex flex-col gap-space-lg border border-surface-container-high hover:border-secondary/30 transition-all">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md border-b border-surface-container-high pb-6">
              <div className="flex flex-col gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded bg-secondary-fixed/50 text-on-secondary-fixed font-label-sm text-label-sm uppercase font-semibold">
                    {mylamparaiProject.category}
                  </span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
                    {mylamparaiProject.type}
                  </span>
                </div>
                <h3 className="font-headline-lg text-headline-lg text-primary font-bold">
                  {mylamparaiProject.title}
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant max-w-3xl">
                  {mylamparaiProject.summary}
                </p>
              </div>

              <div className="flex items-center gap-space-md shrink-0">
                <div className="flex flex-col text-left lg:text-right bg-surface-container-low px-4 py-2.5 rounded-xl border border-surface-container-highest">
                  <span className="font-stat-metric text-[34px] text-primary font-black">
                    {mylamparaiProject.keyMetric.value}
                  </span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase font-semibold">
                    {mylamparaiProject.keyMetric.label}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-space-sm">
              <div className="p-4 rounded-lg bg-surface flex flex-col gap-2 border border-surface-container hover:bg-surface-container-low transition-colors">
                <span className="material-symbols-outlined text-secondary text-[22px]">
                  {PORTFOLIO_DATA.copy.SelectedProjects.text23}
                </span>
                <span className="font-headline-sm text-[14px] font-bold text-primary">
                  {PORTFOLIO_DATA.copy.SelectedProjects.text24}
                </span>
                <span className="font-body-sm text-[12px] text-on-surface-variant">
                  {PORTFOLIO_DATA.copy.SelectedProjects.text25}
                </span>
              </div>

              <div className="p-4 rounded-lg bg-surface flex flex-col gap-2 border border-surface-container hover:bg-surface-container-low transition-colors">
                <span className="material-symbols-outlined text-secondary text-[22px]">
                  {PORTFOLIO_DATA.copy.SelectedProjects.text26}
                </span>
                <span className="font-headline-sm text-[14px] font-bold text-primary">
                  {PORTFOLIO_DATA.copy.SelectedProjects.text27}
                </span>
                <span className="font-body-sm text-[12px] text-on-surface-variant">
                  {PORTFOLIO_DATA.copy.SelectedProjects.text28}
                </span>
              </div>

              <div className="p-4 rounded-lg bg-surface flex flex-col gap-2 border border-surface-container hover:bg-surface-container-low transition-colors">
                <span className="material-symbols-outlined text-secondary text-[22px]">
                  {PORTFOLIO_DATA.copy.SelectedProjects.text29}
                </span>
                <span className="font-headline-sm text-[14px] font-bold text-primary">
                  {PORTFOLIO_DATA.copy.SelectedProjects.text30}
                </span>
                <span className="font-body-sm text-[12px] text-on-surface-variant">
                  {PORTFOLIO_DATA.copy.SelectedProjects.text31}
                </span>
              </div>

              <div className="p-4 rounded-lg bg-surface flex flex-col gap-2 border border-surface-container hover:bg-surface-container-low transition-colors">
                <span className="material-symbols-outlined text-secondary text-[22px]">
                  {PORTFOLIO_DATA.copy.SelectedProjects.text32}
                </span>
                <span className="font-headline-sm text-[14px] font-bold text-primary">
                  {PORTFOLIO_DATA.copy.SelectedProjects.text33}
                </span>
                <span className="font-body-sm text-[12px] text-on-surface-variant">
                  {PORTFOLIO_DATA.copy.SelectedProjects.text34}
                </span>
              </div>

              <div className="p-4 rounded-lg bg-surface flex flex-col gap-2 border border-surface-container hover:bg-surface-container-low transition-colors">
                <span className="material-symbols-outlined text-secondary text-[22px]">
                  {PORTFOLIO_DATA.copy.SelectedProjects.text35}
                </span>
                <span className="font-headline-sm text-[14px] font-bold text-primary">
                  {PORTFOLIO_DATA.copy.SelectedProjects.text36}
                </span>
                <span className="font-body-sm text-[12px] text-on-surface-variant">
                  {PORTFOLIO_DATA.copy.SelectedProjects.text37}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-surface-container">
              <span className="text-xs text-on-surface-variant">
                {PORTFOLIO_DATA.copy.SelectedProjects.text38}
              </span>
              <button
                onClick={() => setOpenedCaseModal(mylamparaiProject)}
                className="text-xs font-semibold text-secondary hover:text-primary transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>{PORTFOLIO_DATA.copy.SelectedProjects.text39}</span>
                <span className="material-symbols-outlined text-[16px]">
                  {PORTFOLIO_DATA.copy.SelectedProjects.text40}
                </span>
              </button>
            </div>
          </div>
        </div>

        {openedCaseModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-150">
            <div className="bg-surface-container-lowest w-full max-w-2xl rounded-2xl p-6 sm:p-8 shadow-2xl border border-surface-container-high relative max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setOpenedCaseModal(null)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface flex items-center justify-center transition-colors cursor-pointer"
              >
                {PORTFOLIO_DATA.copy.SelectedProjects.text41}
              </button>

              <div className="flex flex-col gap-2 mb-4">
                <span className="font-label-sm text-xs text-secondary font-bold uppercase tracking-wider">
                  {PORTFOLIO_DATA.copy.SelectedProjects.text42}
                </span>
                <h3 className="font-headline-lg text-headline-lg text-primary font-bold">
                  {openedCaseModal.title}
                </h3>
                <p className="text-xs text-on-surface-variant">
                  {openedCaseModal.summary}
                </p>
              </div>

              <div className="flex flex-col gap-4 text-xs">
                <div className="p-4 rounded-xl bg-surface-container-low border border-surface-container-highest">
                  <span className="font-bold text-xs text-secondary uppercase tracking-wider block mb-2">
                    {PORTFOLIO_DATA.copy.SelectedProjects.text43}
                  </span>
                  <div className="space-y-2">
                    {openedCaseModal.steps.map((st) => (
                      <div key={st.step} className="flex gap-2">
                        <span className="font-bold text-secondary shrink-0">
                          {st.step}
                          {PORTFOLIO_DATA.copy.SelectedProjects.text44}
                        </span>
                        <span>
                          <strong>{st.title}</strong>{" "}
                          {PORTFOLIO_DATA.copy.SelectedProjects.text45}
                          {st.desc}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-surface-container-low border border-surface-container-highest">
                  <span className="font-bold text-xs text-primary uppercase tracking-wider block mb-2">
                    {PORTFOLIO_DATA.copy.SelectedProjects.text46}
                  </span>
                  <ul className="space-y-1.5">
                    {openedCaseModal.recommendations.map((rec, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-secondary font-bold">
                          {PORTFOLIO_DATA.copy.SelectedProjects.text47}
                        </span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-surface-container flex justify-end">
                <button
                  onClick={() => setOpenedCaseModal(null)}
                  className="px-5 py-2 bg-primary text-white rounded-xl text-xs font-semibold cursor-pointer"
                >
                  {PORTFOLIO_DATA.copy.SelectedProjects.text48}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
