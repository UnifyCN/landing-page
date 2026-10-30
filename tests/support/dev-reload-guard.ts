import { existsSync, readFileSync, statSync } from "node:fs";
import { setTimeout as sleep } from "node:timers/promises";
import { DEV_SERVER_LOG } from "./dev-server-log.mjs";

// Fails the run when the dev server pre-bundled a dependency mid-run.
//
// Vite bundles a dependency the first time a page or API route imports it,
// then reloads every open page. Tests caught by that reload lose their page
// and fail at random (PR #44). The fix is always the same: add the library
// to the optimizeDeps lists in astro.config.mjs. This guard makes the run say
// so, instead of leaving a flaky test to chase.
//
// Playwright starts the web server before global setup and stops it after
// global teardown, so the function returned here sees everything the server
// printed during the run. It covers `npm run test:e2e` (and CI). In UI mode
// global setup runs once per session, so single runs there are not checked.

const NEW_DEPS = /new dependencies optimized:\s*(.+)/;
// With DEBUG=vite:deps Vite skips the line above but still prints this one.
const RELOAD = /optimized dependencies changed\. reloading/;
const ANSI = /\x1b\[[0-9;]*m/g;

// Vite logs a discovery shortly after it happens and the wrapper writes the
// log asynchronously, so wait until the log stops growing before reading it.
async function waitForQuietLog(quietMs = 1000, maxMs = 10_000) {
  const deadline = Date.now() + maxMs;
  let size = statSync(DEV_SERVER_LOG).size;
  while (Date.now() < deadline) {
    await sleep(quietMs);
    const next = statSync(DEV_SERVER_LOG).size;
    if (next === size) return;
    size = next;
  }
}

export default function globalSetup() {
  if (!existsSync(DEV_SERVER_LOG)) return;
  const runStart = Date.now() - process.uptime() * 1000;
  const startedAt = Number(readFileSync(DEV_SERVER_LOG, "utf8").match(/^# started (\d+)/)?.[1] ?? 0);
  // A server started by this run: check its whole log, startup included.
  // A server reused from an earlier run: check only what it prints from now.
  const offset = startedAt >= runStart ? 0 : statSync(DEV_SERVER_LOG).size;

  return async () => {
    await waitForQuietLog();
    const lines = readFileSync(DEV_SERVER_LOG).subarray(offset).toString("utf8").replace(ANSI, "").split("\n");
    const libraries = [
      ...new Set(
        lines
          .map((line) => line.match(NEW_DEPS)?.[1])
          .filter((list): list is string => Boolean(list))
          .flatMap((list) => list.split(",").map((name) => name.trim()))
          .filter(Boolean),
      ),
    ];
    const reloaded = lines.some((line) => RELOAD.test(line));
    if (libraries.length === 0 && !reloaded) return;
    const what =
      libraries.length > 0
        ? `${libraries.length === 1 ? "a library" : "libraries"} late: ${libraries.join(", ")}`
        : "a library late (its name is not in the log, likely because DEBUG=vite:deps is set; run again without it to see the name)";
    throw new Error(
      [
        `The dev server reloaded every open page mid-run because it pre-bundled ${what}.`,
        "Tests caught by a reload fail at random, so this run fails even if they passed.",
        "Fix: add each one to an optimizeDeps include list in astro.config.mjs:",
        "vite.optimizeDeps if browser code imports it, vite.environments.ssr.optimizeDeps",
        "if a page or API route imports it on the server (both, if both do).",
      ].join("\n"),
    );
  };
}
