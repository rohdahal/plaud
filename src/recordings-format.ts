function formatTime(milliseconds: unknown): string {
  const totalSeconds = Math.floor(Number(milliseconds || 0) / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function formatDate(timestamp: unknown): string {
  if (!timestamp) return "";
  const date = new Date(timestamp as any);
  if (Number.isNaN(date.getTime())) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function sanitizeFilename(filename: unknown): string {
  return String(filename || "untitled")
    .replace(/[<>:"/\\|?*]/g, "-")
    .replace(/\s+/g, "_")
    .slice(0, 200);
}

export function getFilenameWithDate(
  baseFilename: unknown,
  file: any,
  details: any,
): string {
  const timestamp = details?.start_time || file?.start_time || details?.edit_time || file?.edit_time;
  const datePrefix = formatDate(timestamp);
  const sanitized = sanitizeFilename(baseFilename || file?.id || "untitled");
  return datePrefix ? `${datePrefix}_${sanitized}` : sanitized;
}

export function formatTranscript(segments: any): string {
  if (!Array.isArray(segments)) return "";
  return segments
    .map((segment) => {
      const time = formatTime(segment.start_time);
      const speaker = segment.speaker || "Speaker";
      const content = segment.content || "";
      return `[${time}] ${speaker}: ${content}`;
    })
    .join("\n\n");
}

