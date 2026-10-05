import assert from "node:assert/strict";
import { createRequire } from "node:module";
import fs from "node:fs";
import {
  fontStack,
  FONT_OPTIONS,
  seed,
  normalize,
  validate,
  slug,
  navigationLinks,
  presets,
  clone,
  contrast,
} from "../src/cms/model.ts";
const require = createRequire(import.meta.url),
  serverValidate = require("../api/_lib/validate.js");
const c = seed();
assert.equal(validate(c).length, 0);
assert.equal(serverValidate(c), "");
assert.equal(
  slug("Business Research & Analytics"),
  "business-research-analytics",
);
const before = JSON.stringify(c);
const draft = clone(c);
draft.sections.push({
  id: "research",
  name: "Research",
  navLabel: "Research",
  heading: "Market Research",
  type: "cards",
  visible: true,
  showInNav: true,
  order: 1,
  fields: [],
  items: [],
});
assert(navigationLinks(draft).some((n) => n.href === "#research"));
draft.sections.at(-1).visible = false;
assert(!navigationLinks(draft).some((n) => n.href === "#research"));
assert.equal(JSON.stringify(c), before);
draft.sections.at(-1).visible = true;
draft.sections.at(-1).fields = [
  { key: "focus", label: "Focus", type: "text", value: "Analytics" },
  { key: "focus", label: "Duplicate", type: "text" },
];
assert(validate(draft).some((e) => e.includes("Duplicate")));
assert(serverValidate(draft));
draft.sections.at(-1).fields = [];
draft.appearance.theme.colors.primary = "invalid";
assert(validate(draft).some((e) => e.includes("HEX")));
assert(serverValidate(draft));
for (const t of presets) {
  const d = clone(c);
  d.appearance.theme = clone(t);
  assert.equal(validate(d).length, 0);
  assert(contrast(t.colors.background, t.colors.text) >= 4.5, t.name);
  assert.equal(d.appearance.fonts.heading, c.appearance.fonts.heading);
}
const old = JSON.parse(fs.readFileSync("content/legacy-nila-content.json"));
const migrated = normalize(old);
assert.deepEqual(migrated.legacy, old);
assert.equal(migrated.data.profile.name, old.home.name);
assert.equal(
  normalize({ schemaVersion: 2, data: { profile: { name: "Test" } } }).data
    .profile.name,
  "Test",
);
const jwt = require("../api/_lib/jwt.js");
const secret = "testing-secret-not-for-production";
const token = jwt.sign({ admin: true }, secret, 60);
assert.equal(jwt.verify(token, secret).admin, true);
assert.throws(() => jwt.verify(token + "x", secret));
assert.throws(() => jwt.verify(jwt.sign({ admin: false }, secret, 60), secret));
process.env.ADMIN_PIN = "test-pin";
process.env.SESSION_SECRET = secret;
process.env.SITE_URL = "https://portfolio.test";
const github = require("../api/_lib/github.js");
let saved = c,
  sha = "sha1",
  writes = 0;
github.getFile = async () => ({
  sha,
  contentBase64: Buffer.from(JSON.stringify(saved)).toString("base64"),
});
github.putFile = async (path, data, message, expected) => {
  assert.equal(expected, sha);
  writes++;
  saved = JSON.parse(Buffer.from(data, "base64").toString());
  sha = "sha" + (writes + 1);
  return { commit: { sha: "commit" + writes }, content: { sha } };
};
async function invoke(mod, body, headers = {}, method = "POST") {
  let code = 200,
    result,
    headersOut = {};
  const res = {
    status(n) {
      code = n;
      return this;
    },
    json(o) {
      result = o;
      return this;
    },
    setHeader(k, v) {
      headersOut[k] = v;
    },
    end() {
      return this;
    },
  };
  await require("../api/" + mod)(
    { method, body, headers: { origin: "https://portfolio.test", ...headers } },
    res,
  );
  return { code, result, headersOut };
}
assert.equal((await invoke("publish.js", { content: c })).code, 401);
assert.equal((await invoke("auth/login.js", { pin: "incorrect" })).code, 401);
const login = await invoke("auth/login.js", { pin: "test-pin" });
assert.equal(login.code, 200);
assert(login.headersOut["Set-Cookie"].includes("HttpOnly"));
const auth = { authorization: "Bearer " + login.result.token };
assert.equal((await invoke("auth/session.js", null, auth, "GET")).code, 200);
assert.equal((await invoke("content.js", null, auth, "GET")).result.sha, sha);
assert.equal(
  (await invoke("publish.js", { content: c, expectedSha: "stale" }, auth)).code,
  409,
);
assert.equal(writes, 0);
assert.equal(
  (await invoke("publish.js", { content: c, expectedSha: sha }, auth)).code,
  200,
);
assert.equal(writes, 1);
assert.equal(
  (
    await invoke(
      "publish.js",
      { content: c },
      { ...auth, origin: "https://attacker.test" },
    )
  ).code,
  403,
);
assert.equal(writes, 1);
console.log(
  "PASS: CMS schema, migration, navigation, draft isolation, all themes, contrast, JWT, login, session, publish, optimistic conflicts and origin checks. GitHub calls mocked.",
);
const mediaValidate = require("../api/_lib/media.js");
assert(
  mediaValidate(
    "image/png",
    "media/images/fake.png",
    Buffer.from("not an image").toString("base64"),
  ),
);
assert(
  mediaValidate(
    "image/svg+xml",
    "media/images/unsafe.svg",
    Buffer.from("<svg><script>alert(1)</script></svg>").toString("base64"),
  ),
);
assert.equal(
  mediaValidate(
    "image/svg+xml",
    "media/images/safe.svg",
    Buffer.from(
      '<svg xmlns="http://www.w3.org/2000/svg"><path d="M0 0L10 10"/></svg>',
    ).toString("base64"),
  ),
  "",
);
console.log("PASS: media signatures and restricted SVG validation.");

// Themes and fonts
assert(presets.length >= 24, "expected the extended theme library");
assert.equal(new Set(presets.map((p) => p.id)).size, presets.length);
assert.equal(fontStack("Source Sans 3"), '"Source Sans 3", sans-serif');
assert.equal(fontStack("Georgia"), '"Georgia", serif');
assert(FONT_OPTIONS.length >= 50);
assert.equal(
  new Set(FONT_OPTIONS.map((f) => f.name)).size,
  FONT_OPTIONS.length,
);
