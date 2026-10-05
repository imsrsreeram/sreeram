# Sreeram Portfolio + Portfolio Studio CMS

This project combines the supplied MBA frontend components with the supplied Nila GitHub/Vercel admin API. The source projects and attachments were not modified.

## Quick local preview

Requires Node.js 22 or newer.

```bash
npm ci
npm run dev
```

Open `http://localhost:3000/` for the portfolio, and `http://localhost:3000/admin/?demo=1` for the offline editor demo. The demo supports editing, locally saved drafts, previews and JSON export. It does **not** authenticate, upload files or publish. Public content is unchanged by demo edits.

Do not open index.html by double-clicking: the app loads JSON and modules over HTTP.

## What is included

- Original hero, academic cards, capability filtering, project detail interactions, industry flow, certifications, functional diagrams, strategic data graphics, marquee and contact layouts.
- Original editorial copy moved into editable content; original illustrative data retained.
- Dynamic section/navigation configuration: add, duplicate, show/hide, reorder, drag/drop and mobile arrow controls.
- Reusable content, cards, timeline, projects, statistics, gallery, certifications, logos, testimonials, process, two-column, list and CTA layouts. Some related layouts intentionally share the same card/list renderer.
- Typed custom fields, per-item fields, repeaters, safe rich text, images, files, tags and links. Rich text permits simple HTML formatting; scripts and unsupported elements are discarded.
- Seven requested theme presets plus the original Stitch palette. Custom colour tokens, visual preset cards, live draft preview, contrast warning, custom theme save/rename/duplicate/delete, import/export and reset.
- Separate fonts, animation controls and reduced-motion handling. Density/intensity affect the ambient visual opacity; the source frontend does not expose a discrete particle-count engine.
- Browser draft recovery; explicit publishing; same-origin preview messaging.
- Server PIN verification, signed sessions, HttpOnly secure cookies, bearer sessions stored in sessionStorage, origin checks, per-instance login throttling and optimistic publish conflict detection.
- GitHub media storage; JPG, PNG, WebP, restricted geometric SVG and PDF; filename/type/signature validation; 3 MB maximum upload.
- Resume selection, media library and SEO metadata.
- Existing Nila content retained in `content/legacy-nila-content.json`, and its original media retained under `media/`. Importing the old JSON maps its content and retains the complete original object under `legacy`.

## Deploy the frontend with GitHub Pages

1. Create or choose the repository for this portfolio.
2. Upload the **contents of this project folder** into the repository root. Do not upload `node_modules`. Do not put the whole folder inside another folder.
3. Keep the `.github/workflows/pages.yml` file. The repository branch should be `main`, or update the workflow branch accordingly.
4. In repository Settings → Pages, choose **GitHub Actions** as the source.
5. The supplied workflow installs dependencies, checks TypeScript, runs tests, builds and deploys `dist`.
6. The portfolio appears at the Pages URL; the admin is at the same URL followed by `/admin/`.

The relative build paths support both account-root and repository-subdirectory URLs. The `dist/` folder is an already compiled copy for inspection, but future content publishes must run the supplied build workflow.

## Deploy the admin API with Vercel

Import the same repository into Vercel. The root `vercel.json` selects the Vite build and `dist` output; `/api` contains the serverless functions and its own CommonJS package boundary.

Set these values **in Vercel environment variables only**:

| Key | Value |
| --- | --- |
| GITHUB_TOKEN | Fine-grained GitHub token with Contents read/write on this repository only |
| GITHUB_OWNER | Repository account/organisation |
| GITHUB_REPO | Repository name, without the owner |
| GITHUB_BRANCH | `main`, or your branch |
| ADMIN_PIN | A long, hard-to-guess admin password/PIN |
| SESSION_SECRET | At least 32 random bytes encoded as a string |
| SITE_URL | Exact public frontend URL; the API uses its origin for CORS |

The login throttle is per running serverless instance; it is not a distributed rate limiter. Use a strong admin password and Vercel platform protections as appropriate.

