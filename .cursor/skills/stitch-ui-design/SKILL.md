# Stitch UI Design Integration — SKILL.md

Use Google Stitch to generate, edit, and manage UI screens for this project.
Stitch is an AI-native design tool powered by Gemini 2.5 that creates production-ready UI code.

## Prerequisites

1. Install Stitch CLI globally: `npm install -g @stitch-money/cli` (or use the web app at stitch.withgoogle.com)
2. Set `STITCH_API_KEY` environment variable (get from stitch.withgoogle.com/settings)

## Workflow

### 1. Create a Stitch Project

```typescript
import { stitch } from '@google/stitch-sdk';

const project = await stitch.createProject('Suri Learning');
console.log(project.projectId); // Save this — it's your project ID
```

Or via the web app at https://stitch.withgoogle.com/

### 2. Generate a UI Screen

```typescript
import { stitch } from '@google/stitch-sdk';

const project = stitch.project('YOUR_PROJECT_ID');
const screen = await project.generate(
  'A mobile-first flashcard screen with: flip animation, progress bar, streak counter, XP display, heart icons for lives',
  'MOBILE'
);
const html = await screen.getHtml();
const image = await screen.getImage();
```

### 3. Edit an Existing Screen

```typescript
const edited = await screen.edit(
  'Change the background to dark mode, increase button size, add a streak flame icon'
);
const editedHtml = await edited.getHtml();
```

### 4. Generate Design Variants

```typescript
const variants = await screen.variants(
  'Try a dark mode version with neon accents',
  { variantCount: 3, creativeRange: 'EXPLORE', aspects: ['COLOR_SCHEME', 'LAYOUT'] }
);
for (const variant of variants) {
  console.log(await variant.getHtml());
}
```

### 5. List All Screens in Project

```typescript
const project = stitch.project('YOUR_PROJECT_ID');
const screens = await project.screens();
for (const s of screens) {
  console.log(s.id, s.screenId);
}
```

## Stitch MCP Server (Cursor Agent Mode)

Cursor can use Stitch directly as an MCP tool. Add this to your MCP settings:

**File:** `%APPDATA%/Cursor/User/globalStorage/user-data/mcp.json`
(Or via Cursor Settings → MCP → Add new server)

```json
{
  "mcpServers": {
    "stitch": {
      "command": "npx",
      "args": ["-y", "@_davideast/stitch-mcp", "proxy"]
    }
  }
}
```

Or use the interactive setup wizard:

```bash
npx @_davideast/stitch-mcp init
```

Available MCP tools:
- `generate_screen_from_text` — Create a new screen from a text prompt
- `get_screen_code` — Fetch HTML/CSS of a specific screen
- `list_projects` — List all Stitch projects
- `list_screens` — List all screens in a project
- `edit_screen` — Edit an existing screen with a text prompt
- `generate_variants` — Create design variants of a screen

## Design System for Suri Learning

Use this as the design context when generating screens:

```
APP NAME: Suri Learning
TYPE: English learning app with gamification (IELTS focus)

BRAND COLORS:
- Primary: #ea580c (orange) — energy, enthusiasm
- Success/XP: #58cc02 (bright green) — progress, correct answers
- Hearts: #ff4b4b (red) — lives, danger
- Streak flame: #ff9600 (orange) — streak days
- Gold: #ffc800 (yellow) — gems, achievements
- Purple: #a560f2 (violet) — AI features
- Background: #f7f7f7 (light gray)
- Dark mode bg: #1e293b

TYPOGRAPHY:
- Headings: Space Grotesk (bold, modern)
- Body: Inter (clean, readable)

KEY COMPONENTS:
- Hearts row (top-left): Red heart icons showing remaining lives
- XP bar (top-center): Progress bar with current XP / needed XP
- Streak counter (top-right): Flame icon + day count
- Gems: Gold gem icons for in-app currency
- Lesson cards: Green checkmark when complete, locked if prerequisites unmet
- AI Chat bubble: Purple gradient background for AI responses
- Leaderboard: Ranked list with avatar, name, XP

SCREENS TO BUILD:
1. Dashboard/Home — daily lessons, streak, hearts, XP, leaderboard preview
2. Vocabulary Practice — flashcard with flip animation, 4 answer choices
3. Quiz Mode — timed questions, progress indicator, feedback animations
4. AI Chat — conversational AI for speaking/writing practice
5. Leaderboard — weekly ranking with top 3 highlighted
6. Profile — stats, achievements, streak history
7. Settings — theme toggle, notification prefs, account
```

## Export Format Priority

When generating screens, request export format in this priority:

1. **Tailwind CSS + React** (matches this project's stack)
2. **HTML + CSS** (fallback)
3. **Screenshot/Image** (for design review before coding)

## Tips

- Use `creativeRange: 'REFINE'` when iterating on a good design
- Use `creativeRange: 'EXPLORE'` when brainstorming new layouts
- Use `creativeRange: 'REIMAGINE'` for completely fresh approaches
- Request `deviceType: 'MOBILE'` for the primary Suri Learning mobile UI
- Always specify the brand colors and typography in the prompt
- Save generated HTML to `src/components/generated/` with a descriptive name
- Reference `public/` folder for any static assets Stitch generates
