---
title: "Skyscanner Android — Multi-City Flight Search"
date: 2018-12-01
draft: false
projectType: "Feature (Android)"
platform: "Android, Skyscanner app"
status: "Shipped, Sep–Dec 2018 · still live"
link: "https://www.skyscanner.net/flights/advice/how-use-skyscanners-multi-city-flights-search"
tags: ["android", "kotlin", "skyscanner", "mobile"]
summary: "Shipping multi-city search to Skyscanner's Android app in my last semester there, working with the future founders of Bitraptors."
cover:
  image: "cover.jpeg"
  alt: "Skyscanner app showing a multi-city flight search"
---

In my last semester with Skyscanner, we took on multi-city search together with Csacsi and Hamu — who later went on to found [Bitraptors](http://bitraptors.com/) — and shipped it into the production app.

The iOS version and the backend already existed, so my job was porting it to Android. What made it fun was learning Android from scratch while working in a proper startup culture inside a bigger company: iterate fast, push through blockers, ship.

The Android codebase had a lot of legacy code. This was before agents, so I spent a lot of time just reading and tracing it — I even drew a diagram to understand how app state updated throughout the search lifecycle. The project shipped successfully, and the feature is still live today.
