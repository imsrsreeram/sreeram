const config = require("../_lib/config");
const jwt = require("../_lib/jwt");
const { serializeCookie } = require("../_lib/cookies");
const { handlePreflight, applyCors } = require("../_lib/cors");

const attempts = new Map();

// Very small brute-force slow-down: a short delay on every attempt.
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

module.exports = async (req, res) => {
  if (handlePreflight(req, res)) return;
  applyCors(req, res);

  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const client = String(req.headers["x-forwarded-for"] || "unknown")
    .split(",")[0]
    .trim();
  const now = Date.now();
  for (const [key, entry] of attempts)
    if (now > entry.until) attempts.delete(key);
  const entry = attempts.get(client) || {
    count: 0,
    until: now + 10 * 60 * 1000,
  };
  if (entry.count >= 10)
    return res
      .status(429)
      .json({ error: "Too many attempts. Try again in ten minutes." });
  if (attempts.size < 2000 || attempts.has(client)) attempts.set(client, entry);
  await delay(400);

  const pin =
    req.body && typeof req.body.pin === "string" ? req.body.pin.trim() : "";
  if (!pin || typeof pin !== "string") {
    return res.status(400).json({ error: "Missing PIN" });
  }

  const correctPin = config.ADMIN_PIN();
  const a = Buffer.from(pin);
  const b = Buffer.from(correctPin);
  const match =
    a.length === b.length && require("crypto").timingSafeEqual(a, b);

  if (!match) {
    entry.count++;
    return res.status(401).json({ error: "Incorrect PIN" });
  }

  attempts.delete(client);
  const sessionToken = jwt.sign(
    { admin: true },
    config.SESSION_SECRET(),
    60 * 60 * 8,
  );
  res.setHeader(
    "Set-Cookie",
    serializeCookie("admin_session", sessionToken, { maxAge: 60 * 60 * 8 }),
  );
  res.status(200).json({ ok: true, token: sessionToken });
};
