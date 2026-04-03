/**
 * Firebase wrapper for Next.js
 * Re-exports from lib/firebase-client for compatibility
 */

export { auth, db, googleProvider } from './lib/firebase-client';
export { default } from './lib/firebase-client';
export { signInWithGoogle, logout } from './lib/firebase-auth';
export { handleFirestoreError, OperationType } from './lib/firebase-error';
