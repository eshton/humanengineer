// Prev/next within a date-sorted (desc) list of entries.
export function siblings<T extends { id: string }>(list: T[], id: string) {
  const i = list.findIndex((e) => e.id === id);
  return {
    prev: i > 0 ? list[i - 1] : undefined, // newer
    next: i >= 0 && i < list.length - 1 ? list[i + 1] : undefined, // older
  };
}
