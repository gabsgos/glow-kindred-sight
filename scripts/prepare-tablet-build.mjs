import { copyFileSync, existsSync, readdirSync } from "node:fs";
import { resolve } from "node:path";

const outDir = resolve("dist-tablet");
const source = resolve(outDir, "tablet.index.html");
const target = resolve(outDir, "index.html");
const reactSource = resolve(outDir, "tablet.react.html");
const reactTarget = resolve(outDir, "react.html");
const staticPages = [
  ["tablet.app-login.html", "app-login.html"],
  ["tablet.app-login-code.html", "app-login-code.html"],
  ["tablet.input-smoke-plain.html", "input-smoke-plain.html"],
  ["tablet.input-smoke-css.html", "input-smoke-css.html"],
  ["tablet.input-smoke-auth-js.html", "input-smoke-auth-js.html"],
];
const staticAssets = [["tablet.auth-smoke.js", "auth-smoke.js"]];

if (!existsSync(source)) {
  throw new Error(`Tablet build entry not found: ${source}`);
}

copyFileSync(source, target);

if (!existsSync(reactSource)) {
  throw new Error(`Tablet React build entry not found: ${reactSource}`);
}
copyFileSync(reactSource, reactTarget);

for (const [pageSource, pageTarget] of staticPages) {
  const pageSourcePath = resolve(pageSource);
  if (!existsSync(pageSourcePath)) {
    throw new Error(`Tablet static page not found: ${pageSourcePath}`);
  }
  copyFileSync(pageSourcePath, resolve(outDir, pageTarget));
}

for (const [assetSource, assetTarget] of staticAssets) {
  const assetSourcePath = resolve(assetSource);
  if (!existsSync(assetSourcePath)) {
    throw new Error(`Tablet static asset not found: ${assetSourcePath}`);
  }
  copyFileSync(assetSourcePath, resolve(outDir, assetTarget));
}

const assetsDir = resolve(outDir, "assets");
const cssAsset = readdirSync(assetsDir).find((file) => file.endsWith(".css"));
if (!cssAsset) {
  throw new Error(`Tablet CSS asset not found in: ${assetsDir}`);
}
copyFileSync(resolve(assetsDir, cssAsset), resolve(outDir, "app.css"));
