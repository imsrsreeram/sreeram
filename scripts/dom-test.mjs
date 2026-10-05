import { JSDOM } from "jsdom";
import { build } from "esbuild";
import fs from "node:fs";
import { createRequire } from "node:module";
import assert from "node:assert/strict";
const require = createRequire(import.meta.url);
const dom = new JSDOM(
  '<!doctype html><html><head></head><body><div id="root"></div></body></html>',
  { url: "https://portfolio.test/?preview=1", pretendToBeVisual: true },
);
for (const name of [
  "window",
  "document",
  "localStorage",
  "sessionStorage",
  "location",
  "DOMParser",
  "Node",
  "HTMLElement",
  "MouseEvent",
  "MessageEvent",
  "Event",
])
  globalThis[name] = dom.window[name];
Object.defineProperty(globalThis, "navigator", {
  value: dom.window.navigator,
  configurable: true,
});
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
window.matchMedia = () => ({
  matches: false,
  addEventListener() {},
  removeEventListener() {},
});
globalThis.IntersectionObserver = class {
  observe(el) {
    el.classList.add("revealed");
  }
  unobserve() {}
  disconnect() {}
};
window.confirm = globalThis.confirm = () => true;
window.alert = globalThis.alert = () => {};
window.SITE_CONFIG = { API_BASE_URL: "" };
let content = JSON.parse(fs.readFileSync("content/site-content.json"));
globalThis.fetch = async () => ({
  ok: true,
  json: async () => structuredClone(content),
});
await build({
  entryPoints: ["src/App.tsx", "src/cms/Admin.tsx"],
  bundle: true,
  platform: "node",
  format: "cjs",
  outdir: "node_modules/.cms-dom-test",
  external: ["react", "react-dom"],
  jsx: "automatic",
  loader: { ".css": "empty" },
  logLevel: "silent",
});
const React = require("react"),
  { createRoot } = require("react-dom/client"),
  { act } = React;
const App = require("../node_modules/.cms-dom-test/App.js").default,
  Admin = require("../node_modules/.cms-dom-test/cms/Admin.js").default;
let root = createRoot(document.getElementById("root"));
await act(async () => {
  root.render(React.createElement(App));
  await new Promise((r) => setTimeout(r, 10));
});
assert.equal(document.querySelectorAll(".cms-section").length, 11);
assert(document.body.textContent.includes("Sreeram S R"));
assert.equal(
  new Set([...document.querySelectorAll("[id]")].map((el) => el.id)).size,
  document.querySelectorAll("[id]").length,
  "duplicate DOM IDs",
);
const draft = structuredClone(content);
draft.data.profile.name = "CMS Updated Name";
draft.sections.push({
  id: "research",
  name: "Research",
  heading: "Market Analysis",
  navLabel: "Research",
  visible: true,
  showInNav: true,
  order: 0,
  type: "cards",
  fields: [
    {
      key: "focus",
      label: "Focus",
      type: "text",
      value: "Analytics test",
      visible: true,
    },
  ],
  items: [],
});
await act(async () => {
  window.dispatchEvent(
    new MessageEvent("message", {
      origin: location.origin,
      data: { type: "cms-preview", content: draft },
    }),
  );
});
assert(
  document.querySelector("#research").textContent.includes("Analytics test"),
);
assert(
  [...document.querySelectorAll("header a")].some(
    (el) => el.getAttribute("href") === "#research",
  ),
);
assert(document.body.textContent.includes("CMS Updated Name"));
assert.equal(content.data.profile.name, "Sreeram S R");
draft.sections.at(-1).visible = false;
await act(async () => {
  window.dispatchEvent(
    new MessageEvent("message", {
      origin: location.origin,
      data: { type: "cms-preview", content: draft },
    }),
  );
});
assert(!document.querySelector("#research"));
assert(!document.querySelector('header a[href="#research"]'));
await act(async () => root.unmount());
dom.reconfigure({ url: "https://portfolio.test/admin/?demo=1" });
root = createRoot(document.getElementById("root"));
await act(async () => {
  root.render(React.createElement(Admin));
  await new Promise((r) => setTimeout(r, 10));
});
assert(document.body.textContent.includes("Dashboard"));
const button = (name) =>
  [...document.querySelectorAll("button")].find((b) => b.textContent === name);
await act(async () => button("+ Add New Section").click());
assert(document.body.textContent.includes("Section Settings"));
await act(async () => button("+ Add Custom Field").click());
let saved = JSON.parse(localStorage.getItem("portfolio-cms-draft-v2"));
assert.equal(saved.sections.at(-1).fields.length, 1);
await act(async () => button("Duplicate Section").click());
saved = JSON.parse(localStorage.getItem("portfolio-cms-draft-v2"));
assert.equal(saved.sections.length, 13);
assert.notEqual(saved.sections.at(-1).id, saved.sections.at(-2).id);
await act(async () => button("Theme Manager").click());
const card = [...document.querySelectorAll(".theme-card")].find((el) =>
  el.textContent.includes("Burgundy Executive"),
);
await act(async () =>
  [...card.querySelectorAll("button")]
    .find((b) => b.textContent === "Apply Theme")
    .click(),
);
saved = JSON.parse(localStorage.getItem("portfolio-cms-draft-v2"));
assert.equal(saved.appearance.theme.id, "burgundy-executive");
assert.equal(saved.appearance.fonts.heading, content.appearance.fonts.heading);
await act(async () => root.unmount());
console.log(
  "PASS: React DOM rendering, original sections, unique anchors, content/section preview, dynamic nav hiding, custom fields, duplication, theme selection, font preservation, and local draft isolation. Layout screenshots not tested.",
);
