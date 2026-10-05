import React from "react";
import {
  HERO_FOCUS,
  HERO_SHAPES,
  HERO_LAYOUTS,
  HERO_DEFAULTS,
  safeURL,
} from "./model";

type Choose = (cb: (v: string) => void) => void;

/** Image slot with live preview, upload/choose and remove buttons. */
function ImageSlot({
  label,
  hint,
  value,
  onChange,
  chooseMedia,
  resolve,
  aspect,
  round,
}: {
  label: string;
  hint: string;
  value: string;
  onChange: (v: string) => void;
  chooseMedia: Choose;
  resolve: (path: string) => string;
  aspect: string;
  round?: boolean;
}) {
  return (
    <div className="hero-slot">
      <strong>{label}</strong>
      <p className="hero-hint">{hint}</p>
      <div
        className={"hero-preview" + (round ? " round" : "")}
        style={{ aspectRatio: aspect }}
      >
        {value && safeURL(value) ? (
          <img src={resolve(value)} alt={label + " preview"} />
        ) : (
          <span>No image</span>
        )}
      </div>
      <div className="hero-actions">
        <button type="button" onClick={() => chooseMedia(onChange)}>
          {value ? "Replace / upload" : "Choose / upload"}
        </button>
        {value && (
          <button type="button" onClick={() => onChange("")}>
            Remove
          </button>
        )}
      </div>
    </div>
  );
}

export function HeroMedia({
  draft,
  update,
  chooseMedia,
  resolve,
}: {
  draft: any;
  update: (fn: (d: any) => void) => void;
  chooseMedia: Choose;
  resolve: (path: string) => string;
}) {
  const hero = { ...HERO_DEFAULTS, ...(draft.hero || {}) };
  const setHero = (patch: Record<string, any>) =>
    update((d) => {
      d.hero = { ...HERO_DEFAULTS, ...(d.hero || {}), ...patch };
    });
  return (
    <fieldset className="hero-media">
      <legend>Hero picture &amp; banner</legend>
      <p className="hero-hint">
        Upload from your phone, tablet or computer. Large photos are resized
        automatically so they stay under the 3&nbsp;MB limit and load quickly.
      </p>
      <div className="hero-grid">
        <ImageSlot
          label="Hero picture"
          hint="Square or portrait photo of you. Shown beside the intro (above it on phones)."
          value={draft.profileImage || ""}
          onChange={(v) => update((d) => (d.profileImage = v))}
          chooseMedia={chooseMedia}
          resolve={resolve}
          aspect="1 / 1"
          round={hero.imageShape === "circle"}
        />
        <ImageSlot
          label="Hero banner"
          hint="Wide image, ideally 2000×800 px or larger. Sits behind the hero text."
          value={hero.banner}
          onChange={(v) => setHero({ banner: v })}
          chooseMedia={chooseMedia}
          resolve={resolve}
          aspect="5 / 2"
        />
        <ImageSlot
          label="Mobile banner (optional)"
          hint="Taller crop used on phones, e.g. 900×1100 px. Leave empty to reuse the banner."
          value={hero.bannerMobile}
          onChange={(v) => setHero({ bannerMobile: v })}
          chooseMedia={chooseMedia}
          resolve={resolve}
          aspect="4 / 5"
        />
      </div>
      <div className="hero-options">
        <label>
          Hero layout
          <select
            value={hero.layout}
            onChange={(e) => setHero({ layout: e.target.value })}
          >
            {HERO_LAYOUTS.map((s) => (
              <option key={s} value={s}>
                {s === "poster"
                  ? "poster — big name, banner behind, cut-out photo at the edge"
                  : "classic — text left, picture right"}
              </option>
            ))}
          </select>
          <small>
            For the poster look use a PNG/WebP with a transparent background and
            set the shape to “cutout”.
          </small>
        </label>
        <label>
          Picture alt text (for screen readers)
          <input
            value={hero.imageAlt}
            placeholder="Portrait of Sreeram S R"
            onChange={(e) => setHero({ imageAlt: e.target.value })}
          />
        </label>
        <label>
          Banner alt text (leave empty if purely decorative)
          <input
            value={hero.bannerAlt}
            onChange={(e) => setHero({ bannerAlt: e.target.value })}
          />
        </label>
        <label>
          Picture shape
          <select
            value={hero.imageShape}
            onChange={(e) => setHero({ imageShape: e.target.value })}
          >
            {HERO_SHAPES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
        <label>
          Picture focus point
          <select
            value={hero.imageFocus}
            onChange={(e) => setHero({ imageFocus: e.target.value })}
          >
            {HERO_FOCUS.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
        <label>
          Banner focus point
          <select
            value={hero.bannerFocus}
            onChange={(e) => setHero({ bannerFocus: e.target.value })}
          >
            {HERO_FOCUS.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
        <label>
          Banner colour wash: {hero.bannerOverlay}%
          <input
            type="range"
            min={0}
            max={90}
            step={5}
            value={hero.bannerOverlay}
            onChange={(e) => setHero({ bannerOverlay: Number(e.target.value) })}
          />
          <small>Higher = easier to read the text over the banner.</small>
        </label>
        <label className="hero-check">
          <input
            type="checkbox"
            checked={hero.showNodes !== false}
            onChange={(e) => setHero({ showNodes: e.target.checked })}
          />
          Show focus-area chips under the picture
        </label>
      </div>
    </fieldset>
  );
}
