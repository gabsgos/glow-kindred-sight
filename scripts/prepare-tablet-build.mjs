import { copyFileSync, existsSync, mkdirSync, readdirSync } from "node:fs";
import { resolve } from "node:path";

const outDir = resolve("dist-tablet");
const target = resolve(outDir, "index.html");
const vanillaSource = resolve(outDir, "tablet.index.html");
const staticPages = [
  ["tablet.app-login.html", "app-login.html"],
  ["tablet.app-login-code.html", "app-login-code.html"],
  ["tablet.input-smoke-plain.html", "input-smoke-plain.html"],
  ["tablet.input-smoke-css.html", "input-smoke-css.html"],
  ["tablet.input-smoke-auth-js.html", "input-smoke-auth-js.html"],
];
const staticAssets = [["tablet.auth-smoke.js", "auth-smoke.js"]];
const pwaAssets = [
  ["pwa/manifest.webmanifest", "manifest.webmanifest"],
  ["pwa/pwa-sw.js", "pwa-sw.js"],
  ["pwa/icons/icon-192.png", "icons/icon-192.png"],
  ["pwa/icons/icon-512.png", "icons/icon-512.png"],
  ["pwa/icons/maskable-512.png", "icons/maskable-512.png"],
];

if (!existsSync(vanillaSource)) {
  throw new Error(`Tablet vanilla build entry not found: ${vanillaSource}`);
}
copyFileSync(vanillaSource, target);

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

for (const [assetSource, assetTarget] of pwaAssets) {
  const assetSourcePath = resolve(assetSource);
  if (!existsSync(assetSourcePath)) {
    throw new Error(`PWA asset not found: ${assetSourcePath}`);
  }
  const targetPath = resolve(outDir, assetTarget);
  mkdirSync(resolve(targetPath, ".."), { recursive: true });
  copyFileSync(assetSourcePath, targetPath);
}

const assetsDir = resolve(outDir, "assets");
const cssAsset = readdirSync(assetsDir).find((file) => file.endsWith(".css"));
if (!cssAsset) {
  throw new Error(`Tablet CSS asset not found in: ${assetsDir}`);
}
copyFileSync(resolve(assetsDir, cssAsset), resolve(outDir, "app.css"));
