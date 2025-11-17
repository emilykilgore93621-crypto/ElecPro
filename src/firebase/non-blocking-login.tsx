
'use client';
import {
  Auth, // Import Auth type for type hinting
  signInAnonymously,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  // Assume getAuth and app are initialized elsewhere
} from 'firebase/auth';
import { doc, setDoc, getFirestore, serverTimestamp, updateDoc, getDoc } from 'firebase/firestore';

const ADMIN_EMAIL = 'dev@wattsup.pro';

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
        
        // Directly check if the new user's email is the admin email
        const isAdmin = user.email === ADMIN_EMAIL;
        
        // We use setDoc with merge:true to be safe, though this is a new doc.
        // This is a non-blocking call.
        setDoc(userDocRef, {
          id: user.uid,
          email: user.email,
          registrationDate: serverTimestamp(),
          firstName: '',
          lastName: '',
          subscriptionStatus: isAdmin ? 'pro' : 'free',
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
export function initiateEmailSignIn(authInstance: Auth, email: string, password: string): void {
  // CRITICAL: Call signInWithEmailAndPassword directly. Do NOT use 'await signInWithEmailAndPassword(...)'.
  signInWithEmailAndPassword(authInstance, email, password)
    .then(async (userCredential) => {
        const user = userCredential.user;
        const db = getFirestore(authInstance.app);
        const userDocRef = doc(db, 'users', user.uid);

        const isAdmin = user.email === ADMIN_EMAIL;
        
        // Check if user document exists
        const docSnap = await getDoc(userDocRef);

        if (!docSnap.exists()) {
          // If doc doesn't exist, create it. This can happen for users created before this logic was in place.
          await setDoc(userDocRef, {
            id: user.uid,
            email: user.email,
            registrationDate: serverTimestamp(),
            subscriptionStatus: isAdmin ? 'pro' : 'free',
          }, { merge: true });
        } else if (isAdmin) {
            // If the user is admin, ensure their status is 'pro'.
            await updateDoc(userDocRef, { subscriptionStatus: 'pro' });
        }
    })
    .catch(error => {
        // The onAuthStateChanged listener will handle UI updates for login state,
        // but you might want to log sign-in-specific errors here if needed.
        console.error("Error during sign-in:", error);
    });
  // Code continues immediately. Auth state change is handled by onAuthStateChanged listener.
}
