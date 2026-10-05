import { ValueEditor, CustomFields } from "./Forms";
import { HeroMedia } from "./HeroMedia";
import React, { useState, useEffect, useRef } from "react";
import {
  clone,
  normalize,
  seed,
  slug,
  types,
  fieldTypes,
  presets,
  FONT_OPTIONS,
  loadFontPreviews,
  fontStack,
  ensureFont,
  themeTokens,
  contrast,
  validate,
  ordered,
  safeURL,
} from "./model";
import "./admin.css";

/**
 * Optimises uploaded photos: resizes to at most 2000 px and re-encodes as WebP
 * (keeps transparency, typically 5-10x smaller than PNG) so pages load fast
 * and the file fits the 3 MB limit. Falls back to the original when the
 * browser cannot encode WebP or the result would not be smaller.
 */
async function shrinkImage(file: File, maxSide = 2000): Promise<File> {
  if (!/^image\/(jpeg|png|webp)$/.test(file.type)) return file;
  const bmp = await createImageBitmap(file);
  const scale = Math.min(1, maxSide / Math.max(bmp.width, bmp.height));
  if (scale === 1 && file.size <= 300 * 1024) {
    bmp.close();
    return file;
  }
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bmp.width * scale);
  canvas.height = Math.round(bmp.height * scale);
  canvas.getContext("2d")!.drawImage(bmp, 0, 0, canvas.width, canvas.height);
  bmp.close();
  for (const q of [0.84, 0.74, 0.62]) {
    const blob: Blob | null = await new Promise((r) =>
      canvas.toBlob(r, "image/webp", q),
    );
    if (!blob || blob.type !== "image/webp") break; // no WebP encoder
    if (blob.size <= 1.5 * 1024 * 1024 || q === 0.62) {
      if (blob.size >= file.size && file.size <= 2.8 * 1024 * 1024) return file;
      return new File([blob], file.name.replace(/\.[^.]+$/, ".webp"), {
        type: "image/webp",
      });
    }
  }
  return file;
}
const BACKUP = "portfolio-cms-draft-v2";
const names: any = {
  Hero: "profile",
  ExecutiveProfile: "profile",
  AcademicFoundation: "education",
  BusinessCapabilities: "capabilities",
  SelectedProjects: "projects",
  IndustryExposure: "experience",
  Certifications: "certifications",
  FunctionalInterconnections: "interconnections",
  DualMarquee: "marqueeTracks",
};
const pretty = (s: string) =>
  s
    .replace(/([A-Z])/g, " $1")
    .replace(/[-_]/g, " ")
    .replace(/^./, (s) => s.toUpperCase());
