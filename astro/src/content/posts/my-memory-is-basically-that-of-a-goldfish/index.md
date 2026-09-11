---
title: "My memory is basically that of a goldfish"
date: 2025-12-05
draft: false
tags: ["ai", "humor", "personal"]
categories: ["humor"]
summary: "On SQL syntax, fan-fiction ALTER TABLE statements, why I still need the SQL magician, and what AI actually liberated us from."
---

My memory is basically that of a goldfish. I only remember what truly matters - and SQL syntax does not make the cut.

The other day I needed to change a column type in my database, so I wrote something like:

```sql
ALTER TABLE rxc.trial change column drugs to text instead of varchar;
```

Yes, I know. There are mistakes. Parts of it are basically fan-fiction.

And at this point, some of you are already judging me. You probably call yourself a "data engineer" or an "SQL magician." You wake up at 3 AM reciting the differences between Postgres 10 and 11. You speak SQL better than your native language.

I am not you.

I wrote that line purely so I could add this right under it:

```
//TODO: fix the syntax of this statement
```

Then I asked Copilot to "fix the TODO in this file." Because I'm not just lazy - I'm committed to not learning. Goldfish, remember?

But here's the thing: Copilot didn't warn me that this change could cause downtime or even cost the company $50k. (It didn't happen - but it could have.) And that's exactly why I still need the SQL magician. They would have told me. Right after making fun of me for the syntax.

So no, AI didn't replace you. It liberated you - from people like me - so you can focus on real problems instead of listening to my existential crisis about SQL.

---

*Originally posted [on LinkedIn](https://www.linkedin.com/feed/update/urn:li:activity:7394778181100187648/).*
