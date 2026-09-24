import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "nesto-4a9ad",
  appId: "1:601579734960:web:26abf4b72fb62f01b4b875",
  storageBucket: "nesto-4a9ad.firebasestorage.app",
  apiKey: "AIzaSyAunygYFfWT4gXKrMkhOyLOPdWky0ff8dI",
  authDomain: "nesto-4a9ad.firebaseapp.com",
  messagingSenderId: "601579734960",
  measurementId: "G-8WEY671PTK",
};

export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
