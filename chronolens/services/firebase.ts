import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInAnonymously,
  signInWithCustomToken,
  onAuthStateChanged,
  Auth,
} from "firebase/auth";
import {
  getFirestore,
  Firestore,
  doc,
  collection,
  setDoc,
  addDoc,
  arrayUnion,
} from "firebase/firestore";

// Handle Environment Variables (Vite vs Cloud vs Node)
const getEnv = (key: string) => {
  // Check Vite
  if (
    typeof import.meta !== "undefined" &&
    (import.meta as any).env &&
    (import.meta as any).env[key]
  ) {
    return (import.meta as any).env[key];
  }
  // Check Standard Process
  if (typeof process !== "undefined" && process.env && process.env[key]) {
    return process.env[key];
  }
  return undefined;
};

// Declare globals provided by the Cloud environment
declare const __app_id: string | undefined;
declare const __firebase_config: string | undefined;
declare const __initial_auth_token: string | undefined;

// Default fallbacks
const DEFAULT_APP_ID = "chronolens-default";
const DEFAULT_CONFIG = "{}";

// Priority: Global Injection -> Env Variable -> Default
export const appId =
  (typeof __app_id !== "undefined" ? __app_id : getEnv("VITE_APP_ID")) ||
  DEFAULT_APP_ID;
const rawConfig =
  (typeof __firebase_config !== "undefined"
    ? __firebase_config
    : getEnv("VITE_FIREBASE_CONFIG")) || DEFAULT_CONFIG;

let firebaseConfig;
try {
  firebaseConfig = JSON.parse(rawConfig);
} catch (e) {
  console.warn("Error parsing firebase config, defaulting to empty");
  firebaseConfig = {};
}

const initialToken =
  typeof __initial_auth_token !== "undefined" ? __initial_auth_token : null;

let db: Firestore | null = null;
let auth: Auth | null = null;

export const initFirebase = async (): Promise<{
  db: Firestore | null;
  auth: Auth | null;
  userId: string;
}> => {
  // --- OFFLINE MODE FALLBACK ---
  if (Object.keys(firebaseConfig).length === 0) {
    console.warn(
      "⚠️ Firebase config missing. Initializing in OFFLINE GUEST MODE.",
    );
    return {
      db: null,
      auth: null,
      userId: "guest-" + Math.floor(Math.random() * 10000),
    };
  }

  try {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);

    return new Promise((resolve, reject) => {
      const unsubscribe = onAuthStateChanged(auth!, async (user) => {
        if (user) {
          unsubscribe();
          resolve({ db: db!, auth: auth!, userId: user.uid });
        } else {
          try {
            if (initialToken) {
              await signInWithCustomToken(auth!, initialToken);
            } else {
              await signInAnonymously(auth!);
            }
            // Listener will trigger again with user
          } catch (e) {
            // If auth fails, fallback to offline
            console.error("Auth failed, falling back to offline:", e);
            unsubscribe();
            resolve({
              db: null,
              auth: null,
              userId: "guest-offline",
            });
          }
        }
      });
    });
  } catch (e) {
    console.error("Firebase Init Failed:", e);
    return { db: null, auth: null, userId: "guest-error" };
  }
};

export const ensureFamilyExists = async (
  db: Firestore | null,
  familyId: string,
  userId: string,
) => {
  if (!db) return; // Skip if offline
  const familyRef = doc(
    db,
    `/artifacts/${appId}/public/data/families`,
    familyId,
  );
  await setDoc(
    familyRef,
    {
      name: "ChronoLens Family",
      members: arrayUnion(userId),
    },
    { merge: true },
  );
};
