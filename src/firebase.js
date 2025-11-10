import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyApH9Pm--PC0-u8gBivTGwrdj0uubYb2Rc",
  authDomain: "soccer-match-d03fa.firebaseapp.com",
  projectId: "soccer-match-d03fa",
  storageBucket: "soccer-match-d03fa.firebasestorage.app",
  messagingSenderId: "547136080297",
  appId: "1:547136080297:web:59d76fe26a45449a2b9cb8",
  measurementId: "G-6GLWC036TT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Initialize auth providers
export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();

export default app;
