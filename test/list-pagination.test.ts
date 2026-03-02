import test from "node:test";
import assert from "node:assert/strict";
import { finalizeListPage } from "../src/list-pagination.js";

test("finalizeListPage truncates over-limit items and sets hasMore", () => {
  const res = finalizeListPage({
    items: ["a", "b", "c"],
    limit: 2,
    skip: 10,
    rawSkip: 25,
    scanned: 15,
  });

  assert.deepEqual(res.items, ["a", "b"]);
  assert.equal(res.hasMore, true);
  assert.deepEqual(res.page, {
    limit: 2,
    skip: 10,
    nextSkip: 25,
    hasMore: true,
    scanned: 15,
  });
});

test("finalizeListPage keeps exact-limit items and hasMore false", () => {
  const res = finalizeListPage({
    items: ["a", "b"],
    limit: 2,
    skip: 0,
    rawSkip: 2,
    scanned: 2,
  });

  assert.deepEqual(res.items, ["a", "b"]);
  assert.equal(res.hasMore, false);
  assert.deepEqual(res.page, {
    limit: 2,
    skip: 0,
    nextSkip: 2,
    hasMore: false,
    scanned: 2,
  });
});

test("finalizeListPage treats infinite limit as --all and keeps all items", () => {
  const res = finalizeListPage({
    items: ["a", "b", "c"],
    limit: Infinity,
    skip: 5,
    rawSkip: 30,
    scanned: 25,
  });

  assert.deepEqual(res.items, ["a", "b", "c"]);
  assert.equal(res.hasMore, false);
  assert.deepEqual(res.page, {
    limit: null,
    skip: 5,
    nextSkip: 30,
    hasMore: false,
    scanned: 25,
  });
});
