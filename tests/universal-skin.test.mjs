import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const runtime = await readFile(new URL("../src/lib/universal-skin/runtime.ts", import.meta.url), "utf8");
const styles = await readFile(new URL("../src/lib/universal-skin/styles.ts", import.meta.url), "utf8");
const gateway = await readFile(new URL("../src/app/[service]/[[...path]]/route.ts", import.meta.url), "utf8");

test("runtime exposes confidence and semantic classification", () => {
  for (const token of ["superConfidence", "native-form-control", "dialog-semantics",
    "interactive-control", "status-token", "responsive-grid", "dropdown-trigger"]) {
    assert.ok(runtime.includes(token), `missing runtime contract: ${token}`);
  }
});

test("runtime observes added nodes in bounded batches", () => {
  assert.match(runtime, /new MutationObserver/);
  assert.match(runtime, /LIMIT = 1200/);
  assert.match(runtime, /requestIdleCallback/);
});

test("skin preserves keyboard focus and reduced-motion preferences", () => {
  assert.match(styles, /:focus-visible/);
  assert.match(styles, /prefers-reduced-motion/);
  assert.match(styles, /overflow-x: auto/);
});

test("gateway only transforms HTML and CSS responses", () => {
  assert.match(gateway, /text.*css/);
  assert.match(gateway, /text.*html/);
  assert.ok(gateway.includes("upstream.body"));
  assert.ok(gateway.includes("getService(serviceId)"));
});
