const requireAuth = require("./_lib/requireAuth");
const github = require("./_lib/github");
const { handlePreflight } = require("./_lib/cors");

const CONTENT_PATH = "content/site-content.json";

module.exports = async (req, res) => {
  if (handlePreflight(req, res)) return;
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const user = requireAuth(req, res);
  if (!user) return;

  try {
    const content = req.body && req.body.content;
    if (!content || typeof content !== "object") {
      return res.status(400).json({ error: "Missing content in request body" });
    }

    const validationError = require("./_lib/validate")(content);
    if (validationError)
      return res.status(400).json({ error: validationError });

    const existing = await github.getFile(CONTENT_PATH);
    if (
      req.body.expectedSha &&
      existing &&
      existing.sha !== req.body.expectedSha
    ) {
      return res
        .status(409)
        .json({
          error:
            "The content changed in another session. Export your draft, reload the latest content, and merge your changes.",
        });
    }
    const jsonStr = JSON.stringify(content, null, 2);
    const base64 = Buffer.from(jsonStr, "utf8").toString("base64");

    const result = await github.putFile(
      CONTENT_PATH,
      base64,
      `Update site content via admin panel`,
      existing ? existing.sha : undefined,
    );

    res
      .status(200)
      .json({
        ok: true,
        commit: result.commit && result.commit.sha,
        sha: result.content && result.content.sha,
      });
  } catch (err) {
    res.status(500).json({ error: err.message || "Publish failed" });
  }
};
