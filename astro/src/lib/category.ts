// Derive a colour-coded category from a Hugo entry's tags/categories so the
// homepage cards read like the design mockup (AI=violet, Data=coral,
// Career=amber, Engineering=teal). The content is AI-heavy, so priority runs
// Data > Career > AI > Engineering: a post that is *also* about the people /
// the industry / a personal reflection reads as Career rather than another
// violet AI card, which keeps the grid colourful without lying about topic.

export type Cat = {
  key: "ai" | "dat" | "car" | "eng";
  label: string;
};

const RULES: { key: Cat["key"]; label: string; match: string[] }[] = [
  {
    key: "dat",
    label: "Data",
    match: ["duckdb", "data", "databases", "database", "sql", "analytics"],
  },
  {
    key: "car",
    label: "Career",
    match: [
      "career",
      "personal",
      "humor",
      "reflection",
      "psychology",
      "family",
      "life",
    ],
  },
  {
    key: "ai",
    label: "AI",
    match: [
      "ai",
      "llm",
      "agents",
      "agent",
      "agentic-engineering",
      "mcp",
      "claude",
      "claude-code",
      "copilot",
      "vibecoding",
      "prompts",
    ],
  },
  {
    key: "eng",
    label: "Engineering",
    match: [
      "engineering",
      "code",
      "codegen",
      "tooling",
      "tools",
      "workflow",
      "software",
      "industry",
      "product",
      "productivity",
      "future-of-work",
      "communication",
      "creativity",
      "meta",
    ],
  },
];

export function categoryOf(data: { tags?: string[]; categories?: string[] }): Cat {
  const hay = [...(data.tags ?? []), ...(data.categories ?? [])].map((t) =>
    t.toLowerCase(),
  );
  for (const rule of RULES) {
    if (rule.match.some((m) => hay.includes(m))) {
      return { key: rule.key, label: rule.label };
    }
  }
  return { key: "eng", label: "Engineering" };
}
