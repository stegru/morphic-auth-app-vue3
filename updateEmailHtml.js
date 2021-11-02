/**
 * Injects ./src/config/externalLinks.js into ./public/email.html
 */
const fs = require("fs");

const linksFile = "./src/config/externalLinks.js";
const htmlFile = "./public/email.html";

const externalLinks = fs.readFileSync(linksFile, "utf-8")
    .replace(/^[^{]*/, "var links = ");

const output = fs.readFileSync(htmlFile, "utf-8")
    .replace(/var links = \{[^}]*};/, externalLinks);

fs.writeFileSync(htmlFile, output);
