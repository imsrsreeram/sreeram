import React from "react";
import { clone, fieldTypes } from "./model";
const pretty = (s: string) =>
  s
    .replace(/([A-Z])/g, " $1")
    .replace(/[-_]/g, " ")
    .replace(/^./, (s) => s.toUpperCase());
export function ValueEditor({
  value,
  onChange,
  label = "Content",
  chooseMedia,
}: {
  value: any;
  onChange: (v: any) => void;
  label?: string;
  chooseMedia?: (cb: (v: string) => void) => void;
}) {
  if (Array.isArray(value))
    return (
      <fieldset>
        <legend>{pretty(label)}</legend>
        {value.map((v, i) => (
          <div className="repeat-item" key={i}>
            <div className="row">
              <b>Item {i + 1}</b>
              <button
                onClick={() => {
                  const a = clone(value);
                  a.splice(i, 0, clone(v));
                  onChange(a);
                }}
              >
                Duplicate
              </button>
              <button
                disabled={!i}
                onClick={() => {
                  const a = clone(value);
                  [a[i - 1], a[i]] = [a[i], a[i - 1]];
                  onChange(a);
                }}
              >
                ↑
              </button>
              <button
                disabled={i === value.length - 1}
                onClick={() => {
                  const a = clone(value);
                  [a[i + 1], a[i]] = [a[i], a[i + 1]];
                  onChange(a);
                }}
              >
                ↓
              </button>
              <button
                onClick={() => {
                  if (confirm("Delete this item?"))
                    onChange(value.filter((_, j) => j !== i));
                }}
              >
                Delete
              </button>
            </div>
            <ValueEditor
              value={v}
              label="Details"
              chooseMedia={chooseMedia}
              onChange={(v) => {
                const a = clone(value);
                a[i] = v;
                onChange(a);
              }}
            />
          </div>
        ))}
        <button
          onClick={() => {
            const blank = (x: any): any =>
              Array.isArray(x)
                ? []
                : x && typeof x === "object"
                  ? Object.fromEntries(
                      Object.entries(x).map(([k, v]) => [k, blank(v)]),
                    )
                  : typeof x === "number"
                    ? 0
                    : typeof x === "boolean"
                      ? true
                      : "";
            onChange([
              ...value,
              value.length
                ? blank(value[0])
                : {
                    title: "",
                    description: "",
                    image: "",
                    link: "",
                    tags: [],
                    fields: [],
                  },
            ]);
          }}
        >
          + Add {pretty(label).replace(/s$/, "")}
        </button>
      </fieldset>
    );
  if (value && typeof value === "object")
    return (
      <div className="object-fields">
        {Object.entries(value).map(([k, v]) =>
          k === "fields" && Array.isArray(v) && chooseMedia ? (
            <CustomFields
              key={k}
              fields={v}
              chooseMedia={chooseMedia}
              onChange={(v) => onChange({ ...value, fields: v })}
            />
          ) : (
            <ValueEditor
              key={k}
              value={v}
              label={k}
              chooseMedia={chooseMedia}
              onChange={(v) => onChange({ ...value, [k]: v })}
            />
          ),
        )}
        <button
          onClick={() => {
            const k = prompt(
              "New data field key (letters, numbers and underscores)",
            );
            if (k && /^[a-zA-Z][a-zA-Z0-9_]*$/.test(k) && !(k in value))
              onChange({ ...value, [k]: "" });
          }}
        >
          + Add Data Field
        </button>
      </div>
    );
  const media = /image|photo|resume|favicon/i.test(label);
  return (
    <label className="input-label">
      {pretty(label)}
      {typeof value === "boolean" ? (
        <input
          type="checkbox"
          checked={value}
          onChange={(e) => onChange(e.target.checked)}
        />
      ) : typeof value === "number" ? (
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
        />
      ) : String(value || "").length > 100 ||
        /description|bio|summary|details/i.test(label) ? (
        <textarea
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input value={value ?? ""} onChange={(e) => onChange(e.target.value)} />
      )}{" "}
      {media && chooseMedia && (
        <button onClick={() => chooseMedia(onChange)}>
          Choose / Upload Media
        </button>
      )}
    </label>
  );
}
export function CustomFields({
  fields,
  onChange,
  chooseMedia,
}: {
  fields: any[];
  onChange: (a: any[]) => void;
  chooseMedia: (cb: (v: string) => void) => void;
}) {
  return (
    <fieldset>
      <legend>Custom fields</legend>
      {fields.map((f, i) => {
        const set = (patch: any) =>
          onChange(fields.map((x, j) => (j === i ? { ...x, ...patch } : x)));
        return (
          <div className="repeat-item" key={i}>
            <div className="row">
              <b>{f.label || "New field"}</b>
              <button
                onClick={() => {
                  const a = clone(fields);
                  if (i) {
                    [a[i - 1], a[i]] = [a[i], a[i - 1]];
                    a.forEach((v, j) => (v.order = j));
                    onChange(a);
                  }
                }}
              >
                ↑
              </button>
              <button
                onClick={() => {
                  const a = clone(fields);
                  if (i < a.length - 1) {
                    [a[i + 1], a[i]] = [a[i], a[i + 1]];
                    a.forEach((v, j) => (v.order = j));
                    onChange(a);
                  }
                }}
              >
                ↓
              </button>
              <button
                onClick={() => onChange(fields.filter((_, j) => i !== j))}
              >
                Remove field
              </button>
            </div>
            <div className="form-grid">
              <ValueEditor
                label="Field label"
                value={f.label}
                onChange={(v) => set({ label: v })}
              />
              <ValueEditor
                label="Field key"
                value={f.key}
                onChange={(v) => set({ key: v })}
              />
              <label>
                Type
                <select
                  value={f.type}
                  onChange={(e) =>
                    set({
                      type: e.target.value,
                      value:
                        e.target.value === "repeater"
                          ? []
                          : e.target.value === "toggle"
                            ? false
                            : e.target.value === "number"
                              ? 0
                              : "",
                    })
                  }
                >
                  {fieldTypes.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </label>
              <label>
                Presentation
                <select
                  value={f.style}
                  onChange={(e) => set({ style: e.target.value })}
                >
                  {[
                    "normal",
                    "highlighted",
                    "badge",
                    "statistic",
                    "card",
                    "button",
                    "link",
                    "tag",
                    "image",
                    "info",
                  ].map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </label>
              <ValueEditor
                label="Visible"
                value={f.visible}
                onChange={(v) => set({ visible: v })}
              />
              <ValueEditor
                label="Display label"
                value={f.displayLabel}
                onChange={(v) => set({ displayLabel: v })}
              />
            </div>
            {f.type === "select" ? (
              <>
                <ValueEditor
                  label="Options (comma separated)"
                  value={f.options || ""}
                  onChange={(v) => set({ options: v })}
                />
                <select
                  value={f.value}
                  onChange={(e) => set({ value: e.target.value })}
                >
                  <option value="">Choose…</option>
                  {String(f.options || "")
                    .split(",")
                    .map((o) => (
                      <option key={o}>{o.trim()}</option>
                    ))}
                </select>
              </>
            ) : (
              <ValueEditor
                label={
                  f.type === "image"
                    ? "Image URL"
                    : f.type === "file"
                      ? "File URL"
                      : ["long-text", "rich-text"].includes(f.type)
                        ? "Description / Rich Text"
                        : "Value"
                }
                value={f.value}
                onChange={(v) => set({ value: v })}
              />
            )}{" "}
            {["image", "file"].includes(f.type) && (
              <button onClick={() => chooseMedia((v) => set({ value: v }))}>
                Upload New / Choose Existing
              </button>
            )}
            {["button", "url", "file"].includes(f.type) && (
              <>
                <ValueEditor
                  label="Button text"
                  value={f.buttonText || ""}
                  onChange={(v) => set({ buttonText: v })}
                />
                <ValueEditor
                  label="Open in new tab"
                  value={!!f.newTab}
                  onChange={(v) => set({ newTab: v })}
                />
              </>
            )}
          </div>
        );
      })}
      <button
        onClick={() =>
          onChange([
            ...fields,
            {
              label: "New field",
              key: "field" + Date.now(),
              type: "text",
              value: "",
              visible: true,
              displayLabel: true,
              style: "normal",
              order: fields.length,
            },
          ])
        }
      >
        + Add Custom Field
      </button>
    </fieldset>
  );
}
