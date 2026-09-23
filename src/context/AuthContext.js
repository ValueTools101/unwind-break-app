import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile,
  GoogleAuthProvider,
  signInWithCredential,
  deleteUser,
} from 'firebase/auth';
import { auth, GOOGLE_WEB_CLIENT_ID, GOOGLE_ANDROID_CLIENT_ID } from '../config/firebaseConfig';
import { setOnLocalChangeHandler } from '../utils/storage';
import { setCurrentUid, syncPush, syncPullAndMerge } from '../utils/cloudSync';

WebBrowser.maybeCompleteAuthSession();

const AuthContext = createContext(null);

setOnLocalChangeHandler(() => {
  syncPush().catch(() => {});
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [syncing, setSyncing] = useState(false);

  const [, googleResponse, promptGoogleSignIn] = Google.useAuthRequest({
    webClientId: GOOGLE_WEB_CLIENT_ID,
    androidClientId: GOOGLE_ANDROID_CLIENT_ID,
  });

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        setSyncing(true);
        try {
          await syncPullAndMerge(u.uid);
        } catch (e) {
          // Offline or Firestore not set up yet — local data still works fine standalone.
        }
        setSyncing(false);
      } else {
        setCurrentUid(null);
      }
      setInitializing(false);
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (googleResponse?.type === 'success') {
      const { id_token } = googleResponse.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential).catch((e) => setAuthError(e.message));
    }
  }, [googleResponse]);

  const signUp = useCallback(async (email, password, displayName) => {
    setAuthError(null);
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName) await updateProfile(cred.user, { displayName });
    return cred.user;
  }, []);

  const signIn = useCallback(async (email, password) => {
    setAuthError(null);
    return signInWithEmailAndPassword(auth, email, password);
  }, []);

  const resetPassword = useCallback(async (email) => {
    setAuthError(null);
    return sendPasswordResetEmail(auth, email);
  }, []);

  const signOutUser = useCallback(async () => {
    setCurrentUid(null);
    await firebaseSignOut(auth);
  }, []);

  const deleteAccount = useCallback(async () => {
    if (!auth.currentUser) return;
    setCurrentUid(null);
    await deleteUser(auth.currentUser);
  }, []);

  const value = {
    user,
    initializing,
    authError,
    setAuthError,
    syncing,
    signUp,
    signIn,
    resetPassword,
    signOut: signOutUser,
    deleteAccount,
    signInWithGoogle: () => {
      if (GOOGLE_WEB_CLIENT_ID.startsWith('REPLACE_ME') || GOOGLE_ANDROID_CLIENT_ID.startsWith('REPLACE_ME')) {
        setAuthError("Google sign-in isn't set up yet — see README, or just use email/password for now.");
        return;
      }
      promptGoogleSignIn();
    },
    isSignedIn: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
