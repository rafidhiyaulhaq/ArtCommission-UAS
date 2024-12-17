import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; 

const firebaseConfig = {
  apiKey: "AIzaSyC3QOOU9xhY_x-paNI8HVL9Vc8_3Hs6Bs0",
  authDomain: "artcommission-uas.firebaseapp.com",
  projectId: "artcommission-uas",
  storageBucket: "artcommission-uas.firebasestorage.app",
  messagingSenderId: "881404158660",
  appId: "1:881404158660:web:dada6352796523be5cdf91",
  measurementId: "G-B2HQVFB1KD"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);