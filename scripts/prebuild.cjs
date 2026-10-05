const fs = require("fs");
fs.mkdirSync("public/content", { recursive: true });
fs.cpSync("content", "public/content", { recursive: true });
fs.cpSync("media", "public/media", { recursive: true });
