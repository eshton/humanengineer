---
title: "I vibe-coded a Sudoku app and learned that product taste doesn't come free"
date: 2026-05-12
draft: false
tags: ["ai", "product", "engineering"]
categories: ["industry"]
summary: "AI can write all the code. It still can't magically create a great product - the taste has to come from somewhere else."
---

AI writes code now, so technically almost anything can be built quickly and efficiently. Engineers will all be laid off soon 😄

So I tried vibe coding a little Sudoku app myself. How hard can it be? A 9x9 grid and 3 rules, sounds easy, right? And honestly, I was right about the vibe coding part - I shipped a fully functioning app without ever looking at the code. 👀

What surprised me was all the tiny details and hard decisions that showed up along the way:

- **Scoring system:** it has to feel fair, reward both speed and precision, scale well, and still stay motivating. 🎯
- **Visual helpers:** finding the balance between helping the player and solving the puzzle for them. Too few and the app feels clunky, too many and you remove the joy of solving it. 🧩
- **Difficulty levels:** there are 10+ Sudoku solving techniques. Difficulty isn't just how many numbers are missing, it's how the puzzle has to be solved. One step too hard and the puzzle feels impossible; too easy everywhere and it gets repetitive. 🧠
- Winning conditions, error highlighting, hints, drafts, undo, save and resume, statistics, settings, animations, etc.

Then I showed it to five people and immediately got ten pieces of feedback, many of them directly contradicting each other. 😂

At that point it became obvious: AI can write all the code, but it still can't magically create a great product. Anyway, the app finally made it to the App Store, so I can cross this one off my bucket list. ✅

---

*Originally posted [on LinkedIn](https://www.linkedin.com/feed/update/urn:li:activity:7462098095640559616/).*
