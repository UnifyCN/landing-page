import { defineConfig, devices } from "@playwright/test";

/**
 * Lean e2e smoke layer. Guards the View-Transition re-binding bug class
 * (handlers wired via `astro:page-load`) plus the core interactive islands.
 * Runs against `npm run dev` — deterministic, no Turnstile/Resend network.
 */
export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI
    ? [["github"], ["html", { open: "never" }]]
    : [["list"]],
  timeout: 30_000,
  expect: { timeout: 10_000 },
  use: {
    baseURL: "http://localhost:4321",
    viewport: { width: 1440, height: 900 },
    reducedMotion: "reduce",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } },
    },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:4321",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
