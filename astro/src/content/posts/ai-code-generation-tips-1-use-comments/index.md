---
title: "AI code generation tips #1: use comments"
date: 2025-11-15
draft: false
tags: ["ai", "codegen", "prompts"]
categories: ["tips"]
summary: "When you need to make small changes to existing code, don't try to describe everything in one long prompt. Add TODO comments where the changes belong, and let the AI sweep through them."
---

🚀 When you need to make small changes to existing code, here's a pro tip 👇

❌ **Don't do this:** Try to describe all the changes in a long prompt - it's error-prone and the AI may misunderstand the context. You'll end up trying and failing multiple times. 😩

✅ **Do this instead:** Go through your code and add clear TODO comments, like:

```
// TODO: Add request validation to this endpoint
// TODO: Make this method take an extra parameter
// TODO: Refactor this to use async APIs
```

Then use a prompt like:

> Go through the code and collect all TODO items, then for each item implement the changes and update the tests.

🎯 **Why it works:**

- The AI has extra context right in the code
- You get more predictable and accurate changes

Try it out - it's a simple shift that makes a huge difference in codegen workflows. 💪

👇 Let me know your experiences or tricks in the comments!

---

*Originally posted [on LinkedIn](https://www.linkedin.com/feed/update/urn:li:activity:7385191770105556992/).*
