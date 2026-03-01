export type RunningTaskLike = { file_id?: string | null } & Record<string, unknown>;

export type WaitForTaskCompletionResult = {
  timedOut: boolean;
  elapsedMs: number;
  polls: number;
  lastMatchingCount: number;
};

export async function waitForTaskCompletion({
  fileId,
  timeoutMs,
  pollMs,
  listTasks,
  sleepFn = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms)),
  nowFn = () => Date.now(),
}: {
  fileId: string;
  timeoutMs: number;
  pollMs: number;
  listTasks: () => Promise<RunningTaskLike[]>;
  sleepFn?: (ms: number) => Promise<void>;
  nowFn?: () => number;
}): Promise<WaitForTaskCompletionResult> {
  const startedAt = nowFn();
  let polls = 0;
  let lastMatchingCount = 0;

  while (true) {
    const tasks = await listTasks();
    polls++;
    const matching = tasks.filter((t) => String(t?.file_id || "") === String(fileId));
    lastMatchingCount = matching.length;
    if (lastMatchingCount === 0) {
      return { timedOut: false, elapsedMs: Math.max(0, nowFn() - startedAt), polls, lastMatchingCount };
    }

    const elapsedMs = Math.max(0, nowFn() - startedAt);
    if (elapsedMs >= timeoutMs) {
      return { timedOut: true, elapsedMs, polls, lastMatchingCount };
    }

    await sleepFn(pollMs);
  }
}
