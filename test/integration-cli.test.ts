import test from "node:test";
import assert from "node:assert/strict";
import os from "node:os";
import path from "node:path";
import fs from "node:fs/promises";
import { spawn } from "node:child_process";

async function withTempDir<T>(fn: (dir: string) => Promise<T>): Promise<T> {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "plaud-cli-it-"));
  try {
    return await fn(dir);
  } finally {
    await fs.rm(dir, { recursive: true, force: true });
  }
}

async function runCli(args: string[], env: Record<string, string | undefined>) {
  const cliPath = path.resolve(process.cwd(), "dist/cli.js");
  const child = spawn(process.execPath, [cliPath, ...args], {
    env: { ...process.env, ...env },
    stdio: ["ignore", "pipe", "pipe"],
  });

  const stdout: Buffer[] = [];
  const stderr: Buffer[] = [];
  child.stdout.on("data", (d) => stdout.push(d));
  child.stderr.on("data", (d) => stderr.push(d));

  const exitCode: number = await new Promise((resolve, reject) => {
    child.on("error", reject);
    child.on("close", (code) => resolve(code ?? 0));
  });

  return {
    exitCode,
    stdout: Buffer.concat(stdout).toString("utf8").trim(),
    stderr: Buffer.concat(stderr).toString("utf8").trim(),
  };
}

test("auth show --json returns v1 envelope on missing auth (exit 2)", async () => {
  await withTempDir(async (tmp) => {
    const r = await runCli(["auth", "show", "--json"], {
      XDG_CONFIG_HOME: tmp,
      PLAUD_AUTH_TOKEN: "",
    });
    assert.equal(r.exitCode, 2);
    const parsed = JSON.parse(r.stdout);
    assert.equal(parsed.ok, false);
    assert.equal(parsed.error.code, "AUTH_MISSING");
  });
});

test("files list --json returns v1 envelope on missing auth (exit 2)", async () => {
  await withTempDir(async (tmp) => {
    const r = await runCli(["files", "list", "--json", "--limit", "1"], {
      XDG_CONFIG_HOME: tmp,
      PLAUD_AUTH_TOKEN: "",
    });
    assert.equal(r.exitCode, 2);
    const parsed = JSON.parse(r.stdout);
    assert.equal(parsed.ok, false);
    assert.equal(parsed.error.code, "AUTH_MISSING");
  });
});

test("doctor --json returns v1 envelope on missing auth (exit 2)", async () => {
  await withTempDir(async (tmp) => {
    const r = await runCli(["doctor", "--json"], {
      XDG_CONFIG_HOME: tmp,
      PLAUD_AUTH_TOKEN: "",
    });
    assert.equal(r.exitCode, 2);
    const parsed = JSON.parse(r.stdout);
    assert.equal(parsed.ok, false);
    assert.equal(parsed.error.code, "AUTH_MISSING");
    assert.ok(parsed.meta?.checks?.some?.((c: any) => c?.name === "token.present"));
  });
});

test("files trash returns v1 envelope on missing auth (exit 2)", async () => {
  await withTempDir(async (tmp) => {
    const r = await runCli(["files", "trash", "deadbeefdeadbeefdeadbeefdeadbeef"], {
      XDG_CONFIG_HOME: tmp,
      PLAUD_AUTH_TOKEN: "",
    });
    assert.equal(r.exitCode, 2);
    const parsed = JSON.parse(r.stdout);
    assert.equal(parsed.ok, false);
    assert.equal(parsed.error.code, "AUTH_MISSING");
  });
});

test("files speakers list --json returns v1 envelope on missing auth (exit 2)", async () => {
  await withTempDir(async (tmp) => {
    const r = await runCli(["files", "speakers", "list", "deadbeefdeadbeefdeadbeefdeadbeef", "--json"], {
      XDG_CONFIG_HOME: tmp,
      PLAUD_AUTH_TOKEN: "",
    });
    assert.equal(r.exitCode, 2);
    const parsed = JSON.parse(r.stdout);
    assert.equal(parsed.ok, false);
    assert.equal(parsed.error.code, "AUTH_MISSING");
  });
});

test("recordings download rejects invalid --what values (exit 2)", async () => {
  await withTempDir(async (tmp) => {
    const r = await runCli(["recordings", "download", "abc", "--what", "transcript,nope"], {
      XDG_CONFIG_HOME: tmp,
      PLAUD_AUTH_TOKEN: "eyJ.fake.token",
    });
    assert.equal(r.exitCode, 2);
    const parsed = JSON.parse(r.stdout);
    assert.equal(parsed.ok, false);
    assert.equal(parsed.error.code, "VALIDATION");
    assert.match(parsed.error.message, /Invalid --what/i);
  });
});

test("recordings download rejects invalid --audio-format values (exit 2)", async () => {
  await withTempDir(async (tmp) => {
    const r = await runCli(["recordings", "download", "abc", "--what", "audio", "--audio-format", "mp3"], {
      XDG_CONFIG_HOME: tmp,
      PLAUD_AUTH_TOKEN: "eyJ.fake.token",
    });
    assert.equal(r.exitCode, 2);
    const parsed = JSON.parse(r.stdout);
    assert.equal(parsed.ok, false);
    assert.equal(parsed.error.code, "VALIDATION");
    assert.match(parsed.error.message, /Invalid --audio-format/i);
  });
});

test("recordings export rejects invalid --since date (exit 2)", async () => {
  await withTempDir(async (tmp) => {
    const r = await runCli(["recordings", "export", "--since", "not-a-date"], {
      XDG_CONFIG_HOME: tmp,
      PLAUD_AUTH_TOKEN: "eyJ.fake.token",
    });
    assert.equal(r.exitCode, 2);
    const parsed = JSON.parse(r.stdout);
    assert.equal(parsed.ok, false);
    assert.equal(parsed.error.code, "VALIDATION");
    assert.match(parsed.error.message, /Invalid --since/i);
  });
});

test("recordings export rejects inverted date range (exit 2)", async () => {
  await withTempDir(async (tmp) => {
    const r = await runCli(["recordings", "export", "--since", "2026-02-02", "--until", "2026-02-01"], {
      XDG_CONFIG_HOME: tmp,
      PLAUD_AUTH_TOKEN: "eyJ.fake.token",
    });
    assert.equal(r.exitCode, 2);
    const parsed = JSON.parse(r.stdout);
    assert.equal(parsed.ok, false);
    assert.equal(parsed.error.code, "VALIDATION");
    assert.match(parsed.error.message, /--since/);
  });
});
