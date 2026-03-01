import test from "node:test";
import assert from "node:assert/strict";
import { normalizeMatchMode, validateSpeakerRenameOptions } from "../src/speakers-rename.js";

test("normalizeMatchMode maps documented aliases", () => {
  assert.equal(normalizeMatchMode("original"), "original");
  assert.equal(normalizeMatchMode("original_speaker"), "original");
  assert.equal(normalizeMatchMode("speaker"), "speaker");
  assert.equal(normalizeMatchMode("display"), "speaker");
  assert.equal(normalizeMatchMode("both"), "both");
});

test("normalizeMatchMode rejects unknown mode", () => {
  assert.throws(() => normalizeMatchMode("nope"), /Invalid --match/i);
});

test("validateSpeakerRenameOptions trims and validates options", () => {
  const out = validateSpeakerRenameOptions({ from: " Speaker 1 ", to: " Alice ", match: "display" });
  assert.deepEqual(out, { from: "Speaker 1", to: "Alice", match: "speaker" });
  assert.throws(
    () => validateSpeakerRenameOptions({ from: " ", to: "Alice", match: "original" }),
    /Invalid --from/i,
  );
  assert.throws(
    () => validateSpeakerRenameOptions({ from: "Speaker 1", to: " ", match: "original" }),
    /Invalid --to/i,
  );
  assert.throws(
    () => validateSpeakerRenameOptions({ from: "Alice", to: "Alice", match: "original" }),
    /must be different/i,
  );
});
