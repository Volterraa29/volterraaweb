// ===== firebase-config.js =====
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult, signOut, onAuthStateChanged }
  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, collection, addDoc, getDocs, deleteDoc, query, orderBy }
  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// ============================================================
// ⚠️  GANTI DENGAN KONFIGURASI FIREBASE KAMU YANG VALID
//     Buka: Firebase Console → Project Settings → Your Apps
// ============================================================
const firebaseConfig = {
  apiKey:            "AIzaSyCLgqGk9O8Nf7i_L4O2Q8nzFphrWtzJPGU",
  authDomain:        "volterraa-store.firebaseapp.com",
  projectId:         "volterraa-store",
  storageBucket:     "volterraa-store.firebasestorage.app",
  messagingSenderId: "39764778412",
  appId:             "1:39764778412:web:4736d636dbd0c3c3066e09"
};

const app      = initializeApp(firebaseConfig);
const auth     = getAuth(app);
const db       = getFirestore(app);
const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" });

// ===== AUTH =====

/**
 * Login Google — coba popup dulu, fallback ke redirect
 * kalau popup diblokir browser.
 */
async function loginWithGoogle() {
  try {
    // Popup lebih cepat dan tidak perlu reload halaman
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (err) {
    // Popup diblokir browser → pakai redirect sebagai fallback
    if (
      err.code === "auth/popup-blocked" ||
      err.code === "auth/popup-closed-by-user" ||
      err.code === "auth/cancelled-popup-request"
    ) {
      await signInWithRedirect(auth, provider);
    } else {
      throw err;
    }
  }
}

/**
 * Dipanggil saat halaman pertama kali load —
 * menangkap hasil redirect kalau user baru balik dari Google.
 */
async function handleRedirectResult() {
  try {
    const result = await getRedirectResult(auth);
    return result ? result.user : null;
  } catch (e) {
    console.error("Redirect login error:", e);
    return null;
  }
}

async function logoutUser() {
  await signOut(auth);
}

function onAuthChange(callback) {
  onAuthStateChanged(auth, callback);
}

// ===== FIRESTORE: PROFILE =====
async function saveUserProfile(user) {
  await setDoc(doc(db, "users", user.uid, "profile", "data"), {
    name:      user.displayName,
    email:     user.email,
    photo:     user.photoURL,
    updatedAt: new Date().toISOString()
  }, { merge: true });
}

// ===== FIRESTORE: HISTORY =====
async function saveOrderToFirestore(user, order) {
  const ref = collection(db, "users", user.uid, "history");
  await addDoc(ref, {
    ...order,
    createdAt: new Date().toISOString()
  });
}

async function getOrderHistory(user) {
  const ref  = collection(db, "users", user.uid, "history");
  const q    = query(ref, orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

async function clearOrderHistory(user) {
  const ref  = collection(db, "users", user.uid, "history");
  const snap = await getDocs(ref);
  const dels = snap.docs.map(d => deleteDoc(doc(db, "users", user.uid, "history", d.id)));
  await Promise.all(dels);
}

// ===== FIRESTORE: FAVORIT =====
async function saveFavoritToFirestore(user, favorites) {
  await setDoc(doc(db, "users", user.uid, "favorit", "data"), {
    ids:       favorites,
    updatedAt: new Date().toISOString()
  });
}

async function getFavoritFromFirestore(user) {
  const snap = await getDoc(doc(db, "users", user.uid, "favorit", "data"));
  return snap.exists() ? (snap.data().ids || []) : [];
}

export {
  auth, db,
  loginWithGoogle, logoutUser, onAuthChange, handleRedirectResult,
  saveUserProfile,
  saveOrderToFirestore, getOrderHistory, clearOrderHistory,
  saveFavoritToFirestore, getFavoritFromFirestore
};