---
title: "The Agentic Setup Playbook"
date: 2026-09-11
draft: false
tags: ["ai", "claude-code", "agents", "tooling", "workflow"]
categories: []
summary: "A prioritized checklist for making a new project agent-ready — foundations, guardrails, connections, CI, compounding knowledge, and the advanced stuff — with the why behind each item."
ShowToc: true
TocOpen: false
cover:
  image: "cover.jpeg"
  alt: "The Agentic Setup Playbook — a checklist of agent-readiness items tagged by priority"
---

I've written separately about the tools I keep in my agentic coding kit — the MCPs, the hooks, the token-savers. That's about *what's on my belt*. This one is the other half: when I open a **new** project, what do I actually set up, and in what order?

Because the tools are portable but the project isn't. A fresh repo with a great MCP config and no `AGENTS.md`, no guardrails, and no CI is still a repo where an agent flails. The setup — the files, hooks, connections, and conventions that live *in the repo* — is what turns a capable agent into a trusted one.

So this is a playbook. Six categories, forty-odd items, each tagged with a priority and, where it matters, a condition. Work it top to bottom and a new project goes from "an agent can help here" to "an agent can ship here unsupervised."

## How to read this

Every item carries a priority:

- **P0** — day one, every project. If these aren't in place, nothing else compounds.
- **P1** — the first couple of weeks. This is where an agent stops handing work back to you and starts closing its own loop.
- **P2** — maturity, or when a trigger applies. High leverage, but you reach for them once the foundations hold.

Some items are conditional — an **if:** note. A project with no database skips the database items; a backend service with no UI skips the frontend loop. Don't check a box that doesn't apply; the point is a real setup, not a full bingo card.

And one principle that runs through the whole thing: **steal, don't invent.** Almost every item below already has a working reference implementation — in another repo in your org, or in open source. Copying the version that already works is faster and safer than reinventing it. The playbook tells you *what* to put in place; your best existing repo usually tells you *how*.

---

## A. Foundations — the files agents read

This is what every agent loads before it touches a line of code. Get it wrong and everything downstream inherits the mistake. Do it on day one.

### Rich root `AGENTS.md` — *P0*

The single source of truth: architecture, conventions, the commands that matter, and an append-only list of gotchas. Not a stub that says "run `npm install`" — the real thing that makes an agent's *first* edit correct instead of its third.

The test is simple: could a competent engineer who has never seen the repo make a correct, idiomatic change from this file alone? If not, it's not done. Most of the leverage in a whole agentic setup comes from this one file being genuinely good.

### `CLAUDE.md` adapter — *P0*

Different harnesses look for different filenames. Keep one source of truth and adapt. At small scale, `CLAUDE.md` is just a symlink to `AGENTS.md`. At larger scale, make it a thin loader: `@import` the shared file, then add a conditional "working on X → also read doc Y" table so an agent pulls in only the docs relevant to the task instead of drowning in all of them.

The rule is: one owner per fact. The client files (`CLAUDE.md`, the Codex and Cursor equivalents) adapt *loading and enforcement* — they never fork the actual rules.

### Product / domain context doc — *P1*

A short, self-contained doc that frames the world: what the system is, how the services fit together, the working posture (is this internal tooling or a public product with real users and PII?), and a glossary of the domain terms. Agents reason dramatically better when the domain is stated once, explicitly, instead of being reverse-engineered from code every session. Keep it repo-agnostic so you can drop the same file into sibling projects.

### Multi-harness parity layer — *P1* · *if: you use more than one agent tool*

If your team runs Claude Code *and* Codex *and* Cursor, each needs its adapter — `.codex/` hooks and onboarding, `.cursor/rules`. The trap is forking the rules three ways and watching them drift. Don't. The durable rules live in the one source of truth; the per-harness files only wire up loading and enforcement.

### Nested per-module `AGENTS.md` — *P2* · *if: large monorepo*

Only once the repo is big enough that a single root file can't stay accurate for every package. Premature in a small repo — it just gives you more files to keep in sync. Reach for it when "the auth service" and "the billing service" genuinely need different context.

---

## B. Guardrails & safety

These are the deterministic hooks the *harness* runs — not the model. That distinction is the whole point: a guardrail holds even when the agent forgets, hallucinates, or gets creative at 2am on an unattended run. This is the category that takes an agent from "helpful" to "trusted to run without a human watching."

### Destructive-action / deploy guard — *P0*

