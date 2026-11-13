---
title: "Fine Print"
order: 2
github_link: "https://github.com/AE-CuriousSolver/CookieMonster"
key_stack: "Next.js · Supabase · Gemini API · Claude Code"
what: "Enter a company's website and get **short, plain-English FYIs** on what data and access you hand over by accepting its privacy policy, terms and cookie policy. Neutral, not judgemental."
purpose: "A dry run to learn how to **ship a full app end to end with AI-assisted development**, and to document the process: tools, setup, and **how to make an AI step trustworthy**."
stack: "Next.js (App Router), TypeScript, Tailwind CSS · Supabase (Postgres, row level security) · Vercel (auto-deploys from GitHub) · Google Gemini API · built in Cursor with the Claude Code extension"
how_it_works:
  - "Code, not AI, finds the policies: it scans the site's footer links and scores them with configurable word lists"
  - "The AI step reads the policies with a versioned prompt and returns findings by category: data collected, how it's used, who it's shared with, how long it's kept, tracking and user controls"
  - "Every finding quotes the policy text it's based on, and code checks the quote really exists, to catch invented claims"
learnings:
  - "Use code for what can be checked and AI only where judgement is needed"
  - "A hand-written answer key makes it possible to measure prompt changes rather than guess"
  - "Mock the AI call in tests so they're fast, free and repeatable"
  - "Project rules (CLAUDE.md) and planning before building keep an AI assistant on track"
futures:
  - "Keep improving the Gemini prompt and answer key"
  - "Diversify the use cases and the kinds of sites it can read"
  - "Add features such as policy consequences"
---
