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
import { mediaCandidates } from "./cms/media";
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
    let bakedJSON = "";
    let liveTimer = 0;
    let stopped = false;
    // Published edits are committed to GitHub, but the static site only
    // rebuilds a few minutes later. To make edits show up right away, the page
    // also reads the newest published JSON straight from the repository and
    // swaps it in when it differs from the copy baked into this build.
    const cfg = (window as any).SITE_CONFIG || {};
    const rawBase = /^[\w.-]+\/[\w.-]+$/.test(cfg.GITHUB_REPO || "")
      ? `https://raw.githubusercontent.com/${cfg.GITHUB_REPO}/${cfg.GITHUB_BRANCH || "main"}/`
      : "";
    const liveMedia = (v: any): any =>
      typeof v === "string"
        ? /^(\.\/)?media\/images\//i.test(v)
          ? rawBase + v.replace(/^\.\//, "")
          : v
        : Array.isArray(v)
          ? v.map(liveMedia)
          : v && typeof v === "object"
            ? Object.fromEntries(
                Object.entries(v).map(([k, x]) => [k, liveMedia(x)]),
              )
            : v;
    const refreshLive = async () => {
      if (!rawBase || stopped || receivedPreview) return;
      try {
        const r = await fetch(
          rawBase + "content/site-content.json?t=" + Date.now(),
          { cache: "reload" },
        );
        if (!r.ok) return;
        const fresh = normalize(await r.json());
        if (stopped || receivedPreview) return;
        if (JSON.stringify(fresh) === bakedJSON) return;
        const live = liveMedia(fresh);
        selectedTheme.current = clone(live.appearance.theme);
        setContent((cur: any) =>
          JSON.stringify(cur) === JSON.stringify(live) ? cur : live,
        );
      } catch {
        /* offline or private repository: keep the built-in copy */
      }
    };
    const onVisible = () => {
      if (document.visibilityState === "visible") refreshLive();
    };
    // When the admin publishes in this same browser, check again straight away
    // (and a few more times, because GitHub can take a few seconds to serve it).
    const kicks: number[] = [];
    let channel: BroadcastChannel | null = null;
    function startLive() {
      refreshLive();
      document.addEventListener("visibilitychange", onVisible);
      window.addEventListener("focus", onVisible);
      window.addEventListener("online", onVisible);
      liveTimer = window.setInterval(() => {
        if (document.visibilityState === "visible") refreshLive();
      }, 30000);
      try {
        channel = new BroadcastChannel("portfolio-cms");
        channel.onmessage = (e) => {
          if (e.data !== "published") return;
          [800, 4000, 10000, 25000].forEach((ms) =>
            kicks.push(window.setTimeout(refreshLive, ms)),
          );
        };
      } catch {
        /* BroadcastChannel unsupported: the 30 second poll still applies */
      }
    }
    fetch("./content/site-content.json?v=" + Date.now(), { cache: "no-store" })
      .then((r) => {
        if (!r.ok) throw Error("Unable to load portfolio content.");
        return r.json();
      })
      .then((c) => {
        if (receivedPreview) return;
        bakedJSON = JSON.stringify(normalize(c));
        selectedTheme.current = clone(normalize(c).appearance.theme);
        setContent(normalize(c));
        if (!preview) startLive();
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
    return () => {
      stopped = true;
      window.clearInterval(liveTimer);
      kicks.forEach((k) => window.clearTimeout(k));
      channel?.close();
      window.removeEventListener("focus", onVisible);
      window.removeEventListener("online", onVisible);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("message", receive);
    };
  }, []);
  const [resumeUrl, setResumeUrl] = useState("");
  useEffect(() => {
    const c = mediaCandidates(content?.resume);
    setResumeUrl(c[0] || "");
    if (c.length > 1)
      fetch(c[0], { method: "HEAD" })
        .then((r) => {
          if (!r.ok) setResumeUrl(c[1]);
        })
        .catch(() => {});
  }, [content?.resume]);
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
      { threshold: 0.05, rootMargin: "0px 0px -4% 0px" },
    );
    document
      .querySelectorAll(".cms-section")
      .forEach((el) => observer.observe(el));
    const ids = ordered(content)
      .filter((s) => s.visible)
      .map((s) => s.id);
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        let cur = "";
        for (const id of ids) {
          const top = document.getElementById(id)?.getBoundingClientRect().top;
          if (top !== undefined && top < 200) cur = id;
        }
        if (cur) setActive(cur);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, [content]);
  if (error) return <p role="alert">{error}</p>;
  if (!content) return <p className="cms-loading">Loading portfolio…</p>;
  window.__CMS_CONTENT = content;
  const resume = () => {
    const url = resumeUrl || safeURL(content.resume);
    if (url) window.open(url, "_blank", "noopener,noreferrer");
    else alert("A resume has not been uploaded yet.");
  };
  const downloadResume = async () => {
    const url = resumeUrl || safeURL(content.resume);
    if (!url) return alert("A resume has not been uploaded yet.");
    const name =
      decodeURIComponent(url.split("?")[0].split("/").pop() || "")
        .replace(/^\d{10,}-/, "") || "Resume.pdf";
    try {
      // Fetch first so the browser saves it instead of just opening it.
      const r = await fetch(url);
      if (!r.ok) throw Error();
      const href = URL.createObjectURL(await r.blob());
      const a = document.createElement("a");
      a.href = href;
      a.download = name;
      document.body.append(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(href), 2000);
    } catch {
      window.open(url, "_blank", "noopener,noreferrer");
    }
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
          onDownloadResume={downloadResume}
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
        <main style={{ paddingTop: "var(--header-h, 80px)" }}>
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
                          {...(s.component === "Hero"
                            ? {
                                heroImage: content.profileImage,
                                hero: content.hero,
                              }
                            : {})}
                        />
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
