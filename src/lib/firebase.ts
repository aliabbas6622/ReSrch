import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInAnonymously,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  getDocs,
  collection,
  deleteDoc,
  getDocFromServer,
  query,
  orderBy,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { SwarmSession } from '../types';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Auth helpers
export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (err) {
    console.error('Google Sign In Error:', err);
    throw err;
  }
}

export async function signInAnonymouslyUser() {
  try {
    const result = await signInAnonymously(auth);
    return result.user;
  } catch (err) {
    console.error('Anonymous Sign In Error:', err);
    throw err;
  }
}

export async function logoutUser() {
  try {
    await signOut(auth);
  } catch (err) {
    console.error('Sign Out Error:', err);
  }
}

// Firestore Sync Helpers
export async function saveSwarmSessionToFirestore(session: SwarmSession, userId?: string) {
  const collectionPath = userId ? `users/${userId}/swarm_sessions` : 'swarm_sessions';
  const docPath = `${collectionPath}/${session.id}`;
  try {
    const docRef = doc(db, collectionPath, session.id);
    await setDoc(docRef, {
      ...session,
      updatedAt: Date.now(),
      syncedAt: new Date().toISOString(),
    }, { merge: true });
    return true;
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, docPath);
    return false;
  }
}

export async function fetchUserSwarmSessions(userId?: string): Promise<SwarmSession[]> {
  const collectionPath = userId ? `users/${userId}/swarm_sessions` : 'swarm_sessions';
  try {
    const colRef = collection(db, collectionPath);
    const snapshot = await getDocs(colRef);
    const list: SwarmSession[] = [];
    snapshot.forEach((docSnap) => {
      list.push(docSnap.data() as SwarmSession);
    });
    // Sort newest first
    return list.sort((a, b) => b.createdAt - a.createdAt);
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, collectionPath);
    return [];
  }
}

export async function deleteSwarmSessionFromFirestore(sessionId: string, userId?: string) {
  const collectionPath = userId ? `users/${userId}/swarm_sessions` : 'swarm_sessions';
  const docPath = `${collectionPath}/${sessionId}`;
  try {
    await deleteDoc(doc(db, collectionPath, sessionId));
    return true;
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, docPath);
    return false;
  }
}

async function testConnection() {
  try {
    await getDocFromServer(doc(db, '_connection_test', 'ping'));
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes('the client is offline')
    ) {
      console.warn('Firebase client is offline or initializing.');
    }
  }
}

testConnection();

