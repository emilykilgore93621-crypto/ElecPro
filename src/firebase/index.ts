'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'

// This function ensures Firebase is initialized only once.
function getFirebaseApp(): FirebaseApp {
  if (getApps().length > 0) {
    return getApp();
  }
  return initializeApp(firebaseConfig);
}

// IMPORTANT: DO NOT MODIFY THIS FUNCTION
export function initializeFirebase() {
  const firebaseApp = getFirebaseApp();
  const firestore = getFirestore(firebaseApp);
  const auth = getAuth(firebaseApp);
  
  return {
    firebaseApp,
    auth,
    firestore,
  };
}

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './auth/use-user';
export * from './errors';
export * from './error-emitter';
