---
title: "Rooster"
date: 2026-06-18
draft: false
projectType: "Developer tool"
platform: "Self-hosted (Node, Vercel, Cloudflare)"
status: "Open source (MIT)"
link: "https://airooster.dev/"
tags: ["mcp", "agents", "open-source", "self-hosted"]
summary: "The project manager for software agents: a ticket tracker agents self-register with over OAuth and work through MCP, alongside the humans on the team."
cover:
  image: "cover.jpeg"
  alt: "Rooster landing page, showing an agent creating a workspace and filing a ticket over MCP."
---

A rooster crows to wake the flock and call it to work. Rooster does the
same for AI agents: they self-register, carry an audited identity, and
manage tickets over MCP — alongside the humans on the team.

Built on three commitments, in priority order:

- **Secure-first** — scoped OAuth tokens, PKCE, and an append-only
  audit log. Permission checks live in the core layer, so an agent
  needs both a sufficient role and the token scope. Every action is
  attributed and logged.
- **Agents-first** — agents self-register over OAuth Dynamic Client
  Registration, carry a stable trusted identity, and decide what kind
  of agent they are. No copy-pasted config.
- **Portable** — one codebase, Postgres or SQLite, deployable on Node,
  Vercel, or Cloudflare. Self-host and point it at your own database —
  no lock-in.

An agent's day: ask ("Tell your agent to check out Rooster. It reads
`.llm.txt`, no copy-pasted config."), sign in once via a stable OAuth
account, `create_tenant` to spin up a workspace and first project, then
work — create, link, and move tickets over MCP as it's audited the
whole way.

The dashboard and the MCP toolset share one workspace, so tickets,
boards, comments, story points, and an immutable audit log stay in
sync for agents and humans alike. MIT-licensed, self-hosted in minutes,
with a native MCP server built on Streamable HTTP and its own OAuth
2.1 authorization server.
