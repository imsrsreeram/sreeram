import React, { useEffect, useState } from "react";
import { safeURL } from "./model";

/** Public GitHub raw base for this site's repository ("" when not configured). */
export function rawBase(): string {
  const c = (typeof window !== "undefined" && (window as any).SITE_CONFIG) || {};
  return /^[\w.-]+\/[\w.-]+$/.test(c.GITHUB_REPO || "")
    ? `https://raw.githubusercontent.com/${c.GITHUB_REPO}/${c.GITHUB_BRANCH || "main"}/`
    : "";
}

/**
 * Every address a media path can be loaded from, best first.
 * A freshly uploaded image exists in GitHub straight away, but not in the
 * deployed site until the next rebuild finishes, so we fall back between the
 * two instead of showing a broken picture.
 */
export function mediaCandidates(path: any): string[] {
  const v = safeURL(path);
  if (!v) return [];
  const base = rawBase();
  if (/^https?:\/\//i.test(v)) {
    return base && v.startsWith(base) ? [v, "./" + v.slice(base.length)] : [v];
  }
  if (/^(\.\/)?media\//i.test(v)) {
    const rel = v.startsWith("./") ? v : "./" + v;
    return base ? [rel, base + v.replace(/^\.\//, "")] : [rel];
  }
  return [v];
}

/** Resolves a media path to a working URL, trying each candidate in turn. */
export function useMedia(path: any) {
  const [st, setSt] = useState({ p: path, i: 0 });
  const list = React.useMemo(() => mediaCandidates(path), [path]);
  const i = st.p === path ? st.i : 0;
  return {
    src: list[i] || "",
    failed: i >= list.length,
    onError: () => setSt({ p: path, i: i + 1 }),
  };
}

export function useMediaQuery(query: string): boolean {
  const get = () =>
    typeof window !== "undefined" && !!window.matchMedia?.(query).matches;
  const [m, setM] = useState(get);
  useEffect(() => {
    const mq = window.matchMedia?.(query);
    if (!mq) return;
    const on = () => setM(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, [query]);
  return m;
}

/** <img> that survives a not-yet-deployed upload by trying the GitHub copy. */
export function SmartImg({
  path,
  ...rest
}: { path: any } & React.ImgHTMLAttributes<HTMLImageElement>) {
  const m = useMedia(path);
  if (m.failed) return null;
  return <img {...rest} src={m.src} onError={m.onError} />;
}
