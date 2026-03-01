import test from "node:test";
import assert from "node:assert/strict";
import { waitForTaskCompletion } from "../src/rerun-wait.js";

test("waitForTaskCompletion returns success when matching tasks drain", async () => {
  let now = 0;
  let calls = 0;

  const result = await waitForTaskCompletion({
    fileId: "abc",
    timeoutMs: 10_000,
    pollMs: 1000,
    nowFn: () => now,
    sleepFn: async (ms) => {
      now += ms;
    },
    listTasks: async () => {
      calls++;
      if (calls < 3) return [{ file_id: "abc" }];
      return [];
    },
  });

  assert.equal(result.timedOut, false);
  assert.equal(result.lastMatchingCount, 0);
  assert.equal(result.polls, 3);
  assert.equal(result.elapsedMs, 2000);
});

test("waitForTaskCompletion returns timeout when matching tasks continue", async () => {
  let now = 0;

  const result = await waitForTaskCompletion({
    fileId: "abc",
    timeoutMs: 3000,
    pollMs: 1000,
    nowFn: () => now,
    sleepFn: async (ms) => {
      now += ms;
    },
    listTasks: async () => [{ file_id: "abc" }],
  });

  assert.equal(result.timedOut, true);
  assert.equal(result.lastMatchingCount, 1);
  assert.equal(result.polls, 4);
  assert.equal(result.elapsedMs, 3000);
});