One script, wired into every harness, that hard-blocks the handful of irreversible things: production deploys, force-pushes, pushing straight to `main`. It is the single cheapest catastrophe-preventer you can install, and the one I'd never start a project without. Make it cross-host so Claude, Codex, and Cursor all hit the same wall, and parse the *command position* so a mention of "deploy" in a commit message or PR body doesn't trip it.

### Secrets kept out of the repo — *P0*

No tokens in committed config, ever. Use hosted-OAuth MCP servers (which authorize per-user and commit nothing) or user-local setup. For the high-value env vars that do exist, document them with a plain "rotate if leaked" note so nobody has to guess what a leak costs.

### Block edits on the default branch — *P0*

An edit gate that simply refuses to modify source files while you're on `main`, forcing a feature branch. It's the simplest possible way to keep every agent change reviewable, and it costs one hook. Agents love to "just quickly fix this" directly on main; don't let them.

### Pre-push gate: lint + format + typecheck — *P1*

Run exactly what CI runs, before the push — not a per-file subset that passes locally and fails in CI. The mismatch between "I linted the file I touched" and "CI lints the whole tree with the full ruleset" is a classic time-waster. If you have a commit-message convention (a ticket prefix, say), enforce it here too.

### Stop / completion gate — *P1*

The agent may not declare "done" while typecheck is failing, snapshots are stale, or the PR's CI is red. This is the hook that stops the cheerful "✅ all set!" on top of a broken build. Two things make it safe rather than infuriating: a pause escape-hatch (so it doesn't block you when you're deliberately mid-thought) and a retry cap (so a genuinely stuck check can't trap the agent in a loop).

### Non-paging git enforced — *P1*

Block paging `git diff`, `git log`, `git show` — anything that opens a pager. A pager waits for a keypress that an unattended agent will never send, and the session hangs forever. Tiny hook, real unblock. Redirect to a file, or force `--no-pager`.

### Hooks regression-tested in CI — *P1*

The hooks are code, and code rots. A guard you trust but never test can fail *open* on a silent regex regression — which is the worst possible failure, because everything looks fine right up until the destructive command sails through. Add a CI job that exercises the hooks themselves. This is the item almost everyone skips, right up until it bites.

### Least-privilege data access — *P1* · *if: has a database*

Production connections read-only, staging separate, and agent writes scoped away from real data — a copy, a sandbox, a branch. This matters doubly the moment there's real user PII involved. The read-only production connection in particular has saved me more than once: the agent can investigate a live issue but physically cannot mutate prod.

### Explicit unattended-automation lane — *P2* · *if: you run cloud/background routines*

Once you have scheduled agents doing work while you sleep, you need a deliberate way to say "this run may bypass *these specific* human-only gates" — an env flag, scoped tightly. The goal is that autonomy is a grant you made on purpose, not a hole someone found. If a background routine can bypass everything, you don't have a lane, you have a liability.

---

## C. Connections & access

The live systems an agent can reach, and — just as important — whether it can *see and act on* CI. This is the category that lets an agent close its own implement → PR → green loop instead of stopping to ask you what happened.

### Committed `.mcp.json` — *P1*

Put the MCP server config in the repo, using hosted-OAuth servers so no secrets are committed. The payoff is reproducibility: every teammate and every fresh machine gets the same agent capabilities, instead of each person hand-configuring their private setup and getting subtly different results. Capability that lives only in one dev's `~/.config` isn't a team practice.

### `gh` CLI as a first-class tool — *P1*

Document it, and let agents use it to read runs, PRs, and issues themselves. It's the primary "what did CI actually do?" path — an agent that can run `gh pr checks` and `gh run view` can diagnose its own red build instead of relaying screenshots to you.

### Deploy / platform logs in-harness — *P1*

Wire the platform's MCP — Vercel, your cloud, your compute host — so the agent can pull build and runtime logs directly. Before I had this, debugging a prod issue meant me opening a dashboard, guessing the time window, filtering to errors, and pasting logs back to the agent. Now I just say "pull the logs and tell me what broke." It's the single biggest day-to-day time saver in my kit.

### Issue-tracker MCP — *P1* · *if: you use a tracker*

Let agents create, refine, and link tickets in-session. This is the backbone of a tracker-first workflow: the ticket becomes the shared source of truth for *what* is being done and *why*, so you review intent before you review a diff. An agent that can turn a one-line idea into a scoped, linked ticket — and update it as it goes — keeps the humans in the loop without keeping them in the weeds.

### Manually re-triggerable jobs — *P1*

Put `workflow_dispatch` on the jobs an agent might reasonably need to re-run — the security audit, a flaky check, a perf run — instead of leaving them push/PR-only. It's the difference between an agent that can retry the thing and one that has to ask you to click a button.

