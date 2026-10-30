// Starts `astro dev` for the e2e run (playwright.config.ts webServer) and
// copies everything it prints to DEV_SERVER_LOG, so dev-reload-guard.ts can
// check it once the tests are done. The output still reaches the terminal.
import { spawn } from "node:child_process";
import { createWriteStream, mkdirSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { DEV_SERVER_LOG } from "./dev-server-log.mjs";

mkdirSync(dirname(DEV_SERVER_LOG), { recursive: true });
const log = createWriteStream(DEV_SERVER_LOG);
// The first line says when this server started, so the guard can tell a
// server started by this run from one reused from an earlier run.
log.write(`# started ${Date.now()}\n`);

// Same as `npm run dev` (astro dev), but run through Node itself so it also
// starts on Windows, where npm is a .cmd script that spawn cannot launch.
// astro does not export its bin file, so find it through its package.json.
const astroPkg = createRequire(import.meta.url).resolve("astro/package.json");
const astroBin = join(dirname(astroPkg), JSON.parse(readFileSync(astroPkg, "utf8")).bin.astro);
const child = spawn(process.execPath, [astroBin, "dev"], { stdio: ["inherit", "pipe", "pipe"] });
child.on("error", (error) => {
  console.error(`Could not start the dev server: ${error.message}`);
  log.end(() => process.exit(1));
});
child.stdout.on("data", (chunk) => {
  process.stdout.write(chunk);
  log.write(chunk);
});
child.stderr.on("data", (chunk) => {
  process.stderr.write(chunk);
  log.write(chunk);
});

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => child.kill(signal));
}
child.on("exit", (code, signal) => {
  log.end(() => process.exit(code ?? (signal ? 1 : 0)));
});
