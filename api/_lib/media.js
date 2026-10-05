function validateMedia(contentType, path, dataBase64) {
  if (
    typeof dataBase64 !== "string" ||
    !/^[A-Za-z0-9+/]*={0,2}$/.test(dataBase64)
  )
    return "Invalid base64 data.";
  const bytes = Buffer.from(dataBase64, "base64"),
    lower = path.toLowerCase();
  if (bytes.length > 3 * 1024 * 1024) return "File exceeds the 3 MB limit.";
  if (contentType === "image/png")
    return /\.png$/.test(lower) &&
      bytes
        .subarray(0, 8)
        .equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
      ? ""
      : "Invalid PNG file.";
  if (contentType === "image/jpeg")
    return /\.jpe?g$/.test(lower) &&
      bytes[0] === 255 &&
      bytes[1] === 216 &&
      bytes[2] === 255
      ? ""
      : "Invalid JPEG file.";
  if (contentType === "image/webp")
    return /\.webp$/.test(lower) &&
      bytes.toString("ascii", 0, 4) === "RIFF" &&
      bytes.toString("ascii", 8, 12) === "WEBP"
      ? ""
      : "Invalid WebP file.";
  if (contentType === "application/pdf")
    return /\.pdf$/.test(lower) && bytes.toString("ascii", 0, 5) === "%PDF-"
      ? ""
      : "Invalid PDF file.";
  // Only self-contained geometric SVG assets: no script, events, CSS, links, references or foreign XML.
  if (contentType === "image/svg+xml") {
    const xml = bytes.toString("utf8");
    if (
      !/\.svg$/.test(lower) ||
      !/^\s*(?:<\?xml[^>]*>\s*)?<svg\b/i.test(xml) ||
      /<!|\b(?:href|style|on[a-z]+)\s*=|url\(|javascript:|data:|https?:/i.test(
        xml.replace(
          /xmlns\s*=\s*["']http:\/\/www\.w3\.org\/2000\/svg["']/g,
          "",
        ),
      )
    )
      return "SVG contains unsafe or external content.";
    for (const match of xml.matchAll(/<\/?([a-zA-Z][\w:-]*)\b/g))
      if (
        ![
          "svg",
          "g",
          "path",
          "rect",
          "circle",
          "ellipse",
          "line",
          "polyline",
          "polygon",
          "title",
          "desc",
        ].includes(match[1])
      )
        return "SVG contains unsupported elements.";
    return "";
  }
  return "Unsupported file type.";
}
module.exports = validateMedia;
