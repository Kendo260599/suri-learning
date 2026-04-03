import { useState, useEffect, useCallback, useRef } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { auth, db, signInWithGoogle, logout } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import type { UserStats } from '../types';

export const INITIAL_STATS: UserStats = {
  xp: 0,
  streak: 0,
  lastActive: new Date().toISOString(),
  unlockedBands: [1],
  unlockedTopics: ['1-1'],
  completedWords: [],
  completedTopics: [],
  completedGrammar: [],
  completedMicroSkills: [],
};

export interface UseAuthReturn {
  user: User | null;
  stats: UserStats;
  setStats: (updater: UserStats | ((prev: UserStats) => UserStats)) => Promise<void>;
  isAuthReady: boolean;
  isLoading: boolean;
  signIn: () => Promise<void>;
  signOut: () => void;
}

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStatsState] = useState<UserStats>(INITIAL_STATS);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const userDocRef = useRef<ReturnType<typeof doc> | null>(null);
  const pendingSync = useRef<boolean>(false);
  const syncTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser: User | null) => {
      setUser(currentUser);

      if (currentUser) {
        userDocRef.current = doc(db, 'users', currentUser.uid);
        try {
          const userDoc = await getDoc(userDocRef.current);
          if (userDoc.exists()) {
            setStatsState(userDoc.data() as UserStats);
          } else {
            const newStats: UserStats = {
              ...INITIAL_STATS,
              displayName: currentUser.displayName,
              photoURL: currentUser.photoURL,
            };
            await setDoc(userDocRef.current, newStats);
            setStatsState(newStats);
          }
        } catch (error) {
          console.error('Error loading user stats:', error);
        }
      } else {
        userDocRef.current = null;
        setStatsState(INITIAL_STATS);
      }

      setIsAuthReady(true);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const setStats = useCallback(async (updater: UserStats | ((prev: UserStats) => UserStats)) => {
    const nextStats = typeof updater === 'function'
      ? (updater as (prev: UserStats) => UserStats)(stats)
      : updater;

    setStatsState(nextStats);

    if (!userDocRef.current) return;

    if (syncTimeout.current) clearTimeout(syncTimeout.current);
    pendingSync.current = true;

    syncTimeout.current = setTimeout(async () => {
      if (pendingSync.current && userDocRef.current) {
        try {
          await setDoc(userDocRef.current, nextStats, { merge: true });
          pendingSync.current = false;
        } catch (error) {
          console.error('Error syncing stats to Firebase:', error);
        }
      }
    }, 1000);
  }, [stats]);

  const signIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  };

  const signOut = () => {
    logout();
  };

  return { user, stats, setStats, isAuthReady, isLoading, signIn, signOut };
};
