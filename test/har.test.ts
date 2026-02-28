import test from "node:test";
import assert from "node:assert/strict";
import os from "node:os";
import path from "node:path";
import fs from "node:fs/promises";
import { importTokenFromHar } from "../src/auth.js";

async function withTempDir<T>(fn: (dir: string) => Promise<T>): Promise<T> {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "plaud-cli-"));
  try {
    return await fn(dir);
  } finally {
    await fs.rm(dir, { recursive: true, force: true });
  }
}

test("importTokenFromHar extracts bearer token", async () => {
  await withTempDir(async (dir) => {
    const token = "eyJ" + "x".repeat(40);
    const har = {
      log: {
        entries: [
          {
            request: {
              headers: [{ name: "Authorization", value: `bearer ${token}` }],
            },
          },
        ],
      },
    };
    const harPath = path.join(dir, "web.plaud.ai.har");
    await fs.writeFile(harPath, JSON.stringify(har), "utf8");
    const extracted = await importTokenFromHar(harPath);
    assert.equal(extracted, token);
  });
});

test("importTokenFromHar throws when no token exists", async () => {
  await withTempDir(async (dir) => {
    const har = { log: { entries: [{ request: { headers: [] } }] } };
    const harPath = path.join(dir, "empty.har");
    await fs.writeFile(harPath, JSON.stringify(har), "utf8");
    await assert.rejects(() => importTokenFromHar(harPath), /No bearer token found in HAR/);
  });
});

