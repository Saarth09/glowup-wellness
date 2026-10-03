# glowup 🌱 — the wellness game

**A wellness game where every healthy action earns XP, builds your streak, and helps you level up and dress up your own character.**

Built for the Mosaic Wellness · CEO's Office Builder Round.

## Who it's for

People who *want* to look after their body and mind but struggle with consistency, and who lose their evenings to fast, high-stimulation scrolling right before bed. Habit trackers feel like homework to them; games don't.

## What it does

The whole app is one loop:

> **Pick an activity → do it → earn XP → keep your streak → unlock an item → glow up your avatar**

- **Your own avatar.** Pick a girl or boy character at sign-up, then choose skin tone, hair, hair colour, outfit, shoes, extras and world. Each body type has its own wardrobe: boys get side parts, spiky hair, buzz cuts, quiffs, cargo pants, cords, a cap and a beard, and girls get long hair, bobs, space buns, ponytails and skirts. Most other items are shared. You can switch any time. It's hand-drawn in SVG, with thick outlines and flat colours, and it blinks, bounces and does the poses with you.
- **Move** 🤸: 9 movement quests (stretching, mobility, yoga, squats, planks, HIIT), grouped from *Warm up* to *Boss mode*. Your avatar acts out each step.
- **Calm** 🧘: box breathing, 4-7-8, a body scan, grounding, loving-kindness and focus training. You can pick your own session length.
- **Unwind** 🌙: a dedicated bedtime mode that is the opposite of a feed. It offers **one** curated wind-down per night (a slow bedtime story, rain or ocean soundscapes, a body scan, sleepy breathing, or a three-good-things journal). You get one swap, then a "Goodnight, phone down" screen. Nothing autoplays and nothing suggests "one more".
- **XP = minutes × 8 × difficulty + completion bonus.** Harder and longer activities give more XP.
- **Two streaks:** a 🔥 daily wellness streak and a 🌙 wind-down streak, with milestones at 3, 7, 14 and 30 days.
- **Levels** and **51 avatar items** (43–44 per body type). For example: 500 XP gets you *Chonky Boots*, a 7-day streak gets you the *Superstar Fit*, 1,000 XP gets you *Little Devil* horns, and 30 days unlocks the *Galaxy* world plus *Rocket Kicks*. Items are themed by category: Calm earns cosy knits and headphones, Unwind earns PJs and bunny slippers, and Move earns jerseys and high-tops.
- **"How are you feeling?"**: tap Stiff, Stressed, Sluggish, Restless, Scattered or Can't sleep to get the right activity straight away.
- **Progress dashboard:** total XP, level, both streaks, activities done, time spent, XP by category, a 4-week streak calendar, items unlocked, and progress toward the next rewards.
- A clean dark UI inspired by habit apps like Liftoff: bold type, bright full-round pills, and crossed-out items once you've done them. It still has game moments: confetti, level-up and unlock reveals, and synthesised sound effects.

## What makes it interesting

1. **Your wellness shows up on a character that belongs to you.** Rewards are visible things you wear, not abstract badges.
2. **The bedtime mode is designed to end.** Most apps compete for your last hour of the night. Unwind deliberately gives you one thing, then tells you to go to sleep, and still rewards you for it with its own streak.
3. **It respects your time and privacy.** There's no account and no backend. Progress lives on your device, and every sound is generated in the browser.

## Try it fast (for reviewers)

Open the app → create your character → do any activity. On any activity, tap the **1×** chip to switch to **10× demo speed**.
In **Me → Demo tools** you can add 6 past days of history (which unlocks streak rewards), jump to tomorrow, or add +250 XP to see levels and unlocks right away.

## Tech

- React 19 + TypeScript + Vite, with no UI libraries.
- All art is hand-written SVG: the avatar system (2 body types), 8 poses, 51 items, and Pip the penguin.
- Web Audio API for sound effects plus generated rain and ocean noise.
- `localStorage` persistence, deployed as a static site on GitHub Pages.

```bash
npm install
npm run dev
npm run build
```

`scripts/` contains Playwright scripts that drive the app in headless Edge to capture screenshots and the demo video.

## AI tools used

- **Cursor (agent mode, Claude)** helped turn the product brief into an architecture, write all the code (game logic, the SVG avatar and item art, screens, CSS), and debug runtime issues.
- **Playwright scripts written by the agent** drove the app end to end in a headless browser to check every screen visually, catch console errors, and record the demo video.
- Product direction and the visual references (a hand-drawn flat character style, plus Liftoff and Charmi for the UI) came from me; the AI handled implementation and iteration.
