// Plain-text excerpt from a post's raw markdown body — the first few
// sentences, for the /posts/ list cards.
export function excerpt(body: string | undefined, maxChars = 300): string {
  if (!body) return "";
  let t = body
    .replace(/```[\s\S]*?```/g, " ") // fenced code
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ") // images
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") // links -> text
    .replace(/^#{1,6}\s+/gm, "") // headings
    .replace(/^\s*[-*+]\s+/gm, "") // bullet markers
    .replace(/(\*\*|__|\*|_|`|>)/g, "") // emphasis / quote markers
    .replace(/\s+/g, " ")
    .trim();
  if (t.length <= maxChars) return t;
  const cut = t.slice(0, maxChars);
  const end = Math.max(
    cut.lastIndexOf(". "),
    cut.lastIndexOf("! "),
    cut.lastIndexOf("? "),
  );
  return end > 140 ? cut.slice(0, end + 1) : cut.trim() + "…";
}
