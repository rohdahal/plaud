import test from "node:test";
import assert from "node:assert/strict";
import { formatTranscript, getFilenameWithDate } from "../src/recordings-format.js";

test("formatTranscript formats segments with speaker and timestamp", () => {
  const txt = formatTranscript([
    { start_time: 0, speaker: "A", content: "Hello" },
    { start_time: 12_345, speaker: "B", content: "World" },
  ]);
  assert.match(txt, /\[00:00\] A: Hello/);
  assert.match(txt, /\[00:12\] B: World/);
});

test("getFilenameWithDate prefixes date when start_time exists", () => {
  const file = { id: "id1", start_time: "2026-02-28T12:00:00.000Z" };
  const name = getFilenameWithDate("My File", file, null);
  assert.ok(name.startsWith("2026-02-28_"));
});

