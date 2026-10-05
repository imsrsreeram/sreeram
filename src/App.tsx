import React, { useEffect, useState, useRef } from "react";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { ExecutiveProfile } from "./components/ExecutiveProfile";
import { AcademicFoundation } from "./components/AcademicFoundation";
import { BusinessCapabilities } from "./components/BusinessCapabilities";
import { SelectedProjects } from "./components/SelectedProjects";
import { IndustryExposure } from "./components/IndustryExposure";
import { Certifications } from "./components/Certifications";
import { FunctionalInterconnections } from "./components/FunctionalInterconnections";
import { ExecutiveDataSection } from "./components/ExecutiveDataSection";
import { DualMarquee } from "./components/DualMarquee";
import { ExecutiveContact } from "./components/ExecutiveContact";
import { Footer } from "./components/Footer";
import { DataContext } from "./cms/context";
import { Fields, GenericSection } from "./cms/Fields";
import {
  normalize,
  ordered,
  applyTheme,
  clone,
  presets,
  safeURL,
} from "./cms/model";
const registry: any = {
  Hero,
  ExecutiveProfile,
  AcademicFoundation,
  BusinessCapabilities,
  SelectedProjects,
  IndustryExposure,
  Certifications,
  FunctionalInterconnections,
  ExecutiveDataSection,
  DualMarquee,
  ExecutiveContact,
};
export default function App() {
  const [content, setContent] = useState<any>(null),
    [error, setError] = useState(""),
    [active, setActive] = useState("home");
  const selectedTheme = useRef<any>(null);
  const preview = new URLSearchParams(location.search).has("preview");
  useEffect(() => {
    let receivedPreview = false;
    fetch("./content/site-content.json?v=" + Date.now(), { cache: "no-store" })
      .then((r) => {
        if (!r.ok) throw Error("Unable to load portfolio content.");
        return r.json();
      })
      .then((c) => {
        if (receivedPreview) return;
        selectedTheme.current = clone(normalize(c).appearance.theme);
        setContent(normalize(c));
      })
      .catch((e) => {
        if (!receivedPreview) setError(e.message);
      });
    const receive = (e: MessageEvent) => {
      if (
        e.origin === location.origin &&
        e.data?.type === "cms-preview" &&
        preview
      ) {
        receivedPreview = true;
        selectedTheme.current = clone(
          normalize(e.data.content).appearance.theme,
        );
        setContent(normalize(e.data.content));
        setError("");
      }
    };
    window.addEventListener("message", receive);
    if (preview && window.opener)
      window.opener.postMessage({ type: "cms-preview-ready" }, location.origin);
    if (preview && window.parent !== window)
      window.parent.postMessage({ type: "cms-preview-ready" }, location.origin);
    return () => window.removeEventListener("message", receive);
  }, []);
  useEffect(() => {
    if (!content) return;
    window.__CMS_CONTENT = content;
    applyTheme(content);
    document.title = content.meta.title;
    const meta = (name: string, val: string, property = false) => {
      let el = document.querySelector(
        `meta[${property ? "property" : "name"}="${name}"]`,
      );
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(property ? "property" : "name", name);
        document.head.append(el);
      }
      el.setAttribute("content", val || "");
    };
    meta("description", content.meta.description);
    meta("keywords", content.meta.keywords);
    meta("og:title", content.meta.ogTitle || content.meta.title, true);
    meta(
      "og:description",
      content.meta.ogDescription || content.meta.description,
      true,
    );
    meta("og:image", content.meta.ogImage, true);
    let canon = document.querySelector('link[rel="canonical"]');
    if (!canon) {
      canon = document.createElement("link");
      canon.setAttribute("rel", "canonical");
      document.head.append(canon);
    }
    canon.setAttribute(
      "href",
      content.meta.canonical || location.href.split("?")[0],
    );
    if (content.meta.favicon) {
      let icon =
        document.querySelector('link[rel="icon"]') ||
        document.createElement("link");
      icon.setAttribute("rel", "icon");
      icon.setAttribute("href", safeURL(content.meta.favicon));
      document.head.append(icon);
    }
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0.08 },
    );
    document
      .querySelectorAll(".cms-section")
      .forEach((el) => observer.observe(el));
    const onScroll = () => {
      const s = ordered(content)
        .filter((s) => s.visible)
        .reverse()
        .find(
          (s) =>
            (document.getElementById(s.id)?.getBoundingClientRect().top ??
              Infinity) < 200,
        );
      if (s) setActive(s.id);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, [content]);
  if (error) return <p role="alert">{error}</p>;
  if (!content) return <p className="cms-loading">Loading portfolio…</p>;
  window.__CMS_CONTENT = content;
  const resume = () => {
    const url = safeURL(content.resume);
    if (url) window.open(url, "_blank", "noopener,noreferrer");
    else alert("A resume has not been uploaded yet.");
  };
  const contact = () =>
    document
      .getElementById(
        content.sections.find(
          (s: any) => s.component === "ExecutiveContact" && s.visible,
        )?.id || "contact",
      )
      ?.scrollIntoView({ behavior: "smooth" });
  return (
    <DataContext.Provider value={content.data}>
      <div className="min-h-screen bg-surface text-on-surface">
        {preview && (
          <div className="cms-preview-banner">Unpublished preview</div>
        )}
        <Header
          activeSection={active}
          onOpenResumeModal={resume}
          onOpenContactModal={contact}
        />
        {content.appearance.visitorSwitcher && (
          <button
            className="cms-mode"
            onClick={() => {
              const c = clone(content);
              c.appearance.theme = clone(
                content.appearance.theme.id === "premium-dark"
                  ? selectedTheme.current || presets[0]
                  : presets.find((p) => p.id === "premium-dark"),
              );
              setContent(c);
            }}
          >
            Light / Dark
          </button>
        )}
        <main className="pt-20">
          {ordered(content)
            .filter((s) => s.visible)
            .map((s) => {
              const Component = registry[s.component];
              return (
                <div
                  id={s.id}
                  key={s.id}
                  className={"cms-section motion-" + s.animation}
                >
                  <DataContext.Provider value={s.data || content.data}>
                    {Component ? (
                      <>
                        {s.heading && (
                          <div className="cms-section-heading">
                            <h2>{s.heading}</h2>
                            <p>{s.subheading}</p>
                          </div>
                        )}
                        <Component
                          onOpenResumeModal={resume}
                          onOpenContactModal={contact}
                        />
                        {s.id === "home" && content.profileImage && (
                          <img
                            className="cms-profile-photo"
                            src={safeURL(content.profileImage)}
                            alt={content.data.profile.name}
                          />
                        )}
                        <div className="cms-extra">
                          <Fields fields={s.fields} />
                          {(s.items || []).length > 0 && (
                            <GenericSection
                              section={{
                                ...s,
                                heading: "",
                                name: "",
                                fields: [],
                              }}
                            />
                          )}
                          {Array.isArray(
                            (s.data || content.data)[
                              (
                                {
                                  AcademicFoundation: "education",
                                  BusinessCapabilities: "capabilities",
                                  SelectedProjects: "projects",
                                  Certifications: "certifications",
                                } as any
                              )[s.component]
                            ],
                          ) &&
                            (s.data || content.data)[
                              (
                                {
                                  AcademicFoundation: "education",
                                  BusinessCapabilities: "capabilities",
                                  SelectedProjects: "projects",
                                  Certifications: "certifications",
                                } as any
                              )[s.component]
                            ].map(
                              (item: any, i: number) =>
                                (item.fields || []).length > 0 && (
                                  <div key={i}>
                                    <h3>{item.title || item.degree}</h3>
                                    <Fields fields={item.fields} />
                                  </div>
                                ),
                            )}
                        </div>
                      </>
                    ) : (
                      <GenericSection section={s} />
                    )}
                  </DataContext.Provider>
                </div>
              );
            })}
        </main>
        {content.data.profile.whatsapp && (
          <div className="cms-extra">
            <a
              className="cms-button"
              href={
                "https://wa.me/" +
                String(content.data.profile.whatsapp).replace(/\D/g, "")
              }
            >
              WhatsApp
            </a>
          </div>
        )}
        <Footer onOpenResumeModal={resume} onOpenContactModal={contact} />
      </div>
    </DataContext.Provider>
  );
}