### Database MCP (read-only prod) — *P2* · *if: has a database*

Query schema, rows, logs, and advisors straight from the harness — production strictly read-only, staging separate (see the least-privilege item in B). Being able to ask "does this row actually look like the bug report says?" without leaving the session is worth a lot; being *unable* to accidentally write to prod while doing it is worth more.

### Live browser / devtools MCP — *P2* · *if: has a frontend*

A browser/devtools MCP so the agent can inspect the DOM, read console errors, trace network requests, and profile — instead of reasoning about a running UI purely from source. It moves the agent from "here's what the code should do" to "here's what the page actually does."

---

## D. CI & automations

The pipeline agents push into, plus the recurring jobs that do work between your sessions. Green CI is the contract that makes unsupervised shipping safe: the agent's self-check is only ever as trustworthy as the CI standing behind it.

### Core CI: lint / format / typecheck / test / build — *P0*

The non-negotiable gate. Everything else in this category is optional garnish on top of this. Make it fast (cancel superseded runs on new pushes) because an agent's iteration speed is bounded by how long it waits for the check.

### Deploy-on-merge behind a gate — *P0*

Merge → staging or preview check → production. Never straight to prod unconditionally. And when a deploy fails, auto-open an issue assigned to the author, so a failure becomes a tracked task instead of a red icon nobody's watching.

### Ephemeral / preview env per PR — *P1*

A per-PR isolated environment with real end-to-end tests and automatic teardown — a preview deployment, a database branch, an ephemeral compute environment, whatever fits your stack. It lets an agent test a change against a live build, not just mocked unit tests, and it's the thing that catches the integration bug the unit tests structurally can't.

### Dependency updates + auto-merge + audit cron — *P1*

Grouped update PRs, auto-merge on green, and a weekly stale-PR and vulnerability-audit cron. If you have an AI triage step, layer it on top — but the plain plumbing (config the updates, auto-merge the safe ones, chase the stuck ones) is what keeps dependency rot from quietly accumulating. This is boring and high-value, the best combination.

### AI PR-review bot as a merge gate — *P1*

An AI reviewer on every PR, and — this is the part people miss — wired into the completion gate so "zero outstanding findings" is part of the definition of done. Otherwise the bot leaves comments nobody reads. If the agent has to clear the review before it can call the work finished, the review actually shapes the work.

### CI surfaced as actionable state — *P1*

Make CI results into *things*, not glances: the preview URL as a job output, test traces as downloadable artifacts, failures and stuck PRs as auto-created issues or chat pings. A red run should turn into a task that lands somewhere, not a silent status check that scrolls off the page.

### Periodic dedup / hygiene job — *P2*

A scheduled agent that runs a copy-paste detector and lands small, behavior-preserving refactors on its own. One rule if you build this: keep the prompt **in the repo**, fired from CI. A cleanup routine whose instructions live only in some vendor's cloud console is unversioned and unreviewable — you can't diff it, can't roll it back, and can't see why it did what it did.

### Cloud-routine registry doc — *P2* · *if: you run vendor-hosted schedules*

Vendor-hosted AI schedules (the "run this agent every morning" kind) usually can't be version-controlled. So keep one doc that catalogues them — what runs, when, and what it's allowed to touch. It's the only place those routines become reviewable, and the only defense against a mystery PR appearing every Monday with nobody quite sure who set it up.

---

## E. Knowledge that compounds

This is the category that separates a project that gets *smarter* over time from one that re-solves the same problem every quarter. Docs that stay true, and learnings that accrue instead of evaporating.

### Searchable learnings store — *P1*

One markdown file per solved problem, with YAML frontmatter (tags, module, symptoms) so it's greppable, grouped by problem type rather than by feature. The discipline is: **read before** you start working an area, **write after** you solve something non-trivial. Capture the symptom, what *didn't* work, the fix, and why — that "what didn't work" is the part that saves the next person (or the next agent) a whole investigation. Automate the authoring with a command so it's a five-second habit, not a chore.

### Append-only gotchas system — *P1*

Numbered, never-renumbered rules in the agent guide, cited by number from code comments. Each entry is the rule plus the one non-obvious fact that makes it non-obvious — not a lecture, a landmine marker. The append-only bit is load-bearing: renumbering silently repoints every citation, so you only ever add.

### Doc-freshness rule + drift tests — *P1*

