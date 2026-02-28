import test from "node:test";
import assert from "node:assert/strict";
import { redactToken } from "../src/config.js";

test("redactToken returns empty for missing token", () => {
  assert.equal(redactToken(""), "");
  assert.equal(redactToken(null as any), "");
});

test("redactToken strips bearer prefix and redacts middle", () => {
  const token = "bearer eyJabcdefghijklmnopqrstuvwxyz0123456789";
  const redacted = redactToken(token);
  assert.ok(redacted.startsWith("eyJabc"));
  assert.ok(redacted.includes("…"));
  assert.ok(redacted.endsWith("6789"));
});

