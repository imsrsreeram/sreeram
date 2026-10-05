import React, { useState } from "react";
import { usePortfolioData } from "../cms/context";

interface ExecutiveContactProps {
  onOpenResumeModal: () => void;
}

export const ExecutiveContact: React.FC<ExecutiveContactProps> = ({
  onOpenResumeModal,
}) => {
  const PORTFOLIO_DATA = usePortfolioData();

  const [formState, setFormState] = useState({
    name: "",
    email: "",
    organization: "",
    inquiryType: "Corporate Placement / Hiring",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formState.name.trim() ||
      !formState.email.trim() ||
      !formState.message.trim()
    ) {
      return;
    }
    window.location.href = `mailto:${PORTFOLIO_DATA.profile.email}?subject=${encodeURIComponent(formState.inquiryType)}&body=${encodeURIComponent(`Name: ${formState.name}\nEmail: ${formState.email}\nOrganization: ${formState.organization}\n\n${formState.message}`)}`;
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(PORTFOLIO_DATA.profile.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleDownloadVCard = () => {
    const vCardData = `BEGIN:VCARD
VERSION:3.0
N:S R;Sreeram;;;
FN:${PORTFOLIO_DATA.profile.name}
TITLE:MBA Candidate • Strategy & Analytics
ORG:Nehru Institute of Engineering and Technology
EMAIL;TYPE=INTERNET:${PORTFOLIO_DATA.profile.email}
ADR;TYPE=WORK:;;Tamil Nadu;India;;;
NOTE:Specializing in Marketing Strategy, Digital Analytics, and Supply Chain Management.
END:VCARD`;

    const blob = new Blob([vCardData], { type: "text/vcard" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "Sreeram_SR_MBA.vcf";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="w-full py-space-xl bg-surface-container-high/30">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-14 rounded-2xl bg-primary text-on-primary shadow-xl relative overflow-hidden">
          <div className="absolute -right-20 -bottom-20 w-96 h-96 rounded-full bg-secondary/20 blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl relative z-10 items-start">
            <div className="lg:col-span-6 flex flex-col gap-space-md">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-secondary/30 text-secondary-fixed self-start font-label-sm text-label-sm uppercase tracking-wider font-semibold border border-secondary/40">
                {PORTFOLIO_DATA.copy.ExecutiveContact.text1}
              </div>

              <h2 className="font-display-lg text-display-lg font-bold text-on-primary tracking-tight">
                {PORTFOLIO_DATA.copy.ExecutiveContact.text2}
              </h2>

              <p className="font-body-lg text-body-lg text-surface-variant max-w-xl leading-relaxed">
                {PORTFOLIO_DATA.copy.ExecutiveContact.text3}
              </p>

              <div className="pt-space-xs flex flex-wrap items-center gap-space-sm">
                <button
                  onClick={handleCopyEmail}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-secondary hover:bg-secondary-container text-on-secondary transition-all font-label-lg text-label-lg shadow-sm text-xs font-semibold cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {copiedEmail ? "check" : "content_copy"}
                  </span>
                  <span>
                    {copiedEmail ? "Email Copied!" : "Copy Direct Email"}
                  </span>
                </button>

                <button
                  onClick={onOpenResumeModal}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-on-primary transition-all font-label-lg text-label-lg border border-white/20 text-xs font-semibold cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {PORTFOLIO_DATA.copy.ExecutiveContact.text4}
                  </span>
                  <span>{PORTFOLIO_DATA.copy.ExecutiveContact.text5}</span>
                </button>

                <button
                  onClick={handleDownloadVCard}
                  className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-secondary-fixed hover:text-white transition-colors text-xs font-semibold cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {PORTFOLIO_DATA.copy.ExecutiveContact.text6}
                  </span>
                  <span>{PORTFOLIO_DATA.copy.ExecutiveContact.text7}</span>
                </button>
              </div>

              <div className="flex flex-col gap-space-sm mt-4">
                <div className="p-4 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 flex items-center gap-4 hover:bg-white/10 transition-colors">
                  <div className="w-11 h-11 rounded-lg bg-secondary/20 text-secondary-fixed flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[22px]">
                      {PORTFOLIO_DATA.copy.ExecutiveContact.text8}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label-sm text-[11px] text-surface-variant uppercase font-mono">
                      {PORTFOLIO_DATA.copy.ExecutiveContact.text9}
                    </span>
                    <a
                      href={`mailto:${PORTFOLIO_DATA.profile.email}`}
                      className="font-headline-sm text-[15px] text-on-primary font-bold hover:text-secondary-fixed transition-colors"
                    >
                      {PORTFOLIO_DATA.profile.email}
                    </a>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 flex items-center gap-4 hover:bg-white/10 transition-colors">
                  <div className="w-11 h-11 rounded-lg bg-tertiary-fixed-dim/20 text-tertiary-fixed-dim flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[22px]">
                      {PORTFOLIO_DATA.copy.ExecutiveContact.text10}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label-sm text-[11px] text-surface-variant uppercase font-mono">
                      {PORTFOLIO_DATA.copy.ExecutiveContact.text11}
                    </span>
                    <span className="font-headline-sm text-[15px] text-on-primary font-bold">
                      {PORTFOLIO_DATA.copy.ExecutiveContact.text12}
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 flex items-center gap-4 hover:bg-white/10 transition-colors">
                  <div className="w-11 h-11 rounded-lg bg-surface-variant/20 text-surface-variant flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[22px]">
                      {PORTFOLIO_DATA.copy.ExecutiveContact.text13}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label-sm text-[11px] text-surface-variant uppercase font-mono">
                      {PORTFOLIO_DATA.copy.ExecutiveContact.text14}
                    </span>
                    <span className="font-headline-sm text-[15px] text-on-primary font-bold">
                      {PORTFOLIO_DATA.profile.location}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 bg-white/5 backdrop-blur-md p-6 sm:p-8 rounded-2xl border border-white/10 shadow-2xl">
              {submitted ? (
                <div className="py-12 flex flex-col items-center text-center gap-3 animate-in fade-in zoom-in-95 duration-200">
                  <div className="w-16 h-16 rounded-full bg-on-tertiary-container/20 text-tertiary-fixed-dim flex items-center justify-center">
                    <span className="material-symbols-outlined text-[36px]">
                      {PORTFOLIO_DATA.copy.ExecutiveContact.text15}
                    </span>
                  </div>
                  <h3 className="font-headline-md text-xl text-white font-bold">
                    {PORTFOLIO_DATA.copy.ExecutiveContact.text16}
                  </h3>
                  <p className="text-xs text-surface-variant max-w-sm">
                    {PORTFOLIO_DATA.copy.ExecutiveContact.text17}
                    <strong className="text-white">{formState.name}</strong>
                    {PORTFOLIO_DATA.copy.ExecutiveContact.text18}
                    <strong className="text-secondary-fixed">
                      {formState.inquiryType}
                    </strong>{" "}
                    {PORTFOLIO_DATA.copy.ExecutiveContact.text19}
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormState({
                        name: "",
                        email: "",
                        organization: "",
                        inquiryType: "Corporate Placement / Hiring",
                        message: "",
                      });
                    }}
                    className="mt-4 px-4 py-2 bg-secondary text-white text-xs font-semibold rounded-xl cursor-pointer"
                  >
                    {PORTFOLIO_DATA.copy.ExecutiveContact.text20}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <span className="font-label-sm text-[11px] text-secondary-fixed uppercase tracking-wider font-semibold">
                      {PORTFOLIO_DATA.copy.ExecutiveContact.text21}
                    </span>
                    <h3 className="font-headline-md text-lg text-white font-bold">
                      {PORTFOLIO_DATA.copy.ExecutiveContact.text22}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-semibold text-surface-variant uppercase tracking-wider">
                        {PORTFOLIO_DATA.copy.ExecutiveContact.text23}
                      </label>
                      <input
                        type="text"
                        required
                        value={formState.name}
                        onChange={(e) =>
                          setFormState({ ...formState, name: e.target.value })
                        }
                        placeholder="e.g. Anand Sharma"
                        className="px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 text-xs focus:outline-none focus:ring-2 focus:ring-secondary"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-semibold text-surface-variant uppercase tracking-wider">
                        {PORTFOLIO_DATA.copy.ExecutiveContact.text24}
                      </label>
                      <input
                        type="email"
                        required
                        value={formState.email}
                        onChange={(e) =>
                          setFormState({ ...formState, email: e.target.value })
                        }
                        placeholder="e.g. anand@company.com"
                        className="px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 text-xs focus:outline-none focus:ring-2 focus:ring-secondary"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-semibold text-surface-variant uppercase tracking-wider">
                        {PORTFOLIO_DATA.copy.ExecutiveContact.text25}
                      </label>
                      <input
                        type="text"
                        value={formState.organization}
                        onChange={(e) =>
                          setFormState({
                            ...formState,
                            organization: e.target.value,
                          })
                        }
                        placeholder="e.g. BCG / Flipkart / NIET"
                        className="px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 text-xs focus:outline-none focus:ring-2 focus:ring-secondary"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-semibold text-surface-variant uppercase tracking-wider">
                        {PORTFOLIO_DATA.copy.ExecutiveContact.text26}
                      </label>
                      <select
                        value={formState.inquiryType}
                        onChange={(e) =>
                          setFormState({
                            ...formState,
                            inquiryType: e.target.value,
                          })
                        }
                        className="px-3 py-2.5 rounded-xl bg-[var(--color-primary-container)] border border-white/20 text-white text-xs focus:outline-none focus:ring-2 focus:ring-secondary"
                      >
                        <option value="Corporate Placement / Hiring">
                          {PORTFOLIO_DATA.copy.ExecutiveContact.text27}
                        </option>
                        <option value="Strategy Advisory / Project">
                          {PORTFOLIO_DATA.copy.ExecutiveContact.text28}
                        </option>
                        <option value="Executive Mentorship / Dialogue">
                          {PORTFOLIO_DATA.copy.ExecutiveContact.text29}
                        </option>
                        <option value="General Inquiries">
                          {PORTFOLIO_DATA.copy.ExecutiveContact.text30}
                        </option>
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-semibold text-surface-variant uppercase tracking-wider">
                      {PORTFOLIO_DATA.copy.ExecutiveContact.text31}
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formState.message}
                      onChange={(e) =>
                        setFormState({ ...formState, message: e.target.value })
                      }
                      placeholder="Outline strategic requirement, role specifications, or discussion topic..."
                      className="px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 text-xs focus:outline-none focus:ring-2 focus:ring-secondary resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-secondary hover:bg-secondary-container text-white font-semibold rounded-xl text-xs transition-colors flex items-center justify-center gap-2 shadow-md cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {PORTFOLIO_DATA.copy.ExecutiveContact.text32}
                    </span>
                    <span>{PORTFOLIO_DATA.copy.ExecutiveContact.text33}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
