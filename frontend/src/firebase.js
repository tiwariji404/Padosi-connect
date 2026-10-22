// Firebase Configuration & Service Wrapper for PadosiConnect
import { initializeApp, getApps } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  onSnapshot, 
  serverTimestamp 
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || ''
};

// Check if valid Firebase configuration is provided
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && 
  firebaseConfig.apiKey.length > 10 && 
  firebaseConfig.projectId
);

let app = null;
let auth = null;
let db = null;
let googleProvider = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    auth = getAuth(app);
    db = getFirestore(app);
    googleProvider = new GoogleAuthProvider();
    console.log('[Firebase] Initialized successfully with project:', firebaseConfig.projectId);
  } catch (err) {
    console.warn('[Firebase] Initialization error, falling back to local mode:', err);
  }
} else {
  console.info('[Firebase] Notice: VITE_FIREBASE_* environment variables are not set. Running in seamless Local/Demo mode. To connect live Firebase, copy .env.example to .env and insert your Firebase Project credentials.');
}

export { app, auth, db, googleProvider };

// Auth Helper Methods with graceful mock fallback
export async function firebaseLoginWithGoogle() {
  if (auth && googleProvider) {
    const result = await signInWithPopup(auth, googleProvider);
    return {
      uid: result.user.uid,
      name: result.user.displayName || 'Resident',
      email: result.user.email,
      photoURL: result.user.photoURL,
      society: 'Sunrise Apartments',
      city: 'Raipur',
      flat: 'B-402',
      role: 'member'
    };
  }
  // Mock fallback
  return {
    uid: 'demo_user_1',
    name: 'Aman Verma',
    email: 'aman.verma@example.com',
    photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    society: 'Sunrise Apartments',
    city: 'Raipur',
    flat: 'B-402',
    role: 'member'
  };
}

export async function firebaseLoginWithEmail(email, password) {
  if (auth) {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return {
      uid: result.user.uid,
      name: result.user.displayName || email.split('@')[0],
      email: result.user.email,
      society: 'Sunrise Apartments',
      city: 'Raipur',
      flat: 'B-402',
      role: 'member'
    };
  }
  return {
    uid: 'demo_user_email',
    name: email.split('@')[0],
    email,
    society: 'Sunrise Apartments',
    city: 'Raipur',
    flat: 'B-402',
    role: 'member'
  };
}

export async function firebaseRegisterWithEmail(email, password, displayName, society, flat) {
  if (auth) {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName) {
      await updateProfile(result.user, { displayName });
    }
    return {
      uid: result.user.uid,
      name: displayName || email.split('@')[0],
      email: result.user.email,
      society: society || 'Sunrise Apartments',
      city: 'Raipur',
      flat: flat || 'A-101',
      role: 'member'
    };
  }
  return {
    uid: 'demo_user_registered',
    name: displayName || email.split('@')[0],
    email,
    society: society || 'Sunrise Apartments',
    city: 'Raipur',
    flat: flat || 'A-101',
    role: 'member'
  };
}

export async function firebaseLogout() {
  if (auth) {
    await signOut(auth);
  }
  return true;
}

export function onFirebaseAuthStateChange(callback) {
  if (auth) {
    return onAuthStateChanged(auth, (user) => {
      if (user) {
        callback({
          uid: user.uid,
          name: user.displayName || user.email?.split('@')[0] || 'Resident',
          email: user.email,
          photoURL: user.photoURL,
          society: 'Sunrise Apartments',
          city: 'Raipur',
          flat: 'B-402',
          role: 'member'
        });
      } else {
        callback(null);
      }
    });
  }
  // If not configured, check localStorage
  const saved = localStorage.getItem('padosi_user');
  if (saved) {
    try {
      callback(JSON.parse(saved));
    } catch {
      callback(null);
    }
  } else {
    callback(null);
  }
  return () => {};
}
