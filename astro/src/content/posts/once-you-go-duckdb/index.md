---
title: "Once you go DuckDB"
date: 2025-11-24
draft: false
tags: ["databases", "data", "tools"]
categories: ["tools"]
summary: "DuckDB is the newest game-changer in data analytics: serverless, just-a-file, and faster than Postgres or SQLite for the analytics queries you actually want to run."
---

Are you into data analytics? 🗃️

Then if you haven't heard of [DuckDB](https://duckdb.org/), you're missing out BIG TIME! This bad boy is the newest game-changer in the field. If you haven't checked it out yet - omg, saddle up!

Here's what I love about it:

**1. Ridiculously easy CSV ingestion and joins**

```sql
SELECT *
FROM read_csv_auto('/Users/aston/company.csv') c
JOIN read_csv_auto('/Users/aston/company_revenue.csv') cr
  ON c."Company Name Column" ILIKE cr."Some Other Column";
```

And BAM! You've got your joined dataset.

**2. Serverless simplicity**

Your database is literally just a file on your machine. Open it in [DBeaver](https://dbeaver.io/) and use it like any other DB server — no setup, no daemon, no fuss. You don't even need to install a binary! (But if you want to, it's in basically every package manager.)

**3. Blazing fast**

Joins, aggregations, gigabytes of data - no sweat. Forget uploading to a remote PostgreSQL server - DuckDB flies circles around Postgres and SQLite for analytics.

Give it a go - once you go DuckDB, you never go back.

(Okay, maybe not as catchy as "once you go Mac," but you get the idea 😎)

---

*Originally posted [on LinkedIn](https://www.linkedin.com/feed/update/urn:li:activity:7389607883140837377/).*