Edit `public/config.js` in GitHub, with only the public configuration:

```js
window.SITE_CONFIG = {
  API_BASE_URL: "https://YOUR-API-PROJECT.vercel.app",
  GITHUB_REPO: "YOUR-OWNER/YOUR-REPOSITORY",
  GITHUB_BRANCH: "main"
};
```

Redeploy after configuring these values. Never put ADMIN_PIN, SESSION_SECRET or GITHUB_TOKEN into config.js, public files or content JSON. The delivered config is deliberately blank because your deployment credentials and target repository were not supplied.

## Editing and publishing

1. Open `/admin/` and enter the configured PIN.
2. Edit content, sections, custom fields, colours, fonts or animations.
3. Use Preview. The iframe shows unpublished data, sent only from the same origin.
4. Use Save Draft to save on this device. Drafts are local; they do not sync across devices.
5. Use Publish Changes. The authenticated API validates content and commits `content/site-content.json` to GitHub.
6. GitHub Actions rebuilds Pages. Live changes appear when that deployment finishes.

Media uploads are committed immediately, but they appear in portfolio content only once the draft referencing them is published. Media deletion is immediate and can break published references; replace those references before deleting files.

Original template contact information includes a placeholder email and phone. Replace these with Sreeram's verified details before launch. The contact form opens an email draft in the visitor's mail client; it is not a server mail service. The uploaded Nila resume belongs to the old project and is intentionally not assigned to Sreeram. Upload his correct resume.

## Content and design

`content/site-content.json` is the canonical publish target. `npm run build` copies that content and `media/` into the static bundle. Do not edit `public/content` or `dist/content` as the canonical source.

`src/cms/model.ts` defines the schema, defaults, migration, section ordering, navigation, themes and client validation. `api/_lib/validate.js` validates published content server-side. `src/cms/Fields.tsx` renders custom fields and generic layouts. `src/cms/Forms.tsx` supplies reusable editor controls. `src/cms/Admin.tsx` coordinates editing, media, previews and publishing. Original frontend components are in `src/components`.

Custom sections need no source edits. Introducing a genuinely new layout type requires extending the renderer, rather than just adding a CMS section.

## Validation performed

```bash
npm run lint
npm test
npm run build
```

Passed: TypeScript, production build, schema/defaults, old-content preservation and migration, dynamic navigation, slugging, draft isolation, preset theme tokens and contrast, font preservation, duplicate field/colour validation, media signature/restricted SVG checks, real PIN/session/publish handlers with mocked GitHub, origin rejection and stale publish conflicts.

React DOM tests also passed: original components render, unique anchors, content/section preview changes, hidden-section navigation removal, section duplication, custom fields, theme selection and local draft recovery.

**Not verified:** pixel-level desktop/mobile layout in a real browser, real GitHub commits, deployed Vercel authentication/CORS, real media uploads, real GitHub Pages rebuilds and the complete 57-step acceptance list. Chromium download was unavailable in the build environment; no browser screenshots are claimed. Test the connected deployment before using it as a production admin.

A browser smoke test is supplied for an environment with Chromium:

```bash
npx playwright install chromium
npm run build
npm run test:browser
```

The browser test uses intercepted local build assets and offline demo content; it does not publish to GitHub. Passing it still does not verify the deployed API.


## Update notes

- **Live updates:** after you press Publish, visitors see the new content within about a minute. The page reads the newest `content/site-content.json` (and newly uploaded images) straight from the repository and the normal GitHub Pages rebuild catches up afterwards.
- **Tests no longer depend on your content,** so adding sections in the admin can't make the deployment workflow fail.
- **Hero:** picture, banner, optional mobile banner, `classic` or `poster` layout, `cutout` shape for transparent PNG/WebP photos.
- **Uploads** are resized to 2000 px and converted to WebP automatically.
- **Themes:** 24 presets (light and dark). **Fonts:** about 55 families; Google fonts download only when selected.
