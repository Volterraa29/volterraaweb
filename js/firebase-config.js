// ===== firebase-config.js =====
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult, signOut, onAuthStateChanged }
  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, collection, addDoc, getDocs, deleteDoc, query, orderBy }
  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

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

// Cek hasil redirect saat halaman pertama kali dibuka
getRedirectResult(auth).then(result => {
  if (result?.user) console.log("Redirect login sukses:", result.user.displayName);
}).catch(e => console.warn("Redirect result:", e.code));

// ===== AUTH =====
async function loginWithGoogle() {
  try {
    // Coba popup dulu
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (e) {
    if (e.code === "auth/popup-blocked" || e.code === "auth/popup-closed-by-user") {
      // Fallback ke redirect kalau popup diblokir
      await signInWithRedirect(auth, provider);
    } else {
      throw e;
    }
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
  try {
    await setDoc(doc(db, "users", user.uid, "profile", "data"), {
      name:      user.displayName,
      email:     user.email,
      photo:     user.photoURL,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch(e) { console.warn("saveUserProfile:", e.message); }
}

// ===== FIRESTORE: HISTORY =====
async function saveOrderToFirestore(user, order) {
  const ref = collection(db, "users", user.uid, "history");
  await addDoc(ref, { ...order, createdAt: new Date().toISOString() });
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
  await Promise.all(snap.docs.map(d => deleteDoc(doc(db, "users", user.uid, "history", d.id))));
}

// ===== FIRESTORE: FAVORIT =====
async function saveFavoritToFirestore(user, favorites) {
  await setDoc(doc(db, "users", user.uid, "favorit", "data"), {
    ids: favorites,
    updatedAt: new Date().toISOString()
  });
}

async function getFavoritFromFirestore(user) {
  try {
    const snap = await getDoc(doc(db, "users", user.uid, "favorit", "data"));
    return snap.exists() ? (snap.data().ids || []) : [];
  } catch(e) { return []; }
}

export {
  auth, db,
  loginWithGoogle, logoutUser, onAuthChange,
  saveUserProfile,
  saveOrderToFirestore, getOrderHistory, clearOrderHistory,
  saveFavoritToFirestore, getFavoritFromFirestore
};