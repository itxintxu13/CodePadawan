import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "tu_api_key_default",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "tu_auth_domain_default",
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || "https://codepadawan-e909a-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "codepadawan-e909a",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "codepadawan-e909a.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "739998345731",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:739998345731:web:a6e9e036438359eac33c36",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-EFRX0BPMG0",
};

// Inicializar Firebase solo una vez
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Exportar app, auth, firestore y realtime database
export const auth = getAuth(app);
export const db = getFirestore(app);
export const database = getDatabase(app);

export { app };
