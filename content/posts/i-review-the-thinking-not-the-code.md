---
title: "I don't review the code anymore. I review the thinking."
date: 2026-03-24
draft: false
tags: ["ai", "engineering", "workflow"]
categories: ["industry"]
summary: "On a busy week, I ship around 10,000 lines of code changes a day. There is no way to review all that line by line — and that's not what review should be anymore."
---

On a busy week, I make around 10,000 code line changes a day on average. 🤯

Am I expected to review all that code? Pf. That is so last year thinking. Or maybe better said, 6 months ago thinking.

No. What I do instead is this:

- I make sure the architecture is clean, efficient, and designed for the problem I am solving. How? I ask the Agent to discuss options, pros and cons, and then I review it carefully to choose the architecture I want 🧠
- Then I ask the Agent to code while I watch an episode of Friends ☕
- Then I ask it to review the code and check for mistakes. It always finds 2–3 issues 🔍
- Then I test the application manually, and report issues back to the Agent to fix
- Then I ask the Agent to write tests covering the main use cases, happy path, and the error scenarios I discovered 🧪
- Then I tell the Agent: make the code production ready. Simple as that 🚀
- Optionally, I ask it to focus separately on error handling, security, performance, and observability
- Finally, I ask it to run build, linting, and assess the code coverage

I don't need to review the code anymore. I review the thinking instead. 💡

---

*Originally posted [on LinkedIn](https://www.linkedin.com/feed/update/urn:li:activity:7437397395300290560/).*
