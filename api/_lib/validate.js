const HEX = /^#[0-9a-f]{6}$/i;
const TOKENS = [
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
function validate(c) {
  if (!c || typeof c !== "object" || Array.isArray(c))
    return "Missing content object.";
  if (JSON.stringify(c).length > 900000) return "Content is too large.";
  if (c.schemaVersion !== 2) {
    if (!c.meta || !Array.isArray(c.sectionOrder) || !c.sectionVisibility)
      return "Invalid legacy content.";
    for (const k of c.sectionOrder)
      if (!(k in c)) return "Missing section " + k;
    return "";
  }
  if (
    !c.meta ||
    !c.data?.profile ||
    !Array.isArray(c.sections) ||
    !c.appearance?.theme?.colors
  )
    return "Missing core content structure.";
  if (!c.sections.some((s) => s.id === "home"))
    return "The core Home section is required.";
  const ids = new Set();
  for (const s of c.sections) {
    if (
      !s.name?.trim() ||
      !s.id ||
      !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(s.id) ||
      ids.has(s.id)
    )
      return "Invalid or duplicate section ID.";
    ids.add(s.id);
    for (const fields of [s.fields, ...(s.items || []).map((i) => i.fields)]) {
      const keys = new Set();
      for (const f of fields || []) {
        if (!f.key || keys.has(f.key)) return "Duplicate or empty field key.";
        keys.add(f.key);
      }
    }
  }
  for (const k of TOKENS)
    if (!HEX.test(c.appearance.theme.colors[k] || ""))
      return "Invalid colour: " + k;
  return "";
}
module.exports = validate;
