// ...existing code...
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDn1DPOBjt71eF3__IUrc9SCjb1iFbQqUw",
  authDomain: "mycinemaapp-f4d31.firebaseapp.com",
  projectId: "mycinemaapp-f4d31",
  storageBucket: "mycinemaapp-f4d31.firebasestorage.app",
  messagingSenderId: "605980974041",
  appId: "1:605980974041:web:c387fe87dcb0ee509e17c8",
  measurementId: "G-26K1RFTNSK",
};

// Initialize Firebase (safe for hot reloads)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