Two halves. A stated policy — when and how to update the docs — so keeping them current is an expectation, not a nicety. And, more powerfully, tests that *fail CI when the docs drift from the code*: snapshot the exact context an agent sees (a system prompt, a tool schema, the database comments it reads) and break the build when it changes without the snapshot being updated. The silent-doc-rot failure mode is nasty precisely because it's invisible — an agent confidently ships a wrong answer from a stale doc, with nothing in the logs. A drift test turns that silent failure loud.

### Review-with-your-own-agent workflow — *P1*

A documented multi-lens review that happens *before* a human looks: a review command, plus a self-review pass and specialist subagents (security, performance) on non-trivial diffs. The agent that wrote the code is not the best judge of it; a fresh agent with a review brief catches things the author-agent was blind to. Reviewing the *thinking* before the human reviews the *code* is most of the value.

### Agent onboarding doc + one-shot install script — *P2*

A short onboarding path plus an idempotent script that provisions the recommended plugins, skills, and MCP servers, so a new machine — or a new teammate — comes up identical to yours. "Works on my setup" is a real problem for agentic workflows too; the install script is the fix.

### Shared skill / subagent library — *P2*

Reusable skills and review subagents as team assets — a plugin, or checked into the repo — instead of one-off prompts everyone rewrites from scratch each session. This is where the compounding really shows: a good review skill written once and shared pays off on every PR anyone opens, forever.

---

## F. Product & advanced maturity

The higher-leverage stuff you reach for once the foundations hold. Several of these are conditional on the shape of the project, and two of them are things most teams — mine included — are still building rather than shipping.

### Agent-native product surface — *P2* · *if: user-facing app*

The principle: **anything a user can do or see, an agent can too.** In practice that means exposing your product's actions as proper tools — a gated API layer, or an embedded assistant with real (safely scoped) write access — not just a UI a human clicks. And when you build a new feature, review it through an agent-native lens: did we just ship something only a human with a mouse can use? An agent-native product is one where the assistant isn't bolted on afterward; it's a first-class way to operate the thing.

### Data-change & migration safety — *P2* · *if: owns a database*

Versioned, reviewed migrations; an automated breaking-change guard in CI that catches an incompatible schema edit before it ships; and a data-integrity review pass on the high-stakes changes. Schema and data changes are where an agent mistake stops being "revert the commit" and starts being "restore from backup," so they earn the extra ceremony.

### Design → frontend loop — *P2* · *if: has UI*

Visual-regression baselines so an unintended pixel change is caught, a component workbench (Storybook or similar) so components can be built and reviewed in isolation, and a design source-of-truth sync — Figma pulled in as design tokens — so agent-built UI stays on-spec instead of drifting into approximately-right. The tighter the loop between the design and the running build, the less "that's not quite what the mockup said" review you do by hand.

### Debugging / incident runbook — *P2*

A documented path for an agent to own a red deploy end to end: read the logs, reproduce the issue (a reproduce-the-bug skill helps), and turn the failure into an assigned task with a diagnosis attached. The connections in category C make this *possible*; the runbook makes it *repeatable*.

### Cost & token efficiency — *P2*

Token-compression tooling (a shell-output proxy can cut command I/O by 60–90%), output compression, and picking the right model per task instead of defaulting to the biggest one for everything. On a small team this is real money, not a rounding error — and it buys back context-window room, which makes the agent better at the same time.

### Agent-output quality & evals — *P2* · *rarely done*

Here's one almost nobody does yet, and it's worth being early on. Everyone gates agent-authored PRs — the auto-dedup refactors, the dependency bumps — on "is CI green?" But nobody actually *evaluates whether the output is good*. Green CI and good code are not the same thing, and the gap is exactly where an agent's plausible-but-wrong change slips through. (If you have an LLM feature in the product itself, this becomes a scored eval suite for that feature — *if: LLM feature* — which is a more established practice. The novel bit is evaluating the *coding* agents.)

### Cross-service wire-contract test — *P2* · *if: shared contract*

When two services share a request/response shape — one calls the other over HTTP — the contract *is* the product, and a mismatch is an outage. Add a schema test on both ends so a drift (one side makes a field required, the other still sends null) fails CI instead of production. I've watched a `Optional` vs `nullable` mismatch turn into a 100%-rejection incident that a five-line contract test would have caught at PR time. Rarely built, cheap to build, expensive to skip.

---

## If you only do five things

Not every project needs all forty items on day one. If you're standing up something new this afternoon and want the highest-leverage subset:

1. **A rich `AGENTS.md`** — the one file that makes every agent edit better.
2. **A deploy / destructive-action guard** — the cheapest way to prevent the irreversible mistake.
3. **Block edits on `main`** — one hook, and every agent change stays reviewable.
4. **Core CI** — the gate that makes the agent's self-check mean something.
5. **`gh` CLI + platform logs in the harness** — so the agent can see what CI and prod actually did, and close its own loop.

