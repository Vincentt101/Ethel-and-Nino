// Regenerates ../index.html from invitation_template.html by inlining font/image base64 data.
// Run from this folder with: node build.js
const fs = require("fs");
const path = require("path");

const here = __dirname;
const outFile = path.join(here, "..", "index.html");

let tpl = fs.readFileSync(path.join(here, "invitation_template.html"), "utf8");

const cormorant = fs.readFileSync(path.join(here, "fonts/cormorant.b64"), "utf8").trim();
const jost = fs.readFileSync(path.join(here, "fonts/jost.b64"), "utf8").trim();
const parisienne = fs.readFileSync(path.join(here, "fonts/parisienne.b64"), "utf8").trim();
const gcash = fs.readFileSync(path.join(here, "fonts/gcash.b64"), "utf8").trim();
const bodoni = fs.readFileSync(path.join(here, "fonts/bodoni.b64"), "utf8").trim();

tpl = tpl
  .replace("__CORMORANT_B64__", cormorant)
  .replace("__JOST_B64__", jost)
  .replace("__PARISIENNE_B64__", parisienne)
  .replace("__GCASH_B64__", gcash)
  .replace("__BODONI_B64__", bodoni);

fs.writeFileSync(outFile, tpl);

const leftover = (tpl.match(/__[A-Z]+_B64__/g) || []).length;
console.log("Wrote", outFile, "-", tpl.length, "bytes. Unresolved placeholders:", leftover);
