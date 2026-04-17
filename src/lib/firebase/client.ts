"use client";
import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const hasConfig = !!firebaseConfig.apiKey && !!firebaseConfig.projectId;

let _app: FirebaseApp | null = null;
let _auth: Auth | null = null;
let _db: Firestore | null = null;
let _storage: FirebaseStorage | null = null;

function getAppSafe(): FirebaseApp | null {
  if (!hasConfig) return null;
  if (_app) return _app;
  _app = getApps().length ? getApp() : initializeApp(firebaseConfig as Required<typeof firebaseConfig>);
  return _app;
}

export function getFirebaseAuth(): Auth {
  const app = getAppSafe();
  if (!app) throw new Error("Firebase is not configured. Set NEXT_PUBLIC_FIREBASE_* env vars.");
  if (!_auth) _auth = getAuth(app);
  return _auth;
}

export function getDb(): Firestore {
  const app = getAppSafe();
  if (!app) throw new Error("Firebase is not configured.");
  if (!_db) _db = getFirestore(app);
  return _db;
}

export function getStorageClient(): FirebaseStorage {
  const app = getAppSafe();
  if (!app) throw new Error("Firebase is not configured.");
  if (!_storage) _storage = getStorage(app);
  return _storage;
}

// Legacy named exports — lazy proxies so importing does not initialise Firebase at build time.
export const auth = new Proxy({} as Auth, {
  get(_t, prop) { return (getFirebaseAuth() as any)[prop]; },
});
export const db = new Proxy({} as Firestore, {
  get(_t, prop) { return (getDb() as any)[prop]; },
});
export const storage = new Proxy({} as FirebaseStorage, {
  get(_t, prop) { return (getStorageClient() as any)[prop]; },
});

export async function initAnalytics() {
  if (typeof window === "undefined") return null;
  const app = getAppSafe();
  if (!app) return null;
  try {
    const { getAnalytics, isSupported } = await import("firebase/analytics");
    if (await isSupported()) return getAnalytics(app);
  } catch {}
  return null;
}
