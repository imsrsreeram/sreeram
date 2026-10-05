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

export type FontOption = {
  name: string;
  group: "Sans-serif" | "Serif" | "Display" | "Script" | "Monospace" | "System";
  /** Google Fonts family spec; omitted for system fonts */
  google?: string;
};
/** [family, Google weights]. An empty weight string means "single-weight font". */
type FontDef = [string, string];
const W4 = "400;500;600;700",
  W5 = "400;500;600;700;800",
  W2 = "400;700",
  W1 = "";
const mk = (group: FontOption["group"], defs: FontDef[]): FontOption[] =>
  defs.map(([name, w]) => ({
    name,
    group,
    google: name.replace(/ /g, "+") + (w ? ":wght@" + w : ""),
  }));
export const FONT_OPTIONS: FontOption[] = [
  ...mk("Sans-serif", [
    ["Inter", W5],
    ["Manrope", W5],
    ["Poppins", W5],
    ["Montserrat", W5],
    ["DM Sans", W5],
    ["Plus Jakarta Sans", W5],
    ["Outfit", W5],
    ["Sora", W5],
    ["Lexend", W5],
    ["Work Sans", W5],
    ["Nunito", W5],
    ["Raleway", W5],
    ["Open Sans", W5],
    ["Roboto", W4],
    ["Source Sans 3", W5],
    ["IBM Plex Sans", W4],
    ["Space Grotesk", W4],
    ["Urbanist", W5],
    ["Figtree", W5],
    ["Barlow", W5],
    ["Josefin Sans", W4],
    ["Rubik", W5],
    ["Mulish", W5],
    ["Karla", W5],
    ["Albert Sans", W5],
    ["Red Hat Display", W5],
    ["Epilogue", W5],
    ["Be Vietnam Pro", W5],
    ["Onest", W5],
    ["Instrument Sans", W4],
    ["Hanken Grotesk", W5],
    ["Schibsted Grotesk", W5],
    ["Bricolage Grotesque", W5],
    ["Gabarito", W5],
    ["Lato", W2],
    ["Nunito Sans", W5],
    ["Quicksand", W4],
    ["Cabin", W4],
    ["Exo 2", W5],
    ["Kanit", W5],
    ["Prompt", W5],
    ["Jost", W5],
    ["Archivo", W5],
    ["Public Sans", W5],
    ["Familjen Grotesk", W4],
    ["Wix Madefor Display", W5],
  ]),
  ...mk("Serif", [
    ["Playfair Display", W5],
    ["Merriweather", W2],
    ["Lora", W4],
    ["Cormorant Garamond", W4],
    ["DM Serif Display", W1],
    ["Libre Baskerville", W2],
    ["Fraunces", W5],
    ["Crimson Pro", W5],
    ["EB Garamond", W5],
    ["Bitter", W5],
    ["Noto Serif", W5],
    ["Cormorant", W4],
    ["Libre Caslon Text", W2],
    ["Spectral", W5],
    ["Newsreader", W5],
    ["Young Serif", W1],
    ["Gloock", W1],
    ["Instrument Serif", W1],
    ["Bodoni Moda", W5],
    ["Cinzel", W5],
    ["Marcellus", W1],
    ["Rufina", W2],
    ["Prata", W1],
    ["Italiana", W1],
    ["Yeseva One", W1],
    ["Lustria", W1],
    ["Source Serif 4", W5],
    ["Playfair Display SC", W2],
    ["DM Serif Text", W1],
    ["Abhaya Libre", W5],
    ["Cormorant Upright", W4],
    ["Gilda Display", W1],
  ]),
  ...mk("Display", [
    ["Bebas Neue", W1],
    ["Anton", W1],
    ["Oswald", W4],
    ["Archivo Black", W1],
    ["Abril Fatface", W1],
    ["Big Shoulders Display", W5],
    ["League Spartan", W5],
    ["Syne", W5],
    ["Unbounded", W5],
    ["Righteous", W1],
    ["Bungee", W1],
    ["Teko", W4],
    ["Rajdhani", W4],
    ["Orbitron", W5],
    ["Audiowide", W1],
    ["Michroma", W1],
    ["Russo One", W1],
    ["Passion One", W2],
    ["Alfa Slab One", W1],
    ["Staatliches", W1],
    ["Fjalla One", W1],
    ["Rubik Mono One", W1],
    ["Chakra Petch", W4],
    ["Lilita One", W1],
    ["Titan One", W1],
    ["Poiret One", W1],
    ["Limelight", W1],
    ["Monoton", W1],
    ["Shrikhand", W1],
    ["Bowlby One", W1],
    ["Black Ops One", W1],
    ["Oleo Script", W2],
    ["Rammetto One", W1],
    ["Fredericka the Great", W1],
    ["Gasoek One", W1],
    ["Climate Crisis", W1],
  ]),
  ...mk("Script", [
    ["Great Vibes", W1],
    ["Dancing Script", "400;600;700"],
    ["Allura", W1],
    ["Pacifico", W1],
    ["Satisfy", W1],
    ["Caveat", "400;600;700"],
    ["Sacramento", W1],
    ["Mr Dafoe", W1],
    ["Parisienne", W1],
    ["Tangerine", W2],
    ["Playball", W1],
    ["Kaushan Script", W1],
    ["Yellowtail", W1],
    ["Lobster", W1],
    ["Lobster Two", W2],
    ["Courgette", W1],
    ["Cookie", W1],
    ["Merienda", W4],
    ["Handlee", W1],
    ["Shadows Into Light", W1],
    ["Indie Flower", W1],
    ["Amatic SC", W2],
    ["Patrick Hand", W1],
    ["Marck Script", W1],
    ["Alex Brush", W1],
    ["Pinyon Script", W1],
    ["Rouge Script", W1],
    ["Homemade Apple", W1],
    ["Gloria Hallelujah", W1],
    ["Permanent Marker", W1],
    ["Birthstone", W1],
    ["Italianno", W1],
    ["Niconne", W1],
    ["Norican", W1],
    ["Arizonia", W1],
    ["Rochester", W1],
    ["Berkshire Swash", W1],
    ["Petit Formal Script", W1],
    ["Mea Culpa", W1],
    ["Ephesis", W1],
  ]),
  ...mk("Monospace", [
    ["JetBrains Mono", "400;500;600"],
    ["Space Mono", W2],
    ["Fira Code", "400;500;600"],
    ["IBM Plex Mono", "400;500;600"],
    ["Roboto Mono", "400;500;600"],
    ["Source Code Pro", "400;500;600"],
    ["DM Mono", "400;500"],
    ["Inconsolata", "400;500;600"],
    ["Red Hat Mono", "400;500;600"],
    ["Martian Mono", "400;500;600"],
  ]),
  ...[
    "Arial",
    "Verdana",
    "Trebuchet MS",
    "Tahoma",
    "Georgia",
    "Times New Roman",
    "Palatino Linotype",
    "Courier New",
  ].map((name) => ({ name, group: "System" as const })),
];
const FONT_FALLBACK: Record<string, string> = {
  "Sans-serif": "sans-serif",
  Serif: "serif",
  Display: "sans-serif",
  Script: "cursive",
  Monospace: "monospace",
  System: "sans-serif",
};
/** CSS font-family value (quoted, with a generic fallback). */
export function fontStack(name: string): string {
  const f = FONT_OPTIONS.find((x) => x.name === name);
  const generic = f ? FONT_FALLBACK[f.group] : "sans-serif";
  const fb =
    f?.group === "System" && /Georgia|Times|Palatino/.test(name)
      ? "serif"
      : f?.group === "System" && /Courier/.test(name)
        ? "monospace"
        : generic;
  return `"${String(name).replace(/["\\;{}<>]/g, "")}", ${fb}`;
}
/** Loads a Google font on demand (only the fonts actually selected are downloaded). */
export function ensureFont(name: string) {
  if (typeof document === "undefined") return;
  const f = FONT_OPTIONS.find((x) => x.name === name);
  if (!f?.google) return;
  const id = "gf-" + f.google.split(":")[0];
  if (document.getElementById(id)) return;
  const l = document.createElement("link");
  l.id = id;
  l.rel = "stylesheet";
  l.href =
    "https://fonts.googleapis.com/css2?family=" + f.google + "&display=swap";
  // If Google rejects the weight list for a family, retry with its default weight.
  l.onerror = () => {
    if (l.dataset.retry) return;
    const r = document.createElement("link");
    r.rel = "stylesheet";
    r.dataset.retry = "1";
    r.href =
      "https://fonts.googleapis.com/css2?family=" +
      f.google!.split(":")[0] +
      "&display=swap";
    document.head.append(r);
  };
  document.head.append(l);
}
/**
 * Admin-only: loads tiny glyph-subsets of many families at once so the font
 * browser can preview every font without downloading full font files.
 */
