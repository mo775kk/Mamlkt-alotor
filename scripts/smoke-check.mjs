#!/usr/bin/env node
/**
 * Lightweight, dependency-free smoke checks for MAMLKAT AL-OTOR.
 * Run from the repository root: node scripts/smoke-check.mjs
 * Static integrity checks only; this does not replace browser interaction tests.
 */
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root = process.cwd();
const failures = [];
const pass = [];
const report = (ok, message) => (ok ? pass : failures).push(message);
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

try {
  const html = read("index.html");
  report(!/\\n\s*<(?:link|script)\b/.test(html), "index.html has no literal backslash-n before link/script tags");
  const refs = [...html.matchAll(/<(?:script|link)\b[^>]*(?:src|href)="([^"]+)"[^>]*>/g)]
    .map((m) => m[1])
    .filter((url) => !/^(?:https?:|data:|#|\/\/)/i.test(url))
    .map((url) => url.split("?")[0].split("#")[0])
    .filter(Boolean);
  const missing = [...new Set(refs)].filter((ref) => !fs.existsSync(path.join(root, ref)));
  report(missing.length === 0, missing.length ? "Missing local linked files: " + missing.join(", ") : "All local CSS/JS references in index.html exist");
} catch (e) {
  report(false, "Unable to validate index.html: " + e.message);
}

const jsFiles = ["app.js", "settings.js", "enhancements.js", "supplier-catalog.js", "catalog-editor.js", "site-upgrades.js", "royal-gift-planner.js"];
for (const file of jsFiles) {
  try {
    new vm.Script(read(file), { filename: file });
    report(true, file + " parses successfully");
  } catch (e) {
    report(false, file + " syntax error: " + e.message);
  }
}

try {
  const data = JSON.parse(read("data/products.json"));
  const products = Array.isArray(data) ? data : data.products;
  report(Array.isArray(products), "data/products.json contains a product array");
  if (Array.isArray(products)) {
    const ids = products.map((p) => String(p.id || "").trim());
    report(ids.every(Boolean), "Every catalog product has an id");
    report(new Set(ids).size === ids.length, "Catalog product ids are unique");
    const invalidVerified = products.filter((p) =>
      (p.verified === true || String(p.notesStatus || "").startsWith("verified")) &&
      (!p.sourceUrl || !Array.isArray(p.topNotes) || !p.topNotes.length ||
       !Array.isArray(p.heartNotes) || !p.heartNotes.length ||
       !Array.isArray(p.baseNotes) || !p.baseNotes.length)
    );
    report(invalidVerified.length === 0,
      invalidVerified.length ? "Verified notes missing source/pyramid: " + invalidVerified.map((p) => p.id).join(", ") :
      "Verified fragrance pyramids include source URLs and top/heart/base notes");
  }
} catch (e) {
  report(false, "data/products.json invalid: " + e.message);
}

for (const message of pass) console.log("PASS  " + message);
for (const message of failures) console.error("FAIL  " + message);
console.log("\n" + pass.length + " passed; " + failures.length + " failed.");
if (failures.length) process.exitCode = 1;
