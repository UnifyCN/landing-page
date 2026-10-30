import { existsSync, readFileSync, statSync } from "node:fs";
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
// printed during the run.

const MARKER = /new dependencies optimized:\s*(.+)/;
const ANSI = /\x1b\[[0-9;]*m/g;

export default function globalSetup() {
  if (!existsSync(DEV_SERVER_LOG)) return;
  const runStart = Date.now() - process.uptime() * 1000;
  const startedAt = Number(readFileSync(DEV_SERVER_LOG, "utf8").match(/^# started (\d+)/)?.[1] ?? 0);
  // A server started by this run: check its whole log, startup included.
  // A server reused from an earlier run: check only what it prints from now.
  const offset = startedAt >= runStart ? 0 : statSync(DEV_SERVER_LOG).size;

  return () => {
    const output = readFileSync(DEV_SERVER_LOG).subarray(offset).toString("utf8").replace(ANSI, "");
    const libraries = [
      ...new Set(
        output
          .split("\n")
          .map((line) => line.match(MARKER)?.[1])
          .filter((list): list is string => Boolean(list))
          .flatMap((list) => list.split(",").map((name) => name.trim()))
          .filter(Boolean),
      ),
    ];
    if (libraries.length === 0) return;
    throw new Error(
      [
        `The dev server reloaded every open page mid-run because it pre-bundled ${libraries.length === 1 ? "a library" : "libraries"} late: ${libraries.join(", ")}.`,
        "Tests caught by a reload fail at random, so this run fails even if they passed.",
        "Fix: add each one to an optimizeDeps include list in astro.config.mjs:",
        "vite.optimizeDeps if browser code imports it, vite.environments.ssr.optimizeDeps",
        "if a page or API route imports it on the server (both, if both do).",
      ].join("\n"),
    );
  };
}
