import { fileURLToPath } from "node:url";

// Where tests/support/dev-server.mjs writes the dev server's output.
// node_modules/.cache is never committed.
export const DEV_SERVER_LOG = fileURLToPath(
  new URL("../../node_modules/.cache/e2e/dev-server.log", import.meta.url),
);
