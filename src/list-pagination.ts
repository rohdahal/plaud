export function finalizeListPage<T>({
  items,
  limit,
  skip,
  rawSkip,
  scanned,
}: {
  items: T[];
  limit: number;
  skip: number;
  rawSkip: number;
  scanned: number;
}): {
  items: T[];
  hasMore: boolean;
  page: { limit: number | null; skip: number; nextSkip: number; hasMore: boolean; scanned: number };
} {
  let outItems = items;
  let hasMore = false;

  if (Number.isFinite(limit) && outItems.length > limit) {
    hasMore = true;
    outItems = outItems.slice(0, limit);
  }

  return {
    items: outItems,
    hasMore,
    page: {
      limit: Number.isFinite(limit) ? limit : null,
      skip,
      nextSkip: rawSkip,
      hasMore,
      scanned,
    },
  };
}