Everything else builds on those five.

## The shape of it

The through-line is that an agentic setup is mostly about *earned trust*. Each category buys you a bit more: the foundations make the agent competent, the guardrails make it safe to leave alone, the connections let it close its own loop, CI makes shipping unsupervised sound, the knowledge layer makes it get better over time, and the advanced items are what you build once all of that holds.

You don't get there by installing tools. You get there by setting up the project so the tools have something solid to stand on. That's the playbook.

---

## Appendix: the checklist

The whole thing on one screen. Grab the P0 rows for a new project today; work down from there.

| # | Item | Priority | Applies when |
|---|---|---|---|
| A1 | Rich root `AGENTS.md` | P0 | always |
| A2 | `CLAUDE.md` adapter | P0 | always |
| A3 | Product / domain context doc | P1 | always |
| A4 | Multi-harness parity layer | P1 | >1 agent tool |
| A5 | Nested per-module `AGENTS.md` | P2 | large monorepo |
| B1 | Destructive-action / deploy guard | P0 | always |
| B2 | Secrets kept out of the repo | P0 | always |
| B3 | Block edits on the default branch | P0 | always |
| B4 | Pre-push gate: lint + format + typecheck | P1 | always |
| B5 | Stop / completion gate | P1 | always |
| B6 | Non-paging git enforced | P1 | always |
| B7 | Hooks regression-tested in CI | P1 | always |
| B8 | Least-privilege data access | P1 | has a DB |
| B9 | Unattended-automation lane | P2 | cloud routines |
| C1 | Committed `.mcp.json` | P1 | always |
| C2 | `gh` CLI as a first-class tool | P1 | always |
| C3 | Deploy / platform logs in-harness | P1 | always |
| C4 | Issue-tracker MCP | P1 | uses a tracker |
| C5 | Manually re-triggerable jobs | P1 | always |
| C6 | Database MCP (read-only prod) | P2 | has a DB |
| C7 | Live browser / devtools MCP | P2 | has a frontend |
| D1 | Core CI: lint / format / typecheck / test / build | P0 | always |
| D2 | Deploy-on-merge behind a gate | P0 | always |
| D3 | Ephemeral / preview env per PR | P1 | always |
| D4 | Dependency updates + auto-merge + audit cron | P1 | always |
| D5 | AI PR-review bot as a merge gate | P1 | always |
| D6 | CI surfaced as actionable state | P1 | always |
| D7 | Periodic dedup / hygiene job | P2 | always |
| D8 | Cloud-routine registry doc | P2 | vendor schedules |
| E1 | Searchable learnings store | P1 | always |
| E2 | Append-only gotchas system | P1 | always |
| E3 | Doc-freshness rule + drift tests | P1 | always |
| E4 | Review-with-your-own-agent workflow | P1 | always |
| E5 | Agent onboarding doc + install script | P2 | always |
| E6 | Shared skill / subagent library | P2 | always |
| F1 | Agent-native product surface | P2 | user-facing app |
| F2 | Data-change & migration safety | P2 | owns a DB |
| F3 | Design → frontend loop | P2 | has UI |
| F4 | Debugging / incident runbook | P2 | always |
| F5 | Cost & token efficiency | P2 | always |
| F6 | Agent-output quality & evals | P2 | always (rarely done) |
| F7 | Cross-service wire-contract test | P2 | shared contract |

### AI Usage in This Article

The playbook is mine — the categories, the priorities, and the calls about what actually matters were the output of auditing my own projects and arguing with myself about the ordering. What an AI agent did was turn that checklist into this prose: I handed it the structured playbook and the direction, it drafted the article, and I edited it into shape. The opinions and the substance are mine; the first draft of the words was the model's.

Under the [AACC](https://github.com/dzmalone/aacc) (AI Attribution and Creative Content) framework, that makes this **AI-Assisted**: the creator originates and drives the work, and AI contributes through modification, enhancement, or refinement at some stage.

<div class="aacc-badge">
<img class="aacc-light" src="/badges/aacc-aia-black.png" alt="AACC AI-Assisted badge">
<img class="aacc-dark" src="/badges/aacc-aia-white.png" alt="AACC AI-Assisted badge">
<span class="aacc-caption"><strong>AI-Assisted</strong> · By Agoston Fung, drafted from my own playbook with AI.<br>Badge: <a href="https://github.com/dzmalone/aacc">AACC</a> by Dave Malone, <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>.</span>
</div>
