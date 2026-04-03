# Suri Learning - Deploy on Vercel

## Migration Complete

This project has been migrated from Vite + Express to **Next.js 16** for optimal Vercel deployment.

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file or set up in Vercel Dashboard:

```bash
# Gemini AI API Key (Server-side)
GEMINI_API_KEY=your_gemini_api_key

# Firebase Config (Client-side, public)
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef
NEXT_PUBLIC_FIREBASE_DATABASE_ID=your-database-id
```

### 3. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

### 4. Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

Or connect your GitHub repo in Vercel Dashboard for automatic deployments.

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Main page (SPA wrapper)
│   ├── layout.tsx            # Root layout
│   ├── globals.css           # Global styles
│   └── api/
│       └── gemini/           # Serverless AI API routes
│           ├── explain/
│           ├── feedback/
│           ├── chat/
│           └── paraphrase/
├── components/
│   └── App.tsx               # App wrapper (client-side)
├── lib/
│   ├── firebase-client.ts    # Firebase config
│   ├── firebase-auth.ts      # Auth functions
│   └── firebase-error.ts     # Error handling
└── services/
    └── aiService.ts          # AI service (uses API routes)
```

## API Routes

All AI features now run through secure serverless functions:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/gemini/explain` | POST | Word explanation |
| `/api/gemini/feedback` | POST | Writing feedback |
| `/api/gemini/chat` | POST | AI conversation |
| `/api/gemini/paraphrase` | POST | Paraphrase generation |

## Benefits

- **SEO**: SSR/SSG support
- **Performance**: Edge functions for AI
- **Security**: API keys stay server-side
- **Scalability**: Serverless architecture
- **Cost**: Free tier (100GB bandwidth)

## Troubleshooting

### Build Errors

If you see TypeScript errors related to the old Vite setup:

```bash
npm run clean
npm run build
```

### Firebase Connection Issues

Make sure `NEXT_PUBLIC_` prefix is used for client-side Firebase variables.

### `auth/invalid-api-key` on Vercel (page fails to load)

This means the browser build has no valid Firebase Web API key. Fix:

1. **Vercel → your project → Settings → Environment Variables**  
   Add every variable from `.env.example` under **Production** (and **Preview** if you use preview URLs). Names must match exactly (including `NEXT_PUBLIC_`).

2. **Redeploy**  
   `NEXT_PUBLIC_*` values are baked in at **build** time. After adding or fixing variables, run **Deployments → … → Redeploy** (or push a new commit). Editing env alone does not update an old deployment.

3. **Firebase Console → Authentication → Settings → Authorized domains**  
   Add `suri-learning.vercel.app` and your custom domain if any (required for Google sign-in).

4. **CLI (optional)**  
   If `vercel whoami` fails, run `vercel login`, then `vercel link` in this repo and `vercel env pull .env.local` to verify local parity.

### Gemini API Errors

Verify `GEMINI_API_KEY` is set in environment variables (without prefix for server-side).

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run clean` | Clean build artifacts |
