import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

/**
 * Second argument to getFirestore(). Must be a Firestore database id (usually "(default)").
 * Do NOT use Google Analytics measurementId (G-xxxxxxxx) — that causes "Database not found".
 */
function resolveFirestoreDatabaseId(raw: string | undefined): string {
  const trimmed = raw?.trim();
  if (!trimmed) return '(default)';
  if (/^G-[A-Z0-9]+$/i.test(trimmed)) {
    if (typeof console !== 'undefined' && console.warn) {
      console.warn(
        '[Firebase] NEXT_PUBLIC_FIREBASE_DATABASE_ID looks like Google Analytics measurementId (G-...). ' +
          'Remove it in Vercel or leave unset. Using Firestore database "(default)".',
      );
    }
    return '(default)';
  }
  return trimmed;
}

// Firebase configuration - uses environment variables (must be set at build time on Vercel)
// Values come from Firebase Console → Project Settings → Web app
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const missingFirebaseEnv = [
  !firebaseConfig.apiKey && 'NEXT_PUBLIC_FIREBASE_API_KEY',
  !firebaseConfig.authDomain && 'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  !firebaseConfig.projectId && 'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  !firebaseConfig.storageBucket && 'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  !firebaseConfig.messagingSenderId && 'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  !firebaseConfig.appId && 'NEXT_PUBLIC_FIREBASE_APP_ID',
].filter(Boolean) as string[];

if (missingFirebaseEnv.length > 0) {
  throw new Error(
    `[Firebase] Missing environment variables: ${missingFirebaseEnv.join(', ')}. ` +
      'In Vercel: Project → Settings → Environment Variables, add them for Production (and Preview), then trigger a new deployment. ' +
      'Next.js inlines NEXT_PUBLIC_* at build time; a redeploy is required after changing variables.',
  );
}

// Initialize Firebase (only once)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

const firestoreDatabaseId = resolveFirestoreDatabaseId(process.env.NEXT_PUBLIC_FIREBASE_DATABASE_ID);

export const auth = getAuth(app);
export const db = getFirestore(app, firestoreDatabaseId);
export const googleProvider = new GoogleAuthProvider();

export default app;
