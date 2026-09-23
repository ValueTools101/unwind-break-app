// A deliberately simple sync strategy: the whole app-state blob (journal, cart, stats) is
// read/written as ONE Firestore document per signed-in user, rather than fine-grained
// per-item syncing. That trades a little efficiency for a lot less room for merge bugs —
// fine at this app's data size. Voice recordings are NOT synced (see README) since that
// needs Firebase Storage (file upload), a larger separate piece of work.
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import {
  getJournalEntries,
  getCart,
  getStats,
  replaceJournalEntries,
  replaceCart,
  replaceStats,
} from './storage';

let currentUid = null;

export function setCurrentUid(uid) {
  currentUid = uid;
}

export function getCurrentUid() {
  return currentUid;
}

function mergeJournals(local, remote) {
  const byId = new Map();
  [...remote, ...local].forEach((entry) => byId.set(entry.id, entry));
  return Array.from(byId.values()).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export async function syncPush() {
  if (!currentUid) return;
  const [journal, cart, stats] = await Promise.all([getJournalEntries(), getCart(), getStats()]);
  await setDoc(
    doc(db, 'users', currentUid),
    { journal, cart, stats, updatedAt: serverTimestamp() },
    { merge: true }
  );
}

export async function syncPullAndMerge(uid) {
  if (!uid) return;
  const snap = await getDoc(doc(db, 'users', uid));
  const [localJournal, localCart, localStats] = await Promise.all([
    getJournalEntries(),
    getCart(),
    getStats(),
  ]);

  if (!snap.exists()) {
    setCurrentUid(uid);
    await syncPush();
    return;
  }

  const remote = snap.data();
  const mergedJournal = mergeJournals(localJournal, remote.journal || []);
  const mergedCart = localCart.length > 0 ? localCart : remote.cart || [];
  const mergedStats = {
    totalRelaxedSeconds: Math.max(
      localStats?.totalRelaxedSeconds || 0,
      remote.stats?.totalRelaxedSeconds || 0
    ),
  };

  await Promise.all([
    replaceJournalEntries(mergedJournal),
    replaceCart(mergedCart),
    replaceStats(mergedStats),
  ]);

  setCurrentUid(uid);
  await syncPush();
}
