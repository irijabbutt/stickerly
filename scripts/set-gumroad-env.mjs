#!/usr/bin/env node
/**
 * Bulk-set Stickerly Gumroad product IDs and site URL in Vercel.
 *
 * Usage:
 *   node scripts/set-gumroad-env.mjs
 *
 * The script reads values from a `gumroad-config.json` file in the project
 * root (created from the template below) and runs `vercel env add` for each.
 *
 * Example gumroad-config.json:
 * {
 *   "siteUrl": "https://stickerly.example.com",
 *   "productIds": {
 *     "cute-sticker-pack": "your-real-cute-pack-id",
 *     "motion-ui-kit": "your-real-motion-kit-id",
 *     "3d-icon-scene": "your-real-3d-scene-id",
 *     "kawaii-animals": "your-real-kawaii-id",
 *     "loader-collection": "your-real-loader-id",
 *     "floating-shapes": "your-real-shapes-id"
 *   }
 * }
 */

import { readFileSync, existsSync } from "node:fs";
import { spawnSync } from "node:child_process";

const CONFIG_FILE = "gumroad-config.json";

function slugToEnvKey(slug) {
  return (
    "NEXT_PUBLIC_GUMROAD_PRODUCT_ID_" + slug.replace(/-/g, "_").toUpperCase()
  );
}

function setEnv(name, value) {
  console.log(`Setting ${name}...`);
  const result = spawnSync(
    "vercel",
    ["env", "add", name, "development", "preview", "production"],
    {
      input: value + "\n",
      stdio: ["pipe", "inherit", "inherit"],
    }
  );
  if (result.error) {
    console.error(`Failed to set ${name}:`, result.error.message);
    process.exit(1);
  }
  if (result.status !== 0) {
    console.error(`Failed to set ${name} (exit ${result.status})`);
    process.exit(1);
  }
}

if (!existsSync(CONFIG_FILE)) {
  console.error(
    `Missing ${CONFIG_FILE}. Create it from the template in scripts/set-gumroad-env.mjs`
  );
  process.exit(1);
}

const config = JSON.parse(readFileSync(CONFIG_FILE, "utf8"));

if (config.siteUrl) {
  setEnv("NEXT_PUBLIC_SITE_URL", config.siteUrl);
}

for (const [slug, id] of Object.entries(config.productIds)) {
  setEnv(slugToEnvKey(slug), id);
}

console.log("\nDone. Pull the latest env file with:");
console.log("  vercel env pull .env.local");
console.log("Then redeploy with:");
console.log("  vercel --prod");
