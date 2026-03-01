export type SpeakerMatchMode = "original" | "speaker" | "both";

export function normalizeMatchMode(value: unknown): SpeakerMatchMode {
  const v = String(value || "").trim().toLowerCase();
  if (v === "original" || v === "original_speaker") return "original";
  if (v === "speaker" || v === "display") return "speaker";
  if (v === "both") return "both";
  throw new Error("Invalid --match value. Allowed: original,speaker,both.");
}

export function validateSpeakerRenameOptions(opts: {
  from: unknown;
  to: unknown;
  match: unknown;
}): { from: string; to: string; match: SpeakerMatchMode } {
  const from = String(opts.from || "").trim();
  const to = String(opts.to || "").trim();
  if (!from) throw new Error("Invalid --from. Provide a non-empty speaker label.");
  if (!to) throw new Error("Invalid --to. Provide a non-empty speaker label.");
  if (from === to) throw new Error("`--from` and `--to` must be different.");
  const match = normalizeMatchMode(opts.match);
  return { from, to, match };
}
