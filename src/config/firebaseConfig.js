// Fill these in from your Firebase Console: Project Settings → General → Your apps → SDK setup
// https://console.firebase.google.com — create a free project (a NEW one, separate from
// Cycle Planner's, so the two apps' users/data stay independent), then add a Web app (yes,
// even for a native app — the JS SDK config is the same) to get these values.
//
// Also enable, under Authentication → Sign-in method:
//   - Email/Password
//   - Google (needs an OAuth client ID from Google Cloud Console — see README)

import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence, getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: 'REPLACE_ME',
  authDomain: 'REPLACE_ME.firebaseapp.com',
  projectId: 'REPLACE_ME',
  storageBucket: 'REPLACE_ME.firebasestorage.app',
  messagingSenderId: 'REPLACE_ME',
  appId: 'REPLACE_ME',
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// initializeAuth with AsyncStorage persistence keeps the user logged in between app opens.
// If this throws "already initialized" during Fast Refresh in dev, that's expected — fall
// back to getAuth(app) below.
let auth;
try {
  auth = initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) });
} catch (e) {
  auth = getAuth(app);
}

export { app, auth };
export const db = getFirestore(app);

// Google OAuth client ID (from Google Cloud Console → APIs & Services → Credentials).
// You need a separate "Web application" type client ID even for the Android build,
// because Firebase's signInWithCredential flow uses the web client ID as the audience.
export const GOOGLE_WEB_CLIENT_ID = 'REPLACE_ME.apps.googleusercontent.com';

// expo-auth-session's Google provider requires an androidClientId to be present just to
// initialize on Android — even before the user taps "Continue with Google" — or the app
// crashes on load with "Client Id property 'androidClientId' must be defined...".
// A placeholder string is enough to stop that crash; sign-in itself won't work until you
// create a real Android OAuth client ID in Google Cloud Console and paste it in here.
export const GOOGLE_ANDROID_CLIENT_ID = 'REPLACE_ME.apps.googleusercontent.com';