export default function Admin() {
  const [draft, setDraft] = useState<any>(null),
    [token, setToken] = useState(
      () => sessionStorage.getItem("cms-token") || "",
    ),
    [pin, setPin] = useState(""),
    [status, setStatus] = useState(""),
    [tab, setTab] = useState("dashboard"),
    [media, setMedia] = useState<any[]>([]),
    [mediaOpen, setMediaOpen] = useState(false),
    [browseFonts, setBrowseFonts] = useState(false),
    [fontQ, setFontQ] = useState(""),
    [fontGroup, setFontGroup] = useState("All"),
    [themeQ, setThemeQ] = useState(""),
    [themeMode, setThemeMode] = useState("All"),
    [busy, setBusy] = useState(false),
    [showPreview, setShowPreview] = useState(false),
    [snapshot, setSnapshot] = useState(""),
    [serverSha, setServerSha] = useState("");
  const pick = useRef<((v: string) => void) | null>(null),
    frame = useRef<HTMLIFrameElement>(null),
    popup = useRef<Window | null>(null),
    draftRef = useRef<any>(null);
  const cfg = window.SITE_CONFIG || {},
    base = (cfg.API_BASE_URL || "").replace(/\/$/, "");
  const demo = new URLSearchParams(location.search).get("demo") === "1";
  async function api(path: string, body?: any) {
    const r = await fetch(base + path, {
      method: body ? "POST" : "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: "Bearer " + token } : {}),
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
    const d = await r.json();
    if (!r.ok) {
      if (r.status === 401) setToken("");
      throw Error(d.error || "Request failed");
    }
    return d;
  }
  useEffect(() => {
    if (!token && !demo) return;
    let live = true;
    (demo
      ? fetch("../content/site-content.json").then((r) => r.json())
      : api("/api/content").then((d) => {
          setServerSha(d.sha || "");
          return d.content;
        })
    )
      .then((c) => {
        if (!live) return;
        const normalized = normalize(c);
        setSnapshot(JSON.stringify(normalized));
        let backup = null;
        try {
          backup = JSON.parse(localStorage.getItem(BACKUP) || "null");
        } catch {}
        setDraft(
          backup &&
            confirm("Restore your unpublished draft saved on this device?")
            ? normalize(backup)
            : normalized,
        );
        setStatus(
          demo
            ? "Offline demo — publishing and uploads disabled"
            : "Published content loaded",
        );
      })
      .catch((e) => setStatus(e.message));
    return () => {
      live = false;
    };
  }, [token]);
  useEffect(() => {
    draftRef.current = draft;
    if (!draft) return;
    try {
      localStorage.setItem(BACKUP, JSON.stringify(draft));
    } catch {
      setStatus("Unable to save locally: device storage is full.");
    }
    const send = () => {
      frame.current?.contentWindow?.postMessage(
        { type: "cms-preview", content: draft },
        location.origin,
      );
      popup.current?.postMessage(
        { type: "cms-preview", content: draft },
        location.origin,
      );
    };
    send();
    const onReady = (e: MessageEvent) => {
      if (e.origin === location.origin && e.data?.type === "cms-preview-ready")
        send();
    };
    window.addEventListener("message", onReady);
    return () => window.removeEventListener("message", onReady);
  }, [draft, showPreview]);
  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => {
      if (draftRef.current && JSON.stringify(draftRef.current) !== snapshot) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [snapshot]);
  const update = (fn: (d: any) => void) =>
    setDraft((old: any) => {
      const d = clone(old);
      fn(d);
      return d;
    });
  async function login(e: React.FormEvent) {
    e.preventDefault();
    if (!base) {
      setStatus(
        "Set API_BASE_URL in config.js to your deployed Vercel API URL.",
      );
      return;
    }
    setBusy(true);
    try {
      const d = await api("/api/auth/login", { pin });
      sessionStorage.setItem("cms-token", d.token);
      setToken(d.token);
      setPin("");
    } catch (e: any) {
      setStatus(e.message);
    } finally {
      setBusy(false);
    }
  }
  async function publish() {
    const errors = validate(draft);
    if (errors.length) {
      setStatus(errors.join(" "));
      return;
    }
    if (demo) {
      setStatus("Demo content can be exported. Configure the API to publish.");
      return;
    }
    setBusy(true);
    try {
      const published = await api("/api/publish", {
        content: draft,
        expectedSha: serverSha,
      });
      setServerSha(published.sha || "");
      setSnapshot(JSON.stringify(draft));
      localStorage.removeItem(BACKUP);
      try {
        const ch = new BroadcastChannel("portfolio-cms");
        ch.postMessage("published");
        ch.close();
      } catch {
        /* older browsers: the site still checks every 30 seconds */
      }
      setStatus(
        "Published. Visitors see the change within about a minute; the full site rebuild finishes in a few minutes.",
      );
    } catch (e: any) {
      setStatus(e.message);
    } finally {
      setBusy(false);
    }
  }
  const chooseMedia = async (cb: (v: string) => void) => {
    pick.current = cb;
    setMediaOpen(true);
    try {
      setMedia(demo ? draft.media : (await api("/api/media-list")).files);
    } catch (e: any) {
      setStatus(e.message);
    }
  };
  const mediaURL = (path: string) =>
    cfg.GITHUB_REPO
      ? "https://raw.githubusercontent.com/" +
        cfg.GITHUB_REPO +
        "/" +
        (cfg.GITHUB_BRANCH || "main") +
        "/" +
        path
      : "../" + path;
  async function upload(file: File): Promise<string | null> {
    if (demo) {
      setStatus("Uploads require the configured API.");
      return null;
    }
    try {
      file = await shrinkImage(file);
    } catch {
      /* fall back to the original file */
    }
    if (file.size > 3 * 1024 * 1024) {
      setStatus("Choose a file smaller than 3 MB.");
      return null;
    }
    if (
      ![
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/svg+xml",
        "application/pdf",
      ].includes(file.type)
    ) {
      setStatus(
        "Use JPG, PNG, WebP, safe SVG or PDF. Only geometric, self-contained SVG assets are accepted.",
      );
      return null;
    }
    setBusy(true);
    try {
      const data: string = await new Promise((resolve, reject) => {
        const r = new FileReader();
        r.onload = () => resolve(String(r.result).split(",")[1]);
        r.onerror = reject;
        r.readAsDataURL(file);
      });
      const path =
        "media/" +
        (file.type === "application/pdf" ? "files/" : "images/") +
        Date.now() +
        "-" +
        file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
      await api("/api/upload", {
        path,
        contentType: file.type,
        dataBase64: data,
      });
      setMedia((await api("/api/media-list")).files);
      update((d) => d.media.push({ path, name: file.name, type: file.type }));
      setStatus("Uploaded.");
      return path;
    } catch (e: any) {
      setStatus(e.message);
      return null;
    } finally {
      setBusy(false);
    }
  }
  function exportJSON(data: any, name: string) {
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  useEffect(() => {
    if (browseFonts)
      loadFontPreviews(
        FONT_OPTIONS.map((f) => f.name),
        "Strategy, Analytics, 2027",
      );
  }, [browseFonts]);
  if (!token && !demo)
    return (
      <div className="admin-login">
        <form onSubmit={login}>
          <p className="eyebrow">PORTFOLIO STUDIO</p>
          <h1>Welcome back.</h1>
          <p>Manage your content, design and publishing.</p>
          <label>
            Admin PIN
            <input
              type="password"
              required
              value={pin}
              onChange={(e) => setPin(e.target.value)}
            />
          </label>
          <button className="primary" disabled={busy}>
            Unlock
          </button>
          <p role="status">{status}</p>
          <a href="?demo=1">Explore offline demo</a>
        </form>
      </div>
    );
  if (!draft)
    return (
      <div className="admin-login">
        <p>{status || "Loading your portfolio…"}</p>
      </div>
    );
  const sec = draft.sections.find((s: any) => s.id === tab);
  const dirty = JSON.stringify(draft) !== snapshot;
  function move(id: string, delta: number) {
    update((d) => {
      const a = ordered(d),
        i = a.findIndex((s) => s.id === id),
        j = i + delta;
      if (j < 0 || j >= a.length) return;
      [a[i], a[j]] = [a[j], a[i]];
      a.forEach((s, i) => (s.order = i));
      d.sections = a;
    });
  }
  function duplicate(s: any) {
    update((d) => {
      let id = slug(s.id + "-copy"),
        i = 2;
      while (d.sections.some((v: any) => v.id === id))
        id = slug(s.id + "-copy-" + i++);
      const v = clone(s);
      v.id = id;
      v.name += " Copy";
      v.navLabel += " Copy";
      v.order = d.sections.length;
      v.data = clone(s.data || d.data);
      d.sections.push(v);
      setTab(id);
    });
  }
  function addSection() {
    update((d) => {
      let id = "new-section",
        i = 2;
      while (d.sections.some((s: any) => s.id === id))
        id = "new-section-" + i++;
      d.sections.push({
        id,
        autoSlug: true,
        name: "New Section",
        navLabel: "New Section",
        heading: "",
        subheading: "",
        type: "cards",
        visible: true,
        showInNav: true,
        order: d.sections.length,
        animation: "default",
        fields: [],
        items: [],
      });
      setTab(id);
    });
  }
  const sectionPatch = (patch: any) =>
    update((d) => {
      const section = d.sections.find((s: any) => s.id === tab);
      if (!section) return;
      const oldId = section.id;
      if (patch.name !== undefined && section.autoSlug) {
        let next = slug(patch.name),
          i = 2;
        while (d.sections.some((s: any) => s !== section && s.id === next))
          next = slug(patch.name) + "-" + i++;
        patch.id = next;
        if (section.navLabel === section.name) patch.navLabel = patch.name;
      } else if (patch.id !== undefined) section.autoSlug = false;
      if (
        section.id === "home" &&
        patch.id !== undefined &&
        patch.id !== "home"
      ) {
        setStatus("The Home section ID is protected.");
        delete patch.id;
      }
      Object.assign(section, patch);
      if (section.id !== oldId) {
        const replace = (obj: any) => {
          if (!obj || typeof obj !== "object") return;
          for (const k of Object.keys(obj)) {
            if (obj[k] === "#" + oldId) obj[k] = "#" + section.id;
            else replace(obj[k]);
          }
        };
        replace(d.data);
        replace(d.navigation);
        setTab(section.id);
      }
    });
  const editingData = sec?.data || draft.data;
  return (
    <div className="admin-shell">
      <aside>
        <a className="admin-brand" href="../">
          Portfolio<span>STUDIO / CMS</span>
        </a>
        <nav>
          {[
            ["dashboard", "Dashboard"],
            ["layout", "Page Layout & Sections"],
            ["navigation", "Navigation"],
            ["themes", "Theme Manager"],
            ["fonts", "Fonts"],
            ["animations", "Animations"],
            ["assets", "Media & Resume"],
            ["seo", "SEO & Settings"],
          ].map(([k, v]) => (
            <button
              className={tab === k ? "active" : ""}
              key={k}
              onClick={() => setTab(k)}
            >
              {v}
            </button>
          ))}
          <p className="eyebrow">CONTENT</p>
          {ordered(draft).map((s) => (
            <button
              className={tab === s.id ? "active" : ""}
              key={s.id}
              onClick={() => setTab(s.id)}
            >
              {s.name}
              {!s.visible ? " · hidden" : ""}
            </button>
          ))}
          <button onClick={addSection}>+ Add New Section</button>
        </nav>
        <button
          onClick={async () => {
            try {
              if (!demo) await api("/api/auth/logout", {});
            } finally {
              sessionStorage.removeItem("cms-token");
              setToken("");
              if (demo) location.href = "./";
            }
          }}
        >
          Log out
        </button>
      </aside>
      <div className="admin-main">
        <header className="admin-toolbar">
          <span>
            {dirty ? "Unpublished changes" : "Published"} ·{" "}
            {demo ? "Demo" : "Studio"}
          </span>
          <div className="row">
            <button onClick={() => setShowPreview(!showPreview)}>
              Preview
            </button>
            <button
              onClick={() => {
                localStorage.setItem(BACKUP, JSON.stringify(draft));
                setStatus("Draft saved on this device.");
              }}
            >
              Save Draft
            </button>
            <button
              className="primary"
              disabled={busy || demo}
              onClick={publish}
            >
              {busy ? "Working…" : "Publish Changes"}
            </button>
          </div>
        </header>
        <div className="status" role="status">
          {status}
        </div>
        <div
          className={"admin-workspace " + (showPreview ? "with-preview" : "")}
        >
          <main className="admin-editor">
            <h1>{sec?.name || pretty(tab)}</h1>
            {tab === "dashboard" && (
              <>
                <p>
                  Your portfolio is managed here. Draft changes appear in
                  Preview and reach the public website only after publication.
                </p>
                <div className="dashboard-cards">
                  <article>
                    <strong>{draft.sections.length}</strong>Sections
                  </article>
                  <article>
                    <strong>{draft.appearance.theme.name}</strong>Active draft
                    theme
                  </article>
                  <article>
                    <strong>{dirty ? "Draft" : "Published"}</strong>Content
                    status
                  </article>
                </div>
                <button
                  onClick={() => exportJSON(draft, "portfolio-content.json")}
                >
                  Export Content Backup
                </button>
                <label>
                  Import Content Backup
                  <input
                    type="file"
                    accept="application/json"
                    onChange={async (e) => {
                      try {
                        const f = e.target.files?.[0];
                        if (
                          f &&
                          confirm("Replace this draft with imported content?")
                        )
                          setDraft(normalize(JSON.parse(await f.text())));
                      } catch {
                        setStatus("Invalid content JSON.");
                      }
                    }}
                  />
                </label>
              </>
            )}
            {sec && (
              <>
                {sec.component === "Hero" && (
                  <HeroMedia
                    draft={draft}
                    update={update}
                    chooseMedia={chooseMedia}
                    resolve={mediaURL}
                  />
                )}
                <fieldset>
                  <legend>Section Settings</legend>
                  <div className="form-grid">
                    {["name", "navLabel", "id", "heading", "subheading"].map(
                      (k) => (
                        <ValueEditor
                          key={k}
                          label={k}
                          value={sec[k] || ""}
                          onChange={(v) => sectionPatch({ [k]: v })}
                        />
                      ),
                    )}
                    <ValueEditor
                      label="Visible on website"
                      value={sec.visible}
                      onChange={(v) => sectionPatch({ visible: v })}
                    />
                    <ValueEditor
                      label="Show in navbar"
                      value={sec.showInNav}
                      onChange={(v) => sectionPatch({ showInNav: v })}
                    />
                    <label>
                      Animation
                      <select
                        value={sec.animation}
                        onChange={(e) =>
                          sectionPatch({ animation: e.target.value })
                        }
                      >
                        {[
                          "default",
                          "fade-up",
                          "fade-in",
                          "slide-left",
                          "slide-right",
                          "scale",
                          "none",
                        ].map((t) => (
                          <option key={t}>{t}</option>
                        ))}
                      </select>
                    </label>
                    {!sec.component && (
                      <label>
                        Layout
                        <select
                          value={sec.type}
                          onChange={(e) =>
                            sectionPatch({ type: e.target.value })
                          }
                        >
                          {types.map((t) => (
                            <option key={t}>{t}</option>
                          ))}
                        </select>
                      </label>
                    )}
                  </div>
                  {sec.data && (
                    <p className="hero-hint own-data-note">
                      <b>This section has its own separate copy of the content.</b>{" "}
                      Edits made here do not change the main site content (name,
                      bio, header, footer), and edits to the main content do not
                      change this section.{" "}
                      <button
                        type="button"
                        onClick={() => {
                          if (
                            confirm(
                              "Make this section use the main site content? Its separate copy will be removed.",
                            )
                          )
                            update((d) => {
                              const t = d.sections.find(
                                (x: any) => x.id === sec.id,
                              );
                              if (t) delete t.data;
                            });
                        }}
                      >
                        Use main content instead
                      </button>
                    </p>
                  )}
                  <div className="row">
                    <button onClick={() => duplicate(sec)}>
                      Duplicate Section
                    </button>
                    <button onClick={() => move(sec.id, -1)}>Move Up</button>
                    <button onClick={() => move(sec.id, 1)}>Move Down</button>
                    {sec.id !== "home" && (
                      <button
                        onClick={() => {
                          if (confirm("Delete this section and its content?")) {
                            update(
                              (d) =>
                                (d.sections = d.sections.filter(
                                  (s: any) => s.id !== tab,
                                )),
                            );
                            setTab("layout");
                          }
                        }}
                      >
                        Delete Section
                      </button>
                    )}
                  </div>
                </fieldset>
                {names[sec.component] && (
                  <ValueEditor
                    label="Section content"
                    value={editingData[names[sec.component]]}
                    chooseMedia={chooseMedia}
                    onChange={(v) =>
                      update((d) => {
                        const s = d.sections.find((s: any) => s.id === tab);
                        if (s.data) s.data[names[s.component]] = v;
                        else d.data[names[s.component]] = v;
                      })
                    }
                  />
                )}
                {editingData.componentDetails?.[sec.component] &&
                  Object.keys(editingData.componentDetails[sec.component])
                    .length > 0 && (
                    <ValueEditor
                      label="Interactive diagram content"
                      value={editingData.componentDetails[sec.component]}
                      onChange={(v) =>
                        update((d) => {
                          const s = d.sections.find((s: any) => s.id === tab);
                          (s.data || d.data).componentDetails[s.component] = v;
                        })
                      }
                    />
                  )}
                {editingData.copy?.[sec.component] && (
                  <details>
                    <summary>Headings, labels & button text</summary>
                    <ValueEditor
                      label="Editorial copy"
                      value={editingData.copy[sec.component]}
                      onChange={(v) =>
                        update((d) => {
                          const s = d.sections.find((s: any) => s.id === tab);
                          (s.data || d.data).copy[s.component] = v;
                        })
                      }
                    />
                  </details>
                )}
                <CustomFields
                  fields={sec.fields || []}
                  onChange={(v) => sectionPatch({ fields: v })}
                  chooseMedia={chooseMedia}
                />
                {
                  <>
                    <ValueEditor
                      label="Items"
                      value={sec.items || []}
                      onChange={(v) => sectionPatch({ items: v })}
                      chooseMedia={chooseMedia}
                    />
                    {(sec.items || []).map((it: any, i: number) => (
                      <details key={i}>
                        <summary>
                          {it.title || "Item " + (i + 1)} — custom fields
                        </summary>
                        <CustomFields
                          fields={it.fields || []}
                          chooseMedia={chooseMedia}
                          onChange={(v) => {
                            const a = clone(sec.items);
                            a[i].fields = v;
                            sectionPatch({ items: a });
                          }}
                        />
                      </details>
                    ))}
                  </>
                }
              </>
            )}
            {tab === "layout" && (
              <>
                <p>
                  Drag a section to reorder. On mobile, use the arrow buttons.
                </p>
                {ordered(draft).map((s, i) => (
                  <article
                    className="layout-row"
                    draggable
                    key={s.id}
                    onDragStart={(e) =>
                      e.dataTransfer.setData("text/plain", s.id)
                    }
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const id = e.dataTransfer.getData("text/plain");
                      update((d) => {
                        const a = ordered(d),
                          from = a.findIndex((x) => x.id === id),
                          to = a.findIndex((x) => x.id === s.id);
                        if (from < 0) return;
                        const [item] = a.splice(from, 1);
                        a.splice(to, 0, item);
                        a.forEach((v, i) => (v.order = i));
                        d.sections = a;
                      });
                    }}
                  >
                    <span>☰</span>
                    <button onClick={() => setTab(s.id)}>{s.name}</button>
                    <label>
                      <input
                        type="checkbox"
                        checked={s.visible}
                        onChange={(e) =>
                          update(
                            (d) =>
                              (d.sections.find(
                                (v: any) => v.id === s.id,
                              ).visible = e.target.checked),
                          )
                        }
                      />
                      Visible
                    </label>
                    <button onClick={() => move(s.id, -1)} disabled={!i}>
                      ↑
                    </button>
                    <button
                      onClick={() => move(s.id, 1)}
                      disabled={i === draft.sections.length - 1}
                    >
                      ↓
                    </button>
                    <button onClick={() => duplicate(s)}>Duplicate</button>
                  </article>
                ))}
                <button onClick={addSection}>+ Add New Section</button>
              </>
            )}
            {tab === "navigation" && (
              <>
                <p>
                  Section links follow page order. Manage their label and
                  visibility in Section Settings.
                </p>
                <ValueEditor
                  label="Extra navigation items"
                  value={draft.navigation}
                  onChange={(v) => update((d) => (d.navigation = v))}
                />
                <button
                  onClick={() =>
                    update((d) =>
                      d.navigation.push({
                        id: "nav-" + Date.now(),
                        label: "New link",
                        type: "external",
                        link: "https://",
                        newTab: true,
                        visible: true,
                        order: d.navigation.length,
                      }),
                    )
                  }
                >
                  + Add Navigation Item
                </button>
                <p>
                  For section links use #section-id. For email use mailto:,
                  phone use tel:, and files use media/files/filename.pdf.
                </p>
              </>
            )}
            {tab === "themes" && (
              <>
                <div className="row theme-filter">
                  <input
                    type="search"
                    placeholder="Search themes…"
                    value={themeQ}
                    onChange={(e) => setThemeQ(e.target.value)}
                  />
                  {["All", "Light", "Dark"].map((m) => (
                    <button
                      type="button"
                      key={m}
                      className={themeMode === m ? "on" : ""}
                      onClick={() => setThemeMode(m)}
                    >
                      {m}
                    </button>
                  ))}
                  <span className="hero-hint">
                    {presets.length + draft.appearance.customThemes.length}{" "}
                    themes
                  </span>
                </div>
                <div className="theme-grid">
                  {[...presets, ...draft.appearance.customThemes]
                    .filter((t) => {
                      const dark =
                        contrast(t.colors.background, "#ffffff") >
                        contrast(t.colors.background, "#000000");
                      return (
                        (themeMode === "All" ||
                          (themeMode === "Dark") === dark) &&
                        t.name.toLowerCase().includes(themeQ.toLowerCase())
                      );
                    })
                    .map((t) => (
                    <article
                      className={
                        "theme-card " +
                        (draft.appearance.theme.id === t.id ? "selected" : "")
                      }
                      key={t.id}
                      style={{
                        background: t.colors.background,
                        color: t.colors.text,
                        borderColor: t.colors.border,
                      }}
                    >
                      <h3>{t.name}</h3>
                      <div className="swatches">
                        {[
                          "primary",
                          "secondary",
                          "accent",
                          "background",
                          "text",
                        ].map((k) => (
                          <span
                            key={k}
                            title={k + ": " + t.colors[k]}
                            style={{ background: t.colors[k] }}
                          />
                        ))}
                      </div>
                      <div className="mini-preview">
                        <span style={{ color: t.colors.secondary }}>
                          STRATEGY / ANALYTICS
                        </span>
                        <b>A clear professional identity.</b>
                        <div
                          style={{
                            background: t.colors.surface,
                            padding: 10,
                            borderRadius: 6,
                          }}
                        >
                          Research & insights
                        </div>
                        <span
                          style={{
                            background: t.colors.primary,
                            color: "#fff",
                            padding: 6,
                            borderRadius: 6,
                          }}
                        >
                          Explore portfolio ↗
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          update((d) => (d.appearance.theme = clone(t)));
                          setShowPreview(true);
                        }}
                      >
                        Preview Theme
                      </button>
                      <button
                        onClick={() =>
                          update((d) => (d.appearance.theme = clone(t)))
                        }
                      >
                        Apply Theme
                      </button>
                      {!presets.some((p) => p.id === t.id) && (
                        <div className="row">
                          <button
                            onClick={() => {
                              const name = prompt("Rename theme", t.name);
                              if (name)
                                update((d) => {
                                  d.appearance.customThemes.find(
                                    (v: any) => v.id === t.id,
                                  ).name = name;
                                  if (d.appearance.theme.id === t.id)
                                    d.appearance.theme.name = name;
                                });
                            }}
                          >
                            Rename
                          </button>
                          <button
                            onClick={() =>
                              update((d) =>
                                d.appearance.customThemes.push({
                                  ...clone(t),
                                  id: "custom-" + Date.now(),
                                  name: t.name + " Copy",
                                }),
                              )
                            }
                          >
                            Duplicate
                          </button>
                          <button
                            onClick={() => {
                              if (confirm("Delete this custom theme?"))
                                update(
                                  (d) =>
                                    (d.appearance.customThemes =
                                      d.appearance.customThemes.filter(
                                        (v: any) => v.id !== t.id,
                                      )),
                                );
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </article>
                  ))}
                </div>
                <fieldset>
                  <legend>Create / Edit Custom Theme</legend>
                  <ValueEditor
                    label="Theme name"
                    value={draft.appearance.theme.name}
                    onChange={(v) =>
                      update((d) => (d.appearance.theme.name = v))
                    }
                  />
                  <div className="color-grid">
                    {themeTokens.map((k) => (
                      <label key={k}>
                        {pretty(k)}
                        <div className="row">
                          <input
                            type="color"
                            value={
                              /^#[a-f0-9]{6}$/i.test(
                                draft.appearance.theme.colors[k],
                              )
                                ? draft.appearance.theme.colors[k]
                                : "#000000"
                            }
                            onChange={(e) =>
                              update(
                                (d) =>
                                  (d.appearance.theme.colors[k] =
                                    e.target.value),
                              )
                            }
                          />
                          <input
                            value={draft.appearance.theme.colors[k]}
                            onChange={(e) =>
                              update(
                                (d) =>
                                  (d.appearance.theme.colors[k] =
                                    e.target.value),
                              )
                            }
                          />
                        </div>
                      </label>
                    ))}
                  </div>
                  {contrast(
                    draft.appearance.theme.colors.background,
                    draft.appearance.theme.colors.text,
                  ) < 4.5 && (
                    <p role="alert">
                      ⚠ Low contrast between background and primary text.
                    </p>
                  )}
                  <button
                    onClick={() => {
                      const errors = validate(draft);
                      if (errors.length) {
                        setStatus(errors.join(" "));
                        return;
                      }
                      update((d) => {
                        const t = d.appearance.theme;
                        if (!t.id.startsWith("custom-"))
                          t.id = "custom-" + Date.now();
                        const i = d.appearance.customThemes.findIndex(
                          (v: any) => v.id === t.id,
                        );
                        if (i < 0) d.appearance.customThemes.push(clone(t));
                        else d.appearance.customThemes[i] = clone(t);
                      });
                    }}
                  >
                    Save as Custom Theme
                  </button>
                </fieldset>
                <ValueEditor
                  label="Allow visitor light/dark switcher"
                  value={draft.appearance.visitorSwitcher}
                  onChange={(v) =>
                    update((d) => (d.appearance.visitorSwitcher = v))
                  }
                />
                <div className="row">
                  <button
                    onClick={() => {
                      if (confirm("Reset to the original Stitch colour theme?"))
                        update((d) => (d.appearance.theme = clone(presets[0])));
                    }}
                  >
                    Reset to Stitch Default
                  </button>
                  <button
                    onClick={() =>
                      exportJSON(draft.appearance.theme, "portfolio-theme.json")
                    }
                  >
                    Export Theme
                  </button>
                  <label>
                    Import Theme
                    <input
                      type="file"
                      accept="application/json"
                      onChange={async (e) => {
                        try {
                          const f = e.target.files?.[0];
                          if (!f) return;
                          const t = JSON.parse(await f.text());
                          if (
                            !t.name ||
                            themeTokens.some(
                              (k) =>
                                !/^#[a-f0-9]{6}$/i.test(t.colors?.[k] || ""),
                            )
                          )
                            throw Error(
                              "Invalid theme JSON or missing colour tokens.",
                            );
                          t.id = "custom-" + Date.now();
                          update((d) => {
                            d.appearance.customThemes.push(t);
                            d.appearance.theme = t;
                          });
                        } catch (e: any) {
                          setStatus(e.message);
                        }
                      }}
                    />
                  </label>
                </div>
              </>
            )}
            {tab === "fonts" && (
              <>
                <p>
                  Pick a font for each role. Fonts are independent of themes and
                  download only when selected, so the site stays fast. System
                  fonts work offline.
                </p>
                {["heading", "body", "logo"].map((k) => {
                  ensureFont(draft.appearance.fonts[k]);
                  return (
                    <label key={k}>
                      {pretty(k)} font
                      <select
                        value={draft.appearance.fonts[k]}
                        onChange={(e) => {
                          ensureFont(e.target.value);
                          update(
                            (d) => (d.appearance.fonts[k] = e.target.value),
                          );
                        }}
                      >
                        {[...new Set(FONT_OPTIONS.map((f) => f.group))].map(
                          (g) => (
                            <optgroup key={g} label={g}>
                              {FONT_OPTIONS.filter((f) => f.group === g).map(
                                (f) => (
                                  <option key={f.name}>{f.name}</option>
                                ),
                              )}
                            </optgroup>
                          ),
                        )}
                        {!FONT_OPTIONS.some(
                          (f) => f.name === draft.appearance.fonts[k],
                        ) && <option>{draft.appearance.fonts[k]}</option>}
                      </select>
                      <p
                        style={{
                          fontFamily: fontStack(draft.appearance.fonts[k]),
                          fontSize: 26,
                        }}
                      >
                        A clear professional identity.
                      </p>
                    </label>
                  );
                })}
                <details
                  onToggle={(e) =>
                    setBrowseFonts((e.currentTarget as HTMLDetailsElement).open)
                  }
                >
                  <summary>
                    Browse all {FONT_OPTIONS.length} fonts (search, preview and
                    apply)
                  </summary>
                  <div className="row font-filter">
                    <input
                      type="search"
                      placeholder="Search fonts…"
                      value={fontQ}
                      onChange={(e) => setFontQ(e.target.value)}
                    />
                    {["All", ...new Set(FONT_OPTIONS.map((f) => f.group))].map(
                      (g) => (
                        <button
                          type="button"
                          key={g}
                          className={fontGroup === g ? "on" : ""}
                          onClick={() => setFontGroup(g)}
                        >
                          {g}
                        </button>
                      ),
                    )}
                  </div>
                  <div className="font-grid">
                    {(browseFonts
                      ? FONT_OPTIONS.filter(
                          (f) =>
                            (fontGroup === "All" || f.group === fontGroup) &&
                            f.name.toLowerCase().includes(fontQ.toLowerCase()),
                        )
                      : []
                    ).map((f) => (
                      <article key={f.name}>
                        <strong style={{ fontFamily: fontStack(f.name) }}>
                          {f.name}
                        </strong>
                        <span style={{ fontFamily: fontStack(f.name) }}>
                          Strategy, Analytics, 2027
                        </span>
                        <div className="font-apply">
                          {["heading", "body", "logo"].map((k) => (
                            <button
                              type="button"
                              key={k}
                              className={
                                draft.appearance.fonts[k] === f.name ? "on" : ""
                              }
                              onClick={() => {
                                ensureFont(f.name);
                                update((d) => (d.appearance.fonts[k] = f.name));
                              }}
                            >
                              {pretty(k)}
                            </button>
                          ))}
                        </div>
                      </article>
                    ))}
                  </div>
                </details>
              </>
            )}
            {tab === "animations" && (
              <>
                <ValueEditor
                  label="Background animation"
                  value={draft.appearance.animations.enabled}
                  onChange={(v) =>
                    update((d) => (d.appearance.animations.enabled = v))
                  }
                />
                {["intensity", "density", "speed"].map((k) => (
                  <label key={k}>
                    {pretty(k)}
                    <select
                      value={draft.appearance.animations[k]}
                      onChange={(e) =>
                        update(
                          (d) => (d.appearance.animations[k] = e.target.value),
                        )
                      }
                    >
                      {(k === "speed"
                        ? ["slow", "normal"]
                        : ["low", "medium", "high"]
                      ).map((v) => (
                        <option key={v}>{v}</option>
                      ))}
                    </select>
                  </label>
                ))}
                <ValueEditor
                  label="Mobile animation"
                  value={draft.appearance.animations.mobile}
                  onChange={(v) =>
                    update((d) => (d.appearance.animations.mobile = v))
                  }
                />
                <p>Visitors’ reduced motion settings are always respected.</p>
              </>
            )}
            {tab === "assets" && (
              <>
                <ValueEditor
                  label="Resume PDF"
                  value={draft.resume}
                  onChange={(v) => update((d) => (d.resume = v))}
                  chooseMedia={chooseMedia}
                />
                <button onClick={() => chooseMedia(() => {})}>
                  Open Media Library
                </button>
                <p>
                  Uploads are stored in GitHub. New media does not appear in
                  public content until published. Deleting a media file affects
                  any published references; replace those references before
                  deleting.
                </p>
              </>
            )}
            {tab === "seo" && (
              <>
                <ValueEditor
                  label="SEO"
                  value={draft.meta}
                  chooseMedia={chooseMedia}
                  onChange={(v) => update((d) => (d.meta = v))}
                />
                <details>
                  <summary>Header & footer text</summary>
                  {["Header", "Footer"].map((k) => (
                    <ValueEditor
                      key={k}
                      label={k}
                      value={draft.data.copy[k]}
                      onChange={(v) => update((d) => (d.data.copy[k] = v))}
                    />
                  ))}
                </details>
              </>
            )}
          </main>
          {showPreview && (
            <div className="preview-panel">
              <div className="row">
                <b>Unpublished preview</b>
                <button
                  onClick={() => {
                    popup.current = window.open(
                      "../?preview=1",
                      "portfolio-preview",
                    );
                  }}
                >
                  Open Full Preview
                </button>
              </div>
              <iframe
                ref={frame}
                title="Draft portfolio preview"
                src="../?preview=1"
                onLoad={() =>
                  frame.current?.contentWindow?.postMessage(
                    { type: "cms-preview", content: draftRef.current },
                    location.origin,
                  )
                }
              />
            </div>
          )}
        </div>
      </div>
      {mediaOpen && (
        <div className="modal-backdrop">
          <div className="media-modal">
            <div className="row">
              <h2>Media Library</h2>
              <button onClick={() => setMediaOpen(false)}>Close</button>
            </div>
            <label>
              Upload New
              <input
                disabled={busy || demo}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/svg+xml,application/pdf"
                onChange={(e) => {
                  const input = e.target;
                  const f = input.files?.[0];
                  if (!f) return;
                  upload(f).then((path) => {
                    input.value = "";
                    // Uploading from a picker applies the file straight away.
                    if (path && pick.current) {
                      pick.current(path);
                      setMediaOpen(false);
                    }
                  });
                }}
              />
            </label>
            <div className="media-grid">
              {media.map((f) => (
                <article key={f.path}>
                  {/\.(png|jpe?g|webp)$/i.test(f.path) ? (
                    <img src={mediaURL(f.path)} alt={f.name} />
                  ) : (
                    <p>PDF document</p>
                  )}
                  <p>{f.name || f.path}</p>
                  <a href={mediaURL(f.path)} target="_blank" rel="noreferrer">
                    Preview
                  </a>
                  <button
                    onClick={() => {
                      pick.current?.(f.path);
                      setMediaOpen(false);
                    }}
                  >
                    Select
                  </button>
                  <button
                    disabled={demo}
                    onClick={async () => {
                      if (
                        !confirm(
                          "Permanently delete this file? Published links may break.",
                        )
                      )
                        return;
                      try {
                        await api("/api/media-delete", { path: f.path });
                        setMedia(media.filter((v) => v.path !== f.path));
                        update(
                          (d) =>
                            (d.media = d.media.filter(
                              (v: any) => v.path !== f.path,
                            )),
                        );
                      } catch (e: any) {
                        setStatus(e.message);
                      }
                    }}
                  >
                    Delete
                  </button>
                </article>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
