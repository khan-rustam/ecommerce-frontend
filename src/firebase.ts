import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_KEY,
  authDomain: 'e-commerce-24-938fe.firebaseapp.com',
  projectId: 'e-commerce-24-938fe',
  storageBucket: 'e-commerce-24-938fe.appspot.com',
  messagingSenderId: '682421329432',
  appId: '1:682421329432:web:087af4a3d8f053f3e12d6d',
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
