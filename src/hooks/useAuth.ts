import { useState, useEffect } from 'react';
import type { User } from 'firebase/auth';
import { auth, db, signInWithGoogle, logout } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import type { UserStats } from '../types';

const INITIAL_STATS: UserStats = {
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
  setStats: React.Dispatch<React.SetStateAction<UserStats>>;
  isAuthReady: boolean;
  isLoading: boolean;
  signIn: () => Promise<void>;
  signOut: () => void;
}

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<UserStats>(INITIAL_STATS);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = require('firebase/auth').onAuthStateChanged(auth, async (currentUser: User | null) => {
      setUser(currentUser);
      
      if (currentUser) {
        const userDocRef = doc(db, 'users', currentUser.uid);
        try {
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            setStats(userDoc.data() as UserStats);
          } else {
            const newStats = {
              ...INITIAL_STATS,
              displayName: currentUser.displayName,
              photoURL: currentUser.photoURL,
            };
            await setDoc(userDocRef, newStats);
            setStats(newStats);
          }
        } catch (error) {
          console.error('Error loading user stats:', error);
        }
      } else {
        setStats(INITIAL_STATS);
      }
      
      setIsAuthReady(true);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

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
