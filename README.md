# IELTS English Learning Platform

A gamified, mobile-first IELTS English learning application with AI-powered speaking practice, spaced repetition vocabulary learning, and leaderboards.

![IELTS Learning Platform](https://img.shields.io/badge/Platform-Next.js%2016-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)
![Firebase](https://img.shields.io/badge/Firebase-12-orange?style=flat-square&logo=firebase)
![Gemini AI](https://img.shields.io/badge/AI-Gemini%20AI-green?style=flat-square&logo=google)

## Features

### Core Learning Features

- **AI Speaking Practice** - Chat with an AI tutor for IELTS speaking preparation. Get real-time grammar feedback and vocabulary hints.
- **Vocabulary Learning** - Learn words organized by IELTS bands (0-7) and CEFR levels (A1-C2)
- **Flashcard System** - Interactive flashcards with definitions, examples, and pronunciation
- **Multiple Quiz Types**:
  - Definition matching
  - Collocation tests
  - Fill-in-the-blank
  - Sentence building
  - Keyword transformation
  - Speaking practice (voice input)
- **Spaced Repetition System (SRS)** - SuperMemo-2 algorithm for optimal retention
- **Daily Review** - Review due words based on SRS scheduling

### Gamification

- **XP System** - Earn experience points for completing lessons and quizzes
- **Rank Progression** - Progress through ranks: Bronze (1-4), Silver (5-9), Gold (10-14), Platinum (15-19), Diamond (20-24), Elite (25-29), Master (30-39), Legend (40+)
- **Leaderboards** - Weekly and monthly XP competitions
- **Streak Tracking** - Maintain daily learning streaks
- **Band Unlocking** - Unlock higher IELTS band content as you progress

### Content Organization

- **8 IELTS Bands** (0-7) with progressive difficulty
- **40+ Topics** covering vocabulary and grammar
- **Grammar Stations** - Interactive grammar lessons
- **Micro Skills** - Reading and listening practice

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 16 |
| UI Library | React 19 |
| Styling | Tailwind CSS 4 |
| Animation | Framer Motion 12 |
| Backend | Firebase 12 (Auth, Firestore) |
| AI | Google Gemini AI |
| Icons | Lucide React |
| Charts | Recharts |
| Markdown | React Markdown |

## Prerequisites

- **Node.js** 18+ (recommended: 20 LTS)
- **npm** or **yarn** package manager
- **Firebase Project** with Firestore and Authentication enabled
- **Gemini API Key** from Google AI Studio

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd "suri learning"
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Copy the example environment file:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:

```env
# Gemini AI Configuration
GEMINI_API_KEY=your_gemini_api_key_here

# Firebase Client Configuration (Public)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 4. Firebase Setup

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
2. Enable **Authentication** (Email/Password provider)
3. Enable **Firestore Database**
4. Create a web app and copy the config values

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Next.js dev server on port 3000 |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run clean` | Remove build artifacts |

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GEMINI_API_KEY` | Yes | Google Gemini AI API key (server-side only) |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Yes | Firebase API key (public) |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Yes | Firebase auth domain |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Yes | Firebase project ID |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Yes | Firebase storage bucket |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Yes | Firebase messaging sender ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Yes | Firebase app ID |
| `FIREBASE_ADMIN_*` | No | Server-side Firebase Admin (optional) |

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   └── gemini/        # Gemini AI endpoints
│   │       ├── chat/      # AI chat endpoint
│   │       ├── explain/   # Word explanation endpoint
│   │       ├── feedback/   # Grammar feedback endpoint
│   │       └── paraphrase/# Paraphrase endpoint
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/             # React components
│   ├── App.tsx            # Main app wrapper
│   ├── BottomNav.tsx      # Mobile navigation
│   ├── Flashcard.tsx      # Flashcard component
│   ├── Header.tsx         # App header
│   ├── Toast.tsx          # Toast notifications
│   └── ThemeToggle.tsx    # Theme switcher
├── data/                   # Static data
│   ├── grammar.ts         # Grammar content
│   ├── microSkills.ts     # Reading/listening skills
│   ├── topics.ts          # Topic definitions
│   └── vocab.ts           # Vocabulary database
├── hooks/                  # React hooks
│   ├── useAuth.ts         # Firebase auth hook
│   ├── useTheme.tsx       # Theme context
│   └── useToast.ts        # Toast notifications
├── lib/                    # Utilities
│   ├── firebase-auth.ts   # Firebase auth helpers
│   ├── firebase-client.ts # Firebase client config
│   └── firebase-admin.ts  # Firebase Admin SDK
├── services/               # Business logic
│   ├── aiService.ts       # AI service interface
│   ├── dictionaryService.ts
│   └── geminiService.ts  # Gemini AI integration
├── types.ts               # TypeScript type definitions
├── utils/                 # Utility functions
│   ├── quizGenerator.ts   # Quiz generation
│   ├── rankSystem.ts      # XP/rank calculations
│   └── srs.ts             # Spaced repetition (SM-2)
└── views/                 # Screen components
    ├── AIChatView.tsx     # AI chat screen
    ├── LeaderboardView.tsx# Leaderboard screen
    ├── LessonCompleteView.tsx
    ├── PremiumModal.tsx   # Premium upgrade modal
    ├── ProfileView.tsx    # User profile
    ├── QuizView.tsx       # Quiz screen
    └── SettingsView.tsx   # Settings screen
```

## Key Features Explained

### Spaced Repetition System (SRS)

The app uses the **SuperMemo-2 (SM-2)** algorithm for vocabulary retention:

- Words are scheduled for review based on recall quality
- Quality ratings: 0-5 (0 = blackout, 5 = perfect recall)
- Intervals increase exponentially for well-remembered words
- E-factor adjusts based on performance

### XP and Rank System

XP is earned through:
- Completing lessons (+50-100 XP)
- Scoring high on quizzes (+20-50 XP per question)
- Maintaining streaks (bonus multiplier)

Rank thresholds use the formula: `level = floor(sqrt(xp / 50)) + 1`

### Band Progression

Content is organized into 8 IELTS bands (0-7):
- **Band 0**: Beginner vocabulary (A1)
- **Bands 1-2**: Elementary (A1-A2)
- **Bands 3-4**: Intermediate (B1-B2)
- **Bands 5-6**: Upper Intermediate (B2-C1)
- **Band 7**: Advanced (C2)

Users unlock higher bands by completing topics in lower bands.

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project to [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy

```bash
# Using Vercel CLI
npm i -g vercel
vercel
```

### Manual Build

```bash
npm run build
npm run start
```

## API Routes

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/gemini/chat` | POST | AI chat conversation |
| `/api/gemini/explain` | POST | Explain a word/phrase |
| `/api/gemini/feedback` | POST | Get grammar feedback |
| `/api/gemini/paraphrase` | POST | Generate paraphrases |

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for contribution guidelines.

## License

Private project. All rights reserved.
