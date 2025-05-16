import { initializeApp } from "firebase/app";
import { getDatabase, ref, get } from "firebase/database";
import { useAuth } from "@clerk/nextjs";

const firebaseConfig = {
  apiKey: "AIzaSyCks4yUeDnd8gZKVh12Z0x6mSgNJEnqWWs",
  authDomain: "codepadawan-e909a.firebaseapp.com",
  databaseURL: "https://codepadawan-e909a-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "codepadawan-e909a",
  storageBucket: "codepadawan-e909a.firebasestorage.app",
  messagingSenderId: "739998345731",
  appId: "1:739998345731:web:a6e9e036438359eac33c36",
  measurementId: "G-EFRX0BPMG0"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };