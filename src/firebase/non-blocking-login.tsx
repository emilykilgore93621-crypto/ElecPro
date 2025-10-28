'use client';
import {
  Auth, // Import Auth type for type hinting
  signInAnonymously,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  // Assume getAuth and app are initialized elsewhere
} from 'firebase/auth';
import { doc, setDoc, getFirestore } from 'firebase/firestore';

/** Initiate anonymous sign-in (non-blocking). */
export function initiateAnonymousSignIn(authInstance: Auth): void {
  // CRITICAL: Call signInAnonymously directly. Do NOT use 'await signInAnonymously(...)'.
  signInAnonymously(authInstance);
  // Code continues immediately. Auth state change is handled by onAuthStateChanged listener.
}

/** Initiate email/password sign-up (non-blocking). */
export function initiateEmailSignUp(authInstance: Auth, email: string, password: string): void {
  // CRITICAL: Call createUserWithEmailAndPassword directly. Do NOT use 'await createUserWithEmailAndPassword(...)'.
  createUserWithEmailAndPassword(authInstance, email, password)
    .then(userCredential => {
      // User created successfully, now create their document in Firestore.
      const user = userCredential.user;
      if (user) {
        const db = getFirestore(authInstance.app);
        const userDocRef = doc(db, 'users', user.uid);
        // We use setDoc with merge:true to be safe, though this is a new doc.
        // This is a non-blocking call.
        setDoc(userDocRef, {
          id: user.uid,
          email: user.email,
          registrationDate: new Date().toISOString(),
          firstName: '',
          lastName: '',
        }, { merge: true });
      }
    })
    .catch(error => {
      // The onAuthStateChanged listener will handle UI updates for login state,
      // but you might want to log signup-specific errors here if needed.
      console.error("Error during sign-up:", error);
    });
  // Code continues immediately. Auth state change is handled by onAuthStateChanged listener.
}

/** Initiate email/password sign-in (non-blocking). */
export function initiateEmailSignIn(authInstance: Auth, email: string, password: string): void