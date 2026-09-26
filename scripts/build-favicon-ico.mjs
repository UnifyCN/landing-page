// Rebuilds public/favicon.ico with only the sizes browsers request (16/32/48).
// The previous file embedded large frames and weighed 285 KB; every first visit
// downloaded it. Source: the trimmed logo master (see CLAUDE.md "Favicon set").
// Run: node scripts/build-favicon-ico.mjs
import sharp from "sharp";
import pngToIco from "png-to-ico";
import { writeFileSync, statSync } from "node:fs";

const master = "public/assets/logo/new-unify-logo-tight.png";
const frames = await Promise.all(
  [16, 32, 48].map((size) =>
    sharp(master)
      .resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toBuffer(),
  ),
);
writeFileSync("public/favicon.ico", await pngToIco(frames));
console.log(`favicon.ico ${Math.round(statSync("public/favicon.ico").size / 1024)} KB`);
