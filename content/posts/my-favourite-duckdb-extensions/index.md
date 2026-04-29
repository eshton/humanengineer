---
title: "My favourite DuckDB extensions"
date: 2025-12-11
draft: false
tags: ["databases", "data", "tools", "duckdb"]
categories: ["tools"]
summary: "Three categories of DuckDB extensions I keep reaching for: cloud storage, semi-structured files, and external SQL databases."
cover:
  image: "cover.jpeg"
  alt: "A code card on a yellow background showing DuckDB extensions in action: LOAD azure / postgres / postgres_scanner; ATTACH 'postgresql://...' AS postgres_db (TYPE POSTGRES); CREATE SECRET for Azure with credential_chain; then INSERT INTO postgres_db.users SELECT * FROM read_json_auto('az://users/*.json') JOIN role ON id = role.user_id."
  caption: "All three categories in one query: Azure storage, Postgres, and JSON ingestion."
  relative: true
  hidden: false
---

Three categories I keep reaching for lately 🚀

### Azure / AWS ☁️

- Connect straight to S3 or Azure Storage and query files directly
- Use secure, modern auth like RBAC, tokens and CLI creds

### JSON / CSV 📄

- Load and explore semi-structured or flat files from anywhere
- Automatic schema inference that feels like magic
- Use asterisk wildcard to easily load multiple files

### Postgres / MySQL 🗄️

- Attach external databases as if they were part of DuckDB
- Join and query across multiple systems without friction
- Stream data both ways for fast ETL and rapid prototyping

Still not on the "ducktrain"? Have a look at [duckdb.org](https://duckdb.org/).

---

*Originally posted [on LinkedIn](https://www.linkedin.com/feed/update/urn:li:activity:7396843466993049600/).*
