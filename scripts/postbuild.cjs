const fs = require("fs");
fs.mkdirSync("dist/admin", { recursive: true });
let html = fs
  .readFileSync("dist/admin.html", "utf8")
  .replaceAll("./assets/", "../assets/")
  .replaceAll("./config.js", "../config.js");
fs.writeFileSync("dist/admin/index.html", html);
fs.unlinkSync("dist/admin.html");
fs.writeFileSync("dist/.nojekyll", "");
