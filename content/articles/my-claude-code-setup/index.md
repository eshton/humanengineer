---
title: "My Claude Code Setup"
date: 2026-07-23
draft: true
tags: ["claude-code", "ai", "tooling", "workflow"]
categories: []
summary: "TODO"
ShowToc: false
cover:
  image: "cover.jpeg"
  alt: ""
---
<!-- TODO: drop a cover.jpeg into this bundle before flipping draft: false.
     Until then the cover falls back to the profile photo for OG/social. -->

## Table of Contents

1. [Introduction](#introduction)
2. [Must-have tools](#must-have-tools)
    - [Infrastructure MCPs — Supabase, Vercel, Modal](#infrastructure-mcps--supabase-vercel-modal)
    - [Project Management - Linear and Rooster](#project-management---linear-and-rooster)
    - [Claude Hooks](#claude-hooks)
3. [Very useful tools](#very-useful-tools)
    - [Validate and debug - Chrome DevTools](#validate-and-debug---chrome-devtools)
    - [Token Saving — RTK and Caveman](#token-saving--rtk-and-caveman)
4. [Nice to haves](#nice-to-haves)
    - [Developer Skills — Compound Engineering](#developer-skills--compound-engineering)
    - [Remote Control — tmux and caffeinate](#remote-control--tmux-and-caffeinate)
    - [Focus — i-have-adhd](#focus--i-have-adhd)
    - [Design and documentation](#design-and-documentation)
5. [Conclusions](#conclusions)
6. [Appendix](#appendix)
    - [Table of Tools and how to install](#table-of-tools-and-how-to-install)
    - [AI Usage in This Article](#ai-usage-in-this-article)

## Introduction

- why am i writing this article
- my experience working with claude and opencode

## Must-have tools

- while all the tools i list in this article i consider them essential, all help me in different ways, i also want to categorise them in terms of how useful they are. if i ever need to start at a new place and need to rebuild my setup, this is the order i would do

### Infrastructure MCPs — Supabase, Vercel, Modal

I put infra mcps at number one because these tools are the single biggest time savers for me. Before having these mcps, I would manually visit a dashboard for logs, manually try to select the correct time, and/or filter to errors and see if i can match a production issue. i know there are a lot of automations in place that would help, cli, grep, and if you are a renegade engineer you probably don't have the problem to access the logs quickly, but still, analysing them takes a long time.

Right now, i just ask my agent to pull the logs and analyse them. We also have scheduled tasks that run and pick up errors and automatically analyse, fix and create a PR that just waits for review.

How much access you give to these tools is also important. I am on the safe side, and would only allow read-only MCPs, and these are generally considered and write tools are not usually present.

The table below lists the tools each of these MCP servers exposes and flags which ones can change state. This is the surface I saw with the servers connected in my own session — the exact set depends on the server version and how it is configured, and a read-only configuration will hide most of the "Write" rows.

| MCP | Tool | What it does | Write? |
|---|---|---|---|
| Supabase | `list_tables` | List tables in the schema | Read-only |
| Supabase | `list_extensions` | List installed Postgres extensions | Read-only |
| Supabase | `list_migrations` | List applied migrations | Read-only |
| Supabase | `list_branches` | List database branches | Read-only |
| Supabase | `list_edge_functions` | List edge functions | Read-only |
| Supabase | `get_edge_function` | Fetch an edge function's code | Read-only |
| Supabase | `get_logs` | Read service logs | Read-only |
| Supabase | `get_advisors` | Security/performance advisories | Read-only |
| Supabase | `get_project_url` | Get the project API URL | Read-only |
| Supabase | `get_publishable_keys` | Get publishable API keys | Read-only |
| Supabase | `generate_typescript_types` | Generate TS types from schema | Read-only |
| Supabase | `search_docs` | Search Supabase docs | Read-only |
| Supabase | `execute_sql` | Run arbitrary SQL | **Read/Write** |
| Supabase | `apply_migration` | Apply a DDL migration | **Write** |
| Supabase | `deploy_edge_function` | Deploy an edge function | **Write** |
| Supabase | `create_branch` | Create a database branch | **Write** |
| Supabase | `merge_branch` | Merge a branch | **Write** |
| Supabase | `rebase_branch` | Rebase a branch | **Write** |
| Supabase | `reset_branch` | Reset a branch (destructive) | **Write** |
| Supabase | `delete_branch` | Delete a branch (destructive) | **Write** |
| Vercel | `list_projects` | List projects | Read-only |
| Vercel | `get_project` | Project details | Read-only |
| Vercel | `list_deployments` | List deployments | Read-only |
| Vercel | `get_deployment` | Deployment details | Read-only |
| Vercel | `get_deployment_build_logs` | Read build logs | Read-only |
| Vercel | `get_runtime_logs` | Read runtime logs | Read-only |
| Vercel | `get_runtime_errors` | Read runtime errors | Read-only |
| Vercel | `get_web_analytics` | Read web analytics | Read-only |
| Vercel | `list_teams` | List teams | Read-only |
| Vercel | `get_access_to_vercel_url` | Get access to a deployment URL | Read-only |
| Vercel | `web_fetch_vercel_url` | Fetch a Vercel URL's content | Read-only |
| Vercel | `list_agent_runs` / `get_agent_run` / `get_agent_run_trace` / `list_agent_run_projects` | Inspect agent runs | Read-only |
| Vercel | `list_toolbar_threads` / `get_toolbar_thread` | Read toolbar feedback threads | Read-only |
| Vercel | `check_domain_availability_and_price` / `get_domain_order` / `get_purchase_quote` | Domain/billing lookups | Read-only |
| Vercel | `search_vercel_documentation` | Search Vercel docs | Read-only |
| Vercel | `deploy_to_vercel` | Trigger a deployment | **Write** |
| Vercel | `import-claude-design-from-url` | Import a design into a project | **Write** |
| Vercel | `add_toolbar_reaction` / `reply_to_toolbar_thread` / `edit_toolbar_message` / `change_toolbar_thread_resolve_status` | Post/edit toolbar feedback | **Write** |
| Vercel | `buy_domain` / `buy_pro` / `buy_addon` / `buy_credits` | Purchases (spend money) | **Write** |
| Modal | `list_modal_volumes` | List volumes | Read-only |
| Modal | `list_modal_volume_contents` | List files in a volume | Read-only |
| Modal | `get_modal_volume_file` | Read a volume file | Read-only |
| Modal | `deploy_modal_app` | Deploy a Modal app | **Write** |
| Modal | `put_modal_volume_file` | Upload a file to a volume | **Write** |
| Modal | `copy_modal_volume_files` | Copy files within a volume | **Write** |
| Modal | `remove_modal_volume_file` | Delete a volume file (destructive) | **Write** |

For Supabase this is not just a convention — the server takes a `--read-only` flag. My **production** connection runs with it, so `execute_sql` is forced into a read-only transaction and the write tools (`apply_migration`, `deploy_edge_function`, the branch operations) are not exposed at all. The full "Write" surface above is only reachable on the **staging** connection.

Vercel is the opposite story: there is no read-only mode. Connecting grants the same access as your Vercel user account, and the write tools include ones that spend money (`buy_*`). The only controls are coarse — OAuth consent per client and access tokens scoped to specific projects (a token can either touch a project or not; there is no per-tool or read-only scoping) — so the practical guard is keeping the token project-scoped and requiring human confirmation on each call.


#### Supabase


#### Vercel

#### Modal



##### What Works Well / Limitations

<!-- Grounded infra view vs. sensitive data, environment confusion, latency, cost. -->

### Project Management - Linear and Rooster

**Type:** MCP servers
**Purpose:** Issues, projects, documents, and workflow tracking

I run two trackers: Linear for external/team workflow, and airooster.dev (Rooster) as a lighter, agent-native tracker.

#### Linear

**Authentication:** Hosted MCP with OAuth

##### Why I Use It

Linear acts as the source of truth for the work Claude performs.

The integration lets Claude:

- read issue context
- inspect related projects and documents
- turn issues into implementation plans
- update progress
- connect code changes to tracked work
- preserve decisions and follow-up tasks

##### Setup

<!-- Add the OAuth connection steps. -->

##### Example Prompt

```text
Read the Linear issue, identify missing technical details,
and produce a Compound Engineering implementation plan.
```

#### airooster.dev (Rooster)

<!-- Rooster is my own agent-native issue tracker (see the Rooster project page).
     Explain what it adds over Linear: agent-first ticket creation, claim_next,
     context recall, and tight MCP integration. -->

##### Why I Use It

<!-- Agent-native workflow: agents create, claim, and update tickets directly;
     context and conversations are recalled per ticket. -->

##### Setup

<!-- Add the MCP registration / connection steps. -->

##### Example Prompt

```text
Claim the next open ticket, recall its context, and produce a plan before coding.
```

##### What Works Well / Limitations

<!-- Persistent context and traceability vs. issue quality and write-permission scope. -->

### Claude Hooks

**Type:** Hooks (settings.json)
**Purpose:** Automate behavior around tool calls and lifecycle events

#### What They Are

<!-- Explain Claude Code hooks: shell commands the harness runs on events
     (SessionStart, UserPromptSubmit, PreToolUse, PostToolUse, Stop, etc.). -->

#### How I Use Them

<!-- Concrete examples from this setup:
     - RTK hook: transparently rewrites commands (git status → rtk git status)
     - Caveman: SessionStart + UserPromptSubmit hooks that inject the terse mode
     - Any lint / format / guard hooks on PreToolUse or Stop -->

#### Configuration

```jsonc
// ~/.claude/settings.json (shape)
{
  "hooks": {
    "PreToolUse": [ /* ... */ ],
    "SessionStart": [ /* ... */ ]
  }
}
```

<!-- Paste the actual hook entries you rely on. -->

#### What Works Well / Limitations

<!-- Zero-overhead automation vs. debugging opaque failures and ordering with other hooks. -->

---

## Very useful tools

Not strictly required, but they earn their place in almost every session.

### Validate and debug - Chrome DevTools

**Tool:** Chrome DevTools MCP
**Type:** MCP server
**Purpose:** Live browser debugging and performance tracing
**Installation:** `npx chrome-devtools-mcp`

#### What It Is

<!-- Explain the capabilities exposed through the Chrome DevTools Protocol. -->

#### Why I Use It

This lets Claude move beyond static code inspection and interact with a running application.

Typical uses include:

- inspecting the DOM
- reading browser console errors
- tracing network requests
- checking layout and rendering
- profiling performance
- validating user flows

#### Installation

```bash
npx chrome-devtools-mcp
```

<!-- Add the Claude MCP registration command. -->

#### My Workflow

1. Start the local application.
2. Open or attach to Chrome.
3. Ask Claude to reproduce the problem.
4. Inspect console, network, layout, or performance data.
5. Apply a code change.
6. Re-run the browser validation.

#### Example Prompt

```text
Open the application, reproduce the slow interaction, capture a performance trace,
and identify the main-thread bottleneck.
```

#### What Works Well

<!-- Debugging feedback loop, visual validation, performance investigation. -->

#### Limitations

<!-- Browser state, authentication, flaky UI, security considerations. -->

### Token Saving — RTK and Caveman

RTK and Caveman attack token usage from opposite directions: RTK compresses what goes *into* the model from commands; Caveman compresses what comes *out* of the model.

Both are part of the "token-maxxing" toolset at [tokenmaxxing.sh](https://tokenmaxxing.sh/), which tracks savings across your sessions — [my profile](https://tokenmaxxing.sh/eshton).

#### RTK

**Type:** CLI proxy + hook
**Purpose:** Reduce token usage from command output
**Claimed Savings:** Approximately 60–90% on command input
**Installation:** `brew install rtk && rtk init -g`

##### What It Is

<!-- Explain how RTK proxies or compresses terminal command output before Claude sees it. -->

##### Why I Use It

Claude Code can consume a large number of tokens reading:

- test output
- build logs
- git diffs
- package manager output
- filesystem listings
- compiler errors

RTK reduces this overhead while preserving the parts of the output that matter.

##### Installation

```bash
brew install rtk
rtk init -g
```

##### How It Integrates with Claude Code

<!-- Explain the hook or proxy configuration — commands are rewritten transparently
     (e.g. `git status` → `rtk git status`) by the Claude Code hook. -->

##### Token Savings

<!-- Add measurements from your own sessions. -->

| Command | Original Tokens | RTK Tokens | Reduction |
|---|---:|---:|---:|
| Test suite | | | |
| Build output | | | |
| Git diff | | | |

##### What Works Well / Limitations

<!-- High-volume command output vs. risk of hiding useful context. -->

#### Caveman

**Type:** Skill + commands
**Purpose:** Reduce token usage from model output
**Claimed Savings:** Approximately 65%
**Requirements:** Node.js 18 or newer
**Installation:** `install.sh`

##### What It Is

<!-- Explain how Caveman changes or compresses Claude's responses (terse, article-dropping,
     filler-cutting output). Note the intensity levels: lite / full / ultra. -->

##### Why I Use It

RTK reduces the tokens going into the model from commands. Caveman addresses the other direction: overly verbose model output.

<!-- Explain how this affects cost, context-window usage, and readability. -->

##### Configuration

<!-- Add the commands, hooks, or skill configuration used in your setup. -->

##### Example

<!-- Show before and after output for the same task. -->

##### What Works Well / Limitations

<!-- Shorter responses and more context room vs. cases where compression removes useful reasoning. -->

---

## Nice to haves

Real quality-of-life gains, but I could ship without any single one of them.

### Developer Skills — Compound Engineering

**Type:** Plugin with skills and agents
**Purpose:** Structured plan → review → compound workflow
**Installation:** `/plugin marketplace`

#### What It Is

<!-- Explain what the plugin provides: commands, skills, specialist review agents, workflows. -->

#### Why I Use It

<!-- The problem it solves compared with an unstructured coding-agent workflow. -->

#### My Workflow

1. Start with a task or issue.
2. Generate a structured implementation plan.
3. Review the plan before changing code.
4. Implement the changes.
5. Review the result with specialist agents.
6. Extract reusable knowledge and compound it into future work.

#### Example

<!-- Show a real task and how Compound Engineering changed the process. -->

#### What Works Well / Limitations

<!-- Planning quality and review loops vs. extra ceremony and slower startup. -->

### Remote Control — tmux and caffeinate

**Type:** CLI tools
**Purpose:** Keep long-running Claude Code sessions alive and reattachable

#### What It Is

<!-- tmux: persistent terminal sessions you can detach from and reattach to (from
     another machine over SSH). caffeinate: prevents macOS from sleeping while a
     long task runs. Together they let a session run unattended and survive
     disconnects. -->

#### Why I Use It

<!-- Long agent runs shouldn't die when the laptop sleeps or the SSH connection
     drops. Explain the remote / overnight-run use case. -->

#### Setup

```bash
# start a named session
tmux new -s claude

# keep the mac awake for the duration of a command
caffeinate -i <command>

# reattach later (locally or over SSH)
tmux attach -t claude
```

#### My Workflow

1. Start a named tmux session on the workstation.
2. Wrap long runs in `caffeinate` so the machine stays awake.
3. Detach and reconnect from anywhere over SSH.
4. Reattach to inspect progress or intervene.

#### What Works Well / Limitations

<!-- Uninterrupted long runs and remote access vs. no GUI, and unattended-run risk. -->

### Focus — i-have-adhd

**Type:** Skill
**Purpose:** Shape output for clarity, next-action focus, and readability

#### What It Is

<!-- Explain the skill: leads with concrete next actions, numbers multi-step work,
     externalizes state across turns, suppresses tangents, makes wins visible. -->

#### Why I Use It

<!-- How it changes the experience of working with a long, multi-step agent session —
     easier to follow, harder to lose the thread. -->

#### Example

<!-- Before/after: a wall-of-text response vs. a numbered, action-first one. -->

#### What Works Well / Limitations

<!-- Clarity and momentum vs. cases where dense detail is actually wanted. -->

### Design and documentation

**Type:** Skill + CLI + plugin agents + MCP server
**Purpose:** Generate diagrams and UI, and keep both faithful to their source

Two related jobs live here: turning descriptions into diagrams (draw.io), and turning
designs into UI that matches them (the frontend-design skill plus Figma).

#### Diagrams with draw.io

**Type:** Skill + CLI
**Purpose:** Convert natural-language descriptions into professional diagrams
**Output:** PNG, SVG, PDF
**Installation:** `npx skills add` plus the draw.io CLI

<!-- Explain how Claude generates editable draw.io diagrams, and why diagrams are
     valuable for architecture, workflows, and documentation. -->

Example workflow:

1. Describe the system or workflow in natural language.
2. Ask Claude to generate a draw.io diagram.
3. Render it to SVG, PNG, or PDF.
4. Review and refine the layout.
5. Commit the editable source with the documentation.

#### Design and UX

Three things cover the design side: Claude's built-in frontend-design skill for
generating UI, the Compound Engineering design agents for reviewing it, and the
Figma MCP for pulling the source of truth into the loop.

##### Built-in frontend-design skill

<!-- Claude Code ships a frontend-design skill for producing distinctive, non-generic
     UI. Explain when it kicks in and how it shapes the output (typography, layout,
     avoiding templated "AI aesthetic"). -->

##### Compound Engineering design agents

<!-- The Compound Engineering plugin includes design review agents:
     design-implementation-reviewer (compares the live build against Figma),
     design-iterator (screenshots, critiques, and refines over N passes), and
     figma-design-sync (detects and fixes visual diffs against a Figma node).
     Explain how I use them after building UI. -->

##### Figma MCP

**Authentication:** Hosted MCP with OAuth

<!-- The Figma MCP lets Claude read the actual design — frames, tokens, spacing —
     instead of guessing from a screenshot. Explain the connect flow and how it
     feeds the review agents above. -->

Example workflow:

1. Pull the design context from Figma via the MCP.
2. Generate the UI with the frontend-design skill.
3. Review the build against the design with the Compound Engineering agents.
4. Iterate until the implementation matches.

#### What Works Well / Limitations

<!-- draw.io: editable source and consistent visual language vs. layout cleanup.
     Design: faithful implementation and fast iteration vs. design-token drift and
     the limits of screenshot-based comparison. -->

---

## Conclusions

<!-- Wrap up: the payoff of the connected workflow, what I'd tell someone starting
     from scratch, and where this setup is heading next. -->

---

## Appendix

### Table of Tools and how to install

Quick reference for getting each piece in place. Hosted MCP servers connect over
OAuth rather than a local install command.

| Tool | Type | Description | Install / Connect | Links |
|---|---|---|---|---|
| Chrome DevTools MCP | MCP server | Drives a real Chrome via the DevTools Protocol | `claude mcp add chrome-devtools npx chrome-devtools-mcp` | [github](https://github.com/ChromeDevTools/chrome-devtools-mcp) |
| RTK | CLI proxy + hook | Compresses command output before Claude reads it | `brew install rtk && rtk init -g` | [github](https://github.com/rtk-ai/rtk) · [tokenmaxxing.sh](https://tokenmaxxing.sh/) |
| Caveman | Skill + hooks | Compresses Claude's own responses | Clone the repo, run `./install.sh` (needs Node.js 18+) | [tokenmaxxing.sh](https://tokenmaxxing.sh/) |
| Linear | MCP server (OAuth) | Team issue and project tracker | `claude mcp add --transport http linear https://mcp.linear.app/mcp` then authorize | [linear.app](https://linear.app) |
| airooster.dev (Rooster) | MCP server | Agent-native issue tracker (my own) | *"Hey Claude, check out airooster.dev and create me a team and project"* | [airooster.dev](https://airooster.dev) |
| Supabase | MCP server | Postgres database, logs, and advisors | `claude mcp add supabase ...` (one entry per environment; production read-only) | [supabase.com](https://supabase.com) |
| Vercel | MCP server (OAuth) | Deployments, build logs, runtime logs | `claude mcp add --transport http vercel https://mcp.vercel.com` then authorize | [vercel.com](https://vercel.com) |
| Modal | MCP server | Serverless remote compute and volumes | `claude mcp add modal uvx modal-mcp-server` | [modal.com](https://modal.com) |
| draw.io | Skill + CLI | Turns a text description into editable diagrams | `npx skills add <package>` + install the draw.io desktop CLI | [github](https://github.com/jgraph/drawio) |
| tmux | CLI tool | Persistent, reattachable terminal sessions | `brew install tmux` | [github](https://github.com/tmux/tmux) |
| caffeinate | CLI tool | Keeps macOS awake during long runs | Built into macOS — no install | — |
| Claude hooks | Config | Shell commands run on events (PreToolUse, PostToolUse, Stop) | Edit `~/.claude/settings.json` (`hooks` block) | [docs](https://docs.claude.com/en/docs/claude-code/hooks) |
| Compound Engineering | Plugin | Plan / review / compound skills plus agents | `/plugin marketplace`, then install the plugin | [github](https://github.com/EveryInc/compound-engineering-plugin) |
| i-have-adhd | Skill | Formats replies action-first, numbered, tangent-free | `npx skills add <package>` | [github](https://github.com/ayghri/i-have-adhd) |

<!-- TODO: verify each command against your actual setup — some MCP endpoints/flags
     and the two `npx skills add` package names are placeholders. -->

### AI Usage in This Article

The prose here is hand-written. What AI helped with was the *structure* — an early
draft of the section outline and the ordering, which I then rewrote and filled in
myself. The words, opinions, and setup are mine; the scaffolding got a first pass
from a model.

Under the [AACC](https://github.com/dzmalone/aacc) (AI Attribution and Creative
Content) framework, that makes this **AI-Assisted**: the creator originates and
drives the work, and AI contributes through modification, enhancement, or
refinement at some stage.

<div class="aacc-badge">
<img class="aacc-light" src="/badges/aacc-aia-black.png" alt="AACC AI-Assisted badge">
<img class="aacc-dark" src="/badges/aacc-aia-white.png" alt="AACC AI-Assisted badge">
<span class="aacc-caption"><strong>AI-Assisted</strong> · By Agoston Fung, structure drafted with AI.<br>Badge: <a href="https://github.com/dzmalone/aacc">AACC</a> by Dave Malone, <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>.</span>
</div>
