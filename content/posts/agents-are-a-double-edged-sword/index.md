---
title: "Agents are a double-edged sword"
date: 2026-09-18
draft: false
tags: ["ai", "agents", "engineering"]
categories: ["ai"]
summary: "I told my agent it wasn't even trying. It tried again, found the right IP, and killed my Wi-Fi. Non-determinism cuts both ways."
cover:
  image: "cover.jpeg"
  alt: "A curly-haired developer in glasses and a robot with a brain logo dueling with lightsabers in an office, a cat sleeping in a box behind them."
  caption: "Me vs. my agent."
  relative: true
  hidden: false
---

I asked my agent to find my Windows PC on the home network. It tried and concluded it was not possible.

I was tired, and for some reason I told it:

"It feels like you are not even trying."

It was supposed to be a joke. ChatGPT would laugh and send me back a pun. 😄

Not Claude. Claude is like an autistic overachiever. "Fair challenge," and it tried again. This time, it came back with the right IP. 🤖

It also killed my Wi-Fi, and I spent 2 hours debugging my home network, only to find that restarting my laptop would make everything go back online again. 😅

Agents are a double-edged sword. ⚔️

I asked it to debug an issue, and I spent 30 minutes convincing it that the issue was real and that I didn't hallucinate it.

Another time, it didn't ask back. It just fixed an imaginary issue that was the result of me phrasing the question wrong.

So, if we want to use agents deterministically, i.e. force them to produce the same results every time, then we need to apply a lot of engineering around the agent to make it happen:

- custom-written tools
- custom-written harness
- context engineering
- specific skills
- subagents
- custom workflows

Or, we can just live with the non-determinism and use trial and error. 🎲