export function loadFontPreviews(names: string[], sample: string) {
  if (typeof document === "undefined") return;
  const text = encodeURIComponent([...new Set(sample + " Aa")].join(""));
  const fams = names
    .map((n) => FONT_OPTIONS.find((x) => x.name === n))
    .filter((f) => f?.google)
    .map((f) => "family=" + f!.google!.split(":")[0]);
  for (let i = 0; i < fams.length; i += 30) {
    const chunk = fams.slice(i, i + 30);
    const id = "gfp-" + chunk.join("&").length + "-" + chunk[0];
    if (document.getElementById(id)) continue;
    const l = document.createElement("link");
    l.id = id;
    l.rel = "stylesheet";
    l.href =
      "https://fonts.googleapis.com/css2?" +
      chunk.join("&") +
      "&text=" +
      text +
      "&display=swap";
    document.head.append(l);
  }
}
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
  extra: Record<string, string> = {},
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
  ...extra,
});
/** Dark preset helper: supplies tuned neutrals instead of the default navy ones. */
const dk = (
  primary: string,
  secondary: string,
  accent: string,
  bg: string,
  text: string,
  surface: string,
  alt: string,
  border: string,
  muted: string,
  dark: string,
) =>
  palette(primary, secondary, accent, bg, text, surface, dark, {
    alternateBackground: alt,
    border,
    mutedText: muted,
    buttonBackground: primary,
    buttonText: bg,
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
  // ---- more light themes ----
  {
    id: "ocean-teal",
    name: "Ocean Teal",
    colors: palette("#0b3c49", "#0e7f8e", "#b4660b", "#f2fafb", "#10272e"),
  },
  {
    id: "royal-purple",
    name: "Royal Purple",
    colors: palette("#2e1a5e", "#6d3fd1", "#0b8a78", "#f8f6ff", "#1d1530"),
  },
  {
    id: "sunset-coral",
    name: "Sunset Coral",
    colors: palette("#3b1d2a", "#d9482f", "#b7701a", "#fff8f3", "#2a1a1a"),
  },
  {
    id: "rose-quartz",
    name: "Rose Quartz",
    colors: palette("#4a2433", "#bf3b64", "#8f6428", "#fff7f9", "#2d1a22"),
  },
  {
    id: "forest-sand",
    name: "Forest & Sand",
    colors: palette("#1f3a2a", "#3f7035", "#a9780b", "#f6f4ea", "#1d2a20"),
  },
  {
    id: "sky-light",
    name: "Sky Light",
    colors: palette("#12395e", "#1b74c4", "#0b8a66", "#f1f8ff", "#12263a"),
  },
  {
    id: "lavender-mist",
    name: "Lavender Mist",
    colors: palette("#3d2f6b", "#7254d0", "#b23a72", "#faf8ff", "#221a3a"),
  },
  {
    id: "espresso-cream",
    name: "Espresso & Cream",
    colors: palette("#3b2a20", "#8c5a3c", "#9d6a1e", "#faf6f1", "#2a1f19"),
  },
  {
    id: "saffron-slate",
    name: "Saffron & Slate",
    colors: palette("#2b2a33", "#c4620a", "#2a7a68", "#fffaf1", "#25222b"),
  },
  {
    id: "mono-ink",
    name: "Mono Ink",
    colors: palette("#111111", "#3f3f46", "#a14c07", "#f5f5f4", "#111111"),
  },
  // ---- dark themes ----
  {
    id: "crimson-noir",
    name: "Crimson Noir",
    colors: dk(
      "#f5eeee",
      "#ff3b47",
      "#ff8a8a",
      "#0b0708",
      "#f5eeee",
      "#171011",
      "#1c1213",
      "#3a2326",
      "#b9a5a7",
      "#050303",
    ),
  },
  {
    id: "midnight-gold",
    name: "Midnight Gold",
    colors: dk(
      "#f5e6c0",
      "#e0b04a",
      "#7dd3b0",
      "#0c1018",
      "#eef0f5",
      "#151b27",
      "#1b2333",
      "#34405a",
      "#aab3c5",
      "#070a10",
    ),
  },
  {
    id: "indigo-dusk",
    name: "Indigo Dusk",
    colors: dk(
      "#e4e7ff",
      "#8b9bff",
      "#5eead4",
      "#0f1226",
      "#eceefe",
      "#181c3a",
      "#1f2447",
      "#3a4180",
      "#aeb4e0",
      "#0a0c1c",
    ),
  },
  {
    id: "neon-cyber",
    name: "Neon Cyber",
    colors: dk(
      "#e8fff9",
      "#22d3ee",
      "#a3e635",
      "#06121a",
      "#e6f7fb",
      "#0d1f2b",
      "#12293a",
      "#1f4358",
      "#9ac3d1",
      "#030a10",
    ),
  },
  {
    id: "forest-night",
    name: "Forest Night",
    colors: dk(
      "#e6f4ea",
      "#4ade80",
      "#facc15",
      "#0a1410",
      "#e8f3ec",
      "#12211a",
      "#182c22",
      "#2c4a3a",
      "#a3bfae",
      "#060d0a",
    ),
  },
  {
    id: "plum-night",
    name: "Plum Night",
    colors: dk(
      "#f6e8f7",
      "#e879f9",
      "#fbbf77",
      "#150b19",
      "#f4e9f6",
      "#21122a",
      "#2a1836",
      "#4e2d63",
      "#c3a8cb",
      "#0c0610",
    ),
  },
  // ---- extra light themes ----
  {
    id: "mint-fresh",
    name: "Mint Fresh",
    colors: palette("#0f4c3a", "#0b7a56", "#c2410c", "#f1fbf6", "#12302a"),
  },
  {
    id: "peach-blossom",
    name: "Peach Blossom",
    colors: palette("#6b2d1f", "#c2410c", "#a16207", "#fff4ed", "#3a1d14"),
  },
  {
    id: "lemon-zest",
    name: "Lemon Zest",
    colors: palette("#3f3a0a", "#8a6d00", "#0f766e", "#fffdf0", "#2b2808"),
  },
  {
    id: "arctic-blue",
    name: "Arctic Blue",
    colors: palette("#0c3b66", "#0369a1", "#0f766e", "#f0f8ff", "#0d2a44"),
  },
  {
    id: "terracotta-studio",
    name: "Terracotta Studio",
    colors: palette("#5a2a1c", "#b4492a", "#3f6b5b", "#fbf3ec", "#33211a"),
  },
  {
    id: "olive-grove",
    name: "Olive Grove",
    colors: palette("#34401a", "#617a1f", "#a1531b", "#f7f8ee", "#252d14"),
  },
  {
    id: "cherry-blossom",
    name: "Cherry Blossom",
    colors: palette("#6d1b3d", "#c02667", "#7c5cc4", "#fff1f6", "#3d1226"),
  },
  {
    id: "cobalt-pop",
    name: "Cobalt Pop",
    colors: palette("#10206b", "#2447e0", "#e0561a", "#f5f7ff", "#121a45"),
  },
  {
    id: "aqua-breeze",
    name: "Aqua Breeze",
    colors: palette("#064e5a", "#08788a", "#d9480f", "#effcfd", "#0b3038"),
  },
  {
    id: "mocha-latte",
    name: "Mocha Latte",
    colors: palette("#43302b", "#8a5a44", "#2f6f62", "#f8f1ea", "#33241f", "#ffffff", "#101820", { mutedText: "#5b6478" }),
  },
  {
    id: "coral-reef",
    name: "Coral Reef",
    colors: palette("#0e3a57", "#c93a26", "#0c8f8f", "#fff6f2", "#12304a"),
  },
  {
    id: "lilac-dream",
    name: "Lilac Dream",
    colors: palette("#3b2a6b", "#7e4fd6", "#c0306b", "#f7f3ff", "#261a47"),
  },
  {
    id: "sandstone-gold",
    name: "Sandstone Gold",
    colors: palette("#4a3410", "#8a5d06", "#2f5d8a", "#faf5e9", "#33260e"),
  },
  {
    id: "ruby-ivory",
    name: "Ruby & Ivory",
    colors: palette("#5c0f1f", "#b3153a", "#8a6a1f", "#fffaf3", "#3a1018"),
  },
  {
    id: "slate-sky",
    name: "Slate & Sky",
    colors: palette("#1f2a3a", "#2468b5", "#b45309", "#f4f7fb", "#1a2432"),
  },
  {
    id: "jade-garden",
    name: "Jade Garden",
    colors: palette("#0c3d33", "#0a7a60", "#a6430f", "#f0faf6", "#0f2c26"),
  },
  // ---- extra dark themes ----
  {
    id: "obsidian-emerald",
    name: "Obsidian Emerald",
    colors: dk(
      "#d7fbe8",
      "#34d399",
      "#fcd34d",
      "#070d0b",
      "#e6f6ee",
      "#0f1a16",
      "#15251f",
      "#244237",
      "#9bbfae",
      "#030706",
    ),
  },
  {
    id: "aurora-violet",
    name: "Aurora Violet",
    colors: dk(
      "#efe6ff",
      "#a78bfa",
      "#5eead4",
      "#0d0a1c",
      "#eee9fb",
      "#171230",
      "#1f1942",
      "#3b3170",
      "#b6addb",
      "#07050f",
    ),
  },
  {
    id: "deep-ocean",
    name: "Deep Ocean",
    colors: dk(
      "#dff3ff",
      "#38bdf8",
      "#fb923c",
      "#06111c",
      "#e4f1fb",
      "#0b1c2c",
      "#102639",
      "#1f4262",
      "#9cbbd3",
      "#030a12",
    ),
  },
  {
    id: "ember-glow",
    name: "Ember Glow",
    colors: dk(
      "#fff0e3",
      "#fb923c",
      "#fde047",
      "#120a06",
      "#f7ece2",
      "#1e120b",
      "#2a1910",
      "#4d3020",
      "#cdb09b",
      "#080402",
    ),
  },
  {
    id: "slate-rose",
    name: "Slate Rose",
    colors: dk(
      "#ffe4ec",
      "#fb7185",
      "#fcd34d",
      "#0f1118",
      "#f1e9ed",
      "#181b26",
      "#212534",
      "#3b4157",
      "#b4b8c9",
      "#080a10",
    ),
  },
  {
    id: "matrix-green",
    name: "Matrix Green",
    colors: dk(
      "#d8ffe0",
      "#22c55e",
      "#a3e635",
      "#030a05",
      "#d9f7e0",
      "#08140b",
      "#0d1f11",
      "#17402a",
      "#88c29a",
      "#010502",
    ),
  },
  {
    id: "twilight-teal",
    name: "Twilight Teal",
    colors: dk(
      "#dcfdfa",
      "#2dd4bf",
      "#f9a8d4",
      "#07141a",
      "#e0f4f5",
      "#0d212a",
      "#132e3a",
      "#22505f",
      "#95bec5",
      "#030a0e",
    ),
  },
  {
    id: "plum-velvet",
    name: "Plum Velvet",
    colors: dk(
      "#fde7f3",
      "#f472b6",
      "#fbbf24",
      "#14091a",
      "#f5e8f3",
      "#201128",
      "#2c1938",
      "#533068",
      "#c9a8cf",
      "#0a040e",
    ),
  },
  {
    id: "carbon-orange",
    name: "Carbon Orange",
    colors: dk(
      "#ffeedd",
      "#ff7a1a",
      "#38bdf8",
      "#0d0d0f",
      "#f2f2f3",
      "#17171b",
      "#212127",
      "#3a3a44",
      "#b0b0ba",
      "#050506",
    ),
  },
  {
    id: "nordic-night",
    name: "Nordic Night",
    colors: dk(
      "#e5ecf6",
      "#88c0d0",
      "#ebcb8b",
      "#1b222d",
      "#e8edf4",
      "#232c39",
      "#2b3646",
      "#46556d",
      "#a9b6c8",
      "#10151c",
    ),
  },
  {
    id: "sapphire-night",
    name: "Sapphire Night",
    colors: dk(
      "#e3ebff",
      "#6b8cff",
      "#f0abfc",
      "#070b1a",
      "#e8edfd",
      "#0e1530",
      "#141d42",
      "#27356f",
      "#a2afd8",
      "#03050d",
    ),
  },
  {
    id: "onyx-gold",
    name: "Onyx & Gold",
    colors: dk(
      "#f8ecc9",
      "#d4a73a",
      "#9ad1c0",
      "#0a0a0a",
      "#efeadd",
      "#151515",
      "#1e1d1a",
      "#3a372f",
      "#b5ae9b",
      "#040404",
    ),
  },
  {
    id: "wine-cellar",
    name: "Wine Cellar",
    colors: dk(
      "#ffe6ea",
      "#e5486b",
      "#e9c46a",
      "#150709",
      "#f6e8ea",
      "#210d11",
      "#2e1319",
      "#552632",
      "#c8a5ad",
      "#0a0305",
    ),
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
    hero: clone(HERO_DEFAULTS),
  };
}
/** Settings for the hero picture (content.profileImage) and hero banner. */
export const HERO_DEFAULTS = {
  imageAlt: "",
  layout: "classic", // classic | poster (banner-led, large cut-out photo)
  imageShape: "circle", // circle | rounded | square | cutout
  imageFocus: "center", // object-position keyword
  showNodes: true, // keep the interactive focus-area chips beside the picture
  banner: "",
  bannerMobile: "", // optional portrait/cropped version for phones
  bannerAlt: "",
  bannerOverlay: 75, // 0-90 : how much theme colour washes over the banner
  bannerFocus: "center",
};
export const HERO_FOCUS = [
  "center",
  "top",
  "bottom",
  "left",
  "right",
  "top left",
  "top right",
  "bottom left",
  "bottom right",
];
export const HERO_SHAPES = ["circle", "rounded", "square", "cutout"];
export const HERO_LAYOUTS = ["classic", "poster"];
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
  for (const [label, v] of [
    ["Hero picture", c.profileImage],
    ["Hero banner", c.hero?.banner],
    ["Mobile hero banner", c.hero?.bannerMobile],
  ] as [string, any][])
    if (v && !safeURL(v)) errors.push("Invalid image path: " + label);
  const ov = Number(c.hero?.bannerOverlay ?? 75);
  if (!(ov >= 0 && ov <= 90))
    errors.push("Banner overlay must be between 0 and 90.");
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
  for (const k of ["heading", "body", "logo"] as const) {
    ensureFont(c.appearance.fonts[k]);
    r.setProperty("--" + k + "-font", fontStack(c.appearance.fonts[k]));
  }
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
