import { DEFAULT_DATA, PORTFOLIO_DATA } from "../data/portfolioData";
export const clone = <T>(v: T): T => JSON.parse(JSON.stringify(v));
export const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "section";
export const types = [
  "content",
  "cards",
  "timeline",
  "projects",
  "statistics",
  "gallery",
  "certifications",
  "logos",
  "testimonials",
  "process",
  "two-column",
  "list",
  "cta",
];
export const fieldTypes = [
  "text",
  "long-text",
  "rich-text",
  "number",
  "url",
  "email",
  "phone",
  "date",
  "image",
  "file",
  "button",
  "tags",
  "select",
  "toggle",
  "icon",
  "statistic",
  "repeater",
];
const sectionDefs = [
  ["home", "Home", "Hero"],
  ["profile", "Profile", "ExecutiveProfile"],
  ["education", "Academic Foundation", "AcademicFoundation"],
  ["capabilities", "Business Capabilities", "BusinessCapabilities"],
  ["projects", "Research Projects", "SelectedProjects"],
  ["experience", "Industry Exposure", "IndustryExposure"],
  ["certifications", "Certifications", "Certifications"],
  ["interconnections", "Interconnections", "FunctionalInterconnections"],
  ["strategy", "Strategy & Analytics", "ExecutiveDataSection"],
  ["interests", "Areas of Interest", "DualMarquee"],
  ["contact", "Contact", "ExecutiveContact"],
];
export const themeTokens = [
  "primary",
  "secondary",
  "accent",
  "secondaryAccent",
  "background",
  "alternateBackground",
  "surface",
  "darkBackground",
  "text",
  "secondaryText",
  "mutedText",
  "border",
  "navbarBackground",
  "navbarText",
  "buttonBackground",
  "buttonText",
  "link",
  "highlight",
];
const palette = (
  primary: string,
  secondary: string,
  accent: string,
  bg: string,
  text: string,
  surface = "#ffffff",
  dark = "#101820",
) => ({
  primary,
  secondary,
  accent,
  secondaryAccent: "#C99A47",
  background: bg,
  alternateBackground: surface === "#ffffff" ? "#ECEFF3" : "#202c40",
  surface,
  darkBackground: dark,
  text,
  secondaryText: text,
  mutedText: surface === "#ffffff" ? "#667085" : "#bbc5d5",
  border: surface === "#ffffff" ? "#c5c6ce" : "#41516b",
  navbarBackground: bg,
  navbarText: text,
  buttonBackground: primary,
  buttonText: "#ffffff",
  link: secondary,
  highlight: accent,
});
export const presets: any[] = [
  {
    id: "stitch-default",
    name: "Stitch Original",
    colors: palette("#0e1b32", "#2850ce", "#00966a", "#f9f9ff", "#171c25"),
  },
  {
    id: "executive-navy",
    name: "Executive Navy",
    colors: palette("#0B1930", "#3157D5", "#22A879", "#F6F7F9", "#151A23"),
  },
  {
    id: "corporate-blue",
    name: "Corporate Blue",
    colors: palette("#163252", "#2563b9", "#2c8592", "#f5f7fa", "#172a40"),
  },
  {
    id: "emerald-business",
    name: "Emerald Business",
    colors: palette("#123d34", "#216958", "#359277", "#f8f7f2", "#202e2b"),
  },
  {
    id: "burgundy-executive",
    name: "Burgundy Executive",
    colors: palette("#4c182b", "#853451", "#ac8246", "#faf6f4", "#29202a"),
  },
  {
    id: "graphite-professional",
    name: "Graphite Professional",
    colors: palette("#252b34", "#456681", "#71899a", "#f7f8f9", "#20252d"),
  },
  {
    id: "premium-dark",
    name: "Premium Dark",
    colors: palette(
      "#233e65",
      "#89adff",
      "#63dca9",
      "#0d1422",
      "#eef2fa",
      "#172338",
      "#090f1c",
    ),
  },
  {
    id: "light-minimal",
    name: "Light Minimal",
    colors: palette("#25334a", "#476ae8", "#3a8d7f", "#ffffff", "#202b3d"),
  },
];
export function seed(): any {
  return {
    schemaVersion: 2,
    meta: {
      title: "Sreeram S R — MBA Portfolio",
      description: DEFAULT_DATA.profile.bio,
      keywords: "",
      canonical: "",
      ogTitle: "",
      ogDescription: "",
      ogImage: "",
      favicon: "",
    },
    data: clone({
      ...PORTFOLIO_DATA,
      profile: {
        ...PORTFOLIO_DATA.profile,
        logo: "",
        whatsapp: "",
        ctaLinks: {
          profile: "#profile",
          projects: "#projects",
          linkedIn: PORTFOLIO_DATA.profile.linkedIn,
        },
      },
    }),
    sections: sectionDefs.map(([id, label, component], order) => ({
      id,
      name: label,
      navLabel: label,
      heading: "",
      subheading: "",
      visible: true,
      showInNav: !["strategy", "interests"].includes(id),
      order,
      component,
      type: "content",
      animation: "default",
      fields: [],
      items: [],
    })),
    navigation: [],
    appearance: {
      theme: clone(presets[0]),
      fonts: { heading: "Manrope", body: "Inter", logo: "Manrope" },
      animations: {
        enabled: true,
        intensity: "medium",
        density: "medium",
        speed: "normal",
        mobile: true,
      },
      visitorSwitcher: false,
      customThemes: [],
    },
    media: [],
    resume: "",
    profileImage: "",
  };
}
function merge(a: any, b: any): any {
  if (Array.isArray(a)) return Array.isArray(b) ? b : a;
  if (a && typeof a === "object") {
    const o = { ...a };
    for (const k of Object.keys(b || {}))
      o[k] = k in a ? merge(a[k], b[k]) : b[k];
    return o;
  }
  return b === undefined ? a : b;
}
export function normalize(raw: any): any {
  const base = seed();
  if (raw?.schemaVersion === 2) return merge(base, raw);
  if (raw?.sections && raw?.data)
    return merge(base, { ...raw, schemaVersion: 2 });
  // Old Nila documents remain archived verbatim and are mapped without deleting media.
  if (raw?.home) {
    const d = merge(base, {});
    d.legacy = clone(raw);
    const h = raw.home;
    d.meta = {
      ...d.meta,
      title: raw.meta?.siteTitle || d.meta.title,
      description: raw.meta?.seoDescription || d.meta.description,
      keywords: raw.meta?.seoKeywords || "",
      favicon: raw.meta?.favicon || "",
    };
    d.data.profile = {
      ...d.data.profile,
      name: h.name || d.data.profile.name,
      title: h.headline || d.data.profile.title,
      bio: raw.about?.bio || h.tagline || d.data.profile.bio,
      location: raw.contact?.location || raw.about?.location || "",
      email: raw.contact?.email || "",
      phone: raw.contact?.phone || "",
      metrics: raw.about?.stats || [],
    };
    d.resume = h.resumeFile || h.resumeUrl || h.resume || "";
    d.profileImage = h.photo || h.profileImage || "";
    const map: any = {
      about: "profile",
      skills: "capabilities",
      achievements: "strategy",
      gallery: "gallery",
    };
    for (const key of raw.sectionOrder || []) {
      let sec = d.sections.find((s: any) => s.id === (map[key] || key));
      if (!sec) {
        sec = {
          id: slug(key),
          name: key,
          navLabel: key,
          type: "gallery",
          fields: [],
          items: [],
          showInNav: true,
        };
        d.sections.push(sec);
      }
      const old = raw[key];
      sec.heading = old?.heading || "";
      sec.subheading = old?.subheading || "";
      sec.order = raw.sectionOrder.indexOf(key);
      sec.visible = raw.sectionVisibility?.[key] !== false;
      if (Array.isArray(old?.items) || Array.isArray(old)) {
        const items = old.items || old;
        sec.component = "";
        sec.type =
          key === "experience"
            ? "timeline"
            : key === "gallery"
              ? "gallery"
              : "cards";
        sec.items = items.map((v: any) =>
          typeof v === "string"
            ? { title: v }
            : {
                ...v,
                image: v.image || v.photo || "",
                description: v.description || v.summary || "",
                year: v.year || v.duration || "",
              },
        );
      }
    }
    d.sections
      .filter(
        (s: any) =>
          !raw.sectionOrder.some((k: string) => (map[k] || k) === s.id),
      )
      .forEach((s: any) => (s.visible = false));
    const col = raw.appearance?.primaryColor || raw.primaryColor;
    if (/^#[0-9a-f]{6}$/i.test(col || ""))
      d.appearance.theme.colors.primary = col;
    return d;
  }
  return merge(base, raw || {});
}
export function ordered(c: any) {
  return [...c.sections].sort((a, b) => a.order - b.order);
}
export function safeURL(s: any): string {
  const v = String(s || "").trim();
  return /^(https?:\/\/|mailto:|tel:|#|(?:\.\/)?media\/)/i.test(v) ? v : "";
}
export function navigationLinks(c: any) {
  return [
    ...ordered(c)
      .filter((s) => s.visible && s.showInNav)
      .map((s) => ({
        id: s.id,
        label: s.navLabel || s.name,
        href: "#" + s.id,
        newTab: false,
      })),
    ...(c.navigation || [])
      .filter((n: any) => n.visible)
      .sort((a: any, b: any) => a.order - b.order)
      .map((n: any) => ({ ...n, href: safeURL(n.link) })),
  ];
}
export function validate(c: any): string[] {
  const errors: string[] = [];
  const ids = new Set();
  for (const s of c.sections || []) {
    if (!s.name?.trim()) errors.push("Every section needs a name.");
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(s.id))
      errors.push(
        "Use lowercase letters, numbers and hyphens for section IDs.",
      );
    if (ids.has(s.id)) errors.push("Duplicate section ID: " + s.id);
    ids.add(s.id);
    const check = (fields: any[]) => {
      const keys = new Set();
      for (const f of fields || []) {
        if (!f.key || keys.has(f.key))
          errors.push("Duplicate or empty field key in " + s.name);
        keys.add(f.key);
        if (
          ["url", "image", "file", "button"].includes(f.type) &&
          f.value &&
          !safeURL(f.value)
        )
          errors.push("Invalid URL in " + f.label);
      }
    };
    check(s.fields);
    (s.items || []).forEach((i: any) => check(i.fields));
  }
  for (const n of c.navigation || [])
    if (
      n.visible &&
      (!safeURL(n.link) ||
        (n.link.startsWith("#") &&
          !c.sections.some((s: any) => s.id === n.link.slice(1) && s.visible)))
    )
      errors.push("Invalid or hidden navigation target: " + n.label);
  for (const k of themeTokens)
    if (!/^#[0-9a-f]{6}$/i.test(c.appearance.theme.colors[k] || ""))
      errors.push("Invalid HEX colour: " + k);
  return errors;
}
export function contrast(a: string, b: string) {
  const l = (hex: string) => {
    const rgb = hex
      .match(/[a-f0-9]{2}/gi)
      ?.map((x) => parseInt(x, 16) / 255) || [0, 0, 0];
    return rgb
      .map((x) => (x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4))
      .reduce((v, x, i) => v + x * [0.2126, 0.7152, 0.0722][i], 0);
  };
  let x = l(a),
    y = l(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}
export function applyTheme(c: any) {
  const t = c.appearance.theme.colors,
    r = document.documentElement.style;
  document.documentElement.dataset.themeDark =
    contrast(t.background, "#ffffff") > contrast(t.background, "#000000")
      ? "true"
      : "false";
  const set = (k: string, v: string) => r.setProperty("--color-" + k, v);
  const fg = (bg: string) =>
    contrast(bg, "#ffffff") >= 4.5 ? "#ffffff" : "#151A23";
  for (const k of themeTokens)
    set(
      k.replace(/[A-Z]/g, (x) => "-" + x.toLowerCase()),
      t[k],
    );
  const map: any = {
    surface: t.background,
    "surface-bright": t.background,
    "surface-dim": t.alternateBackground,
    "surface-container-lowest": t.surface,
    "surface-container-low": t.alternateBackground,
    "surface-container": t.alternateBackground,
    "surface-container-high": t.alternateBackground,
    "surface-container-highest": t.border,
    "surface-variant": t.alternateBackground,
    "on-surface": t.text,
    "on-surface-variant": t.mutedText,
    "primary-container": t.darkBackground,
    "on-primary": fg(t.primary),
    "on-primary-container": "#c5cee0",
    "secondary-container": t.secondary,
    "on-secondary": fg(t.secondary),
    "on-secondary-container": fg(t.secondary),
    "tertiary-container": t.darkBackground,
    "on-tertiary-container": t.accent,
    "tertiary-fixed-dim": t.accent,
    "tertiary-fixed": t.accent,
    "on-tertiary-fixed": fg(t.accent),
    "outline-variant": t.border,
    outline: t.mutedText,
    "inverse-surface": t.darkBackground,
    "inverse-on-surface": "#f3f6fa",
    "primary-fixed": `color-mix(in srgb, ${t.primary} 20%, ${t.surface})`,
    "primary-fixed-dim": `color-mix(in srgb, ${t.primary} 35%, ${t.surface})`,
    "on-primary-fixed": t.text,
    "on-primary-fixed-variant": t.secondaryText,
    "secondary-fixed": `color-mix(in srgb, ${t.secondary} 25%, #ffffff)`,
    "secondary-fixed-dim": `color-mix(in srgb, ${t.secondary} 45%, #ffffff)`,
    "on-secondary-fixed": t.text,
    "on-secondary-fixed-variant": t.secondary,
    "on-tertiary-fixed-variant": t.accent,
    "surface-tint": t.primary,
  };
  for (const k in map) set(k, map[k]);
  r.setProperty("--heading-font", c.appearance.fonts.heading);
  r.setProperty("--body-font", c.appearance.fonts.body);
  r.setProperty("--logo-font", c.appearance.fonts.logo);
  document.documentElement.dataset.motion = c.appearance.animations.enabled
    ? "on"
    : "off";
  document.documentElement.dataset.mobileMotion = c.appearance.animations.mobile
    ? "on"
    : "off";
  document.documentElement.dataset.density = c.appearance.animations.density;
  document.documentElement.dataset.intensity =
    c.appearance.animations.intensity;
  document.documentElement.dataset.speed = c.appearance.animations.speed;
}
declare global {
  interface Window {
    __CMS_CONTENT: any;
    SITE_CONFIG: any;
  }
}
