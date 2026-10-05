import React from "react";
import { safeURL } from "./model";
import { SmartImg } from "./media";
function RichText({ value }: { value: string }) {
  const doc = new DOMParser().parseFromString(value || "", "text/html");
  const render = (node: Node, i: number): any => {
    if (node.nodeType === 3) return node.textContent;
    if (node.nodeType !== 1) return null;
    const el = node as Element;
    const tag = el.tagName.toLowerCase();
    if (["script", "style", "iframe", "object", "svg"].includes(tag))
      return null;
    const children = Array.from(node.childNodes).map(render);
    if (
      ![
        "p",
        "br",
        "strong",
        "b",
        "em",
        "i",
        "ul",
        "ol",
        "li",
        "blockquote",
        "a",
      ].includes(tag)
    )
      return children;
    return React.createElement(
      tag,
      {
        key: i,
        ...(tag === "a"
          ? {
              href: safeURL(el.getAttribute("href")),
              rel: "noopener noreferrer",
            }
          : {}),
      },
      tag === "br" ? undefined : children,
    );
  };
  return <div>{Array.from(doc.body.childNodes).map(render)}</div>;
}
export function Fields({ fields = [] }: { fields?: any[] }) {
  return (
    <div className="cms-fields">
      {[...fields]
        .filter((f) => f.visible !== false)
        .sort((a, b) => (a.order || 0) - (b.order || 0))
        .map((f) => (
          <div
            key={f.key}
            className={"cms-field style-" + (f.style || "normal")}
          >
            {f.displayLabel !== false && (
              <span className="cms-field-label">{f.label}</span>
            )}
            {["image"].includes(f.type) ? (
              <SmartImg path={f.value} alt={f.label} loading="lazy" decoding="async" />
            ) : ["url", "file", "email", "phone", "button"].includes(f.type) ? (
              <a
                className={f.type === "button" ? "cms-button" : ""}
                href={safeURL(
                  f.type === "email"
                    ? "mailto:" + f.value
                    : f.type === "phone"
                      ? "tel:" + f.value
                      : f.value,
                )}
                target={f.newTab ? "_blank" : undefined}
                rel="noopener noreferrer"
              >
                {f.buttonText || f.label || f.value}
              </a>
            ) : f.type === "rich-text" ? (
              <RichText value={String(f.value || "")} />
            ) : f.type === "icon" ? (
              <span className="material-symbols-outlined">
                {String(f.value || "")}
              </span>
            ) : f.type === "tags" ? (
              <div className="cms-tags">
                {(Array.isArray(f.value)
                  ? f.value
                  : String(f.value).split(",")
                ).map((v: string, i: number) => (
                  <span key={i}>{v}</span>
                ))}
              </div>
            ) : f.type === "repeater" ? (
              <div>
                {(Array.isArray(f.value) ? f.value : []).map(
                  (item: any, i: number) => (
                    <div key={i}>
                      {typeof item === "object"
                        ? Object.entries(item).map(([k, v]) => (
                            <p key={k}>
                              <b>{k}: </b>
                              {typeof v === "object"
                                ? JSON.stringify(v)
                                : String(v)}
                            </p>
                          ))
                        : String(item)}
                    </div>
                  ),
                )}
              </div>
            ) : (
              <p>
                {typeof f.value === "object"
                  ? JSON.stringify(f.value)
                  : f.type === "toggle"
                    ? f.value
                      ? "Yes"
                      : "No"
                    : String(f.value ?? "")}
              </p>
            )}
          </div>
        ))}
    </div>
  );
}
export function GenericSection({ section: s }: { section: any }) {
  const items = s.items || [];
  return (
    <div className={"cms-generic layout-" + s.type}>
      <p className="cms-eyebrow">{s.name}</p>
      <h2>{s.heading || s.name}</h2>
      {s.subheading && <p className="cms-subheading">{s.subheading}</p>}
      <Fields fields={s.fields} />
      <div className="cms-items">
        {items.map((it: any, i: number) => (
          <article key={i}>
            {it.image && (
              <SmartImg
                loading="lazy"
                decoding="async"
                path={it.image}
                alt={it.title || it.name || ""}
              />
            )}
            <span className="cms-eyebrow">
              {it.period || it.year || it.category}
            </span>
            <h3>{it.title || it.name || it.role || it.degree}</h3>
            {(it.company || it.institution) && (
              <b>{it.company || it.institution}</b>
            )}
            <p>{it.description || it.summary || it.bio}</p>
            {it.value && <strong className="cms-stat">{it.value}</strong>}
            {it.tags && (
              <div className="cms-tags">
                {(Array.isArray(it.tags)
                  ? it.tags
                  : String(it.tags).split(",")
                ).map((t: string, j: number) => (
                  <span key={j}>{t}</span>
                ))}
              </div>
            )}
            {it.bullets && (
              <ul>
                {(Array.isArray(it.bullets)
                  ? it.bullets
                  : String(it.bullets).split("\n")
                ).map((t: string, j: number) => (
                  <li key={j}>{t}</li>
                ))}
              </ul>
            )}
            {it.link && (
              <a href={safeURL(it.link)} rel="noopener noreferrer">
                View details ↗
              </a>
            )}
            <Fields fields={it.fields} />
          </article>
        ))}
      </div>
    </div>
  );
}
