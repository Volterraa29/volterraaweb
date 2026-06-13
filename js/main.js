// ===== main.js =====
import {
  loginWithGoogle, logoutUser, onAuthChange, handleRedirectResult,
  saveUserProfile,
  saveOrderToFirestore, getOrderHistory, clearOrderHistory,
  saveFavoritToFirestore, getFavoritFromFirestore
} from "./firebase-config.js";
import { sendOrderToDiscord } from "./api.js";

// ===== DATA PRODUK =====
const PRODUCTS = [
  { id:1,  name:"Mobile Legends",      kategori:"Top Up",   emoji:"⚔️",  color:"#e8f0ff", desc:"Top up Diamond Mobile Legends cepat, aman, dan harga terjangkau.",           price:"Mulai Rp 5.000",  harga:5000  },
  { id:2,  name:"Garena Free Fire",    kategori:"Top Up",   emoji:"🔥",  color:"#fff4e0", desc:"Top up Diamond Free Fire langsung masuk, proses cepat.",                   price:"Mulai Rp 4.000",  harga:4000  },
  { id:3,  name:"Genshin Impact",      kategori:"Top Up",   emoji:"💎",  color:"#f5f0ff", desc:"Top up Genesis Crystal & Welkin Moon Genshin Impact.",                     price:"Mulai Rp 10.000", harga:10000 },
  { id:4,  name:"PUBG Mobile",         kategori:"Top Up",   emoji:"🎯",  color:"#fffbe0", desc:"Top up UC PUBG Mobile murah, terpercaya, dan aman.",                       price:"Mulai Rp 8.000",  harga:8000  },
  { id:5,  name:"Valorant",            kategori:"Top Up",   emoji:"🌀",  color:"#ffe4e4", desc:"Top up VP Valorant dengan harga terbaik, langsung terima.",                price:"Mulai Rp 12.000", harga:12000 },
  { id:6,  name:"Honkai: Star Rail",   kategori:"Top Up",   emoji:"⭐",  color:"#e4f0ff", desc:"Top up Stellar Jade & Oneiric Shard Honkai: Star Rail.",                   price:"Mulai Rp 10.000", harga:10000 },
  { id:7,  name:"Zepeto",              kategori:"Top Up",   emoji:"👾",  color:"#f0ffe4", desc:"Top up Zepeto Coin dengan mudah dan aman.",                                price:"Mulai Rp 6.000",  harga:6000  },
  { id:8,  name:"League of Legends",   kategori:"Top Up",   emoji:"🏆",  color:"#fffbe4", desc:"Top up Riot Points League of Legends.",                                    price:"Mulai Rp 15.000", harga:15000 },
  { id:9,  name:"Joki ML Mythic",      kategori:"Joki",     emoji:"🚀",  color:"#ffe4f0", desc:"Push rank Mobile Legends hingga Mythic. Dijamin aman, akun tidak banned.", price:"Rp 50.000",       harga:50000 },
  { id:10, name:"Joki FF Grand Master",kategori:"Joki",     emoji:"🎖️", color:"#fff4e0", desc:"Boost rank Free Fire hingga Grand Master dalam 1-3 hari.",                price:"Rp 35.000",       harga:35000 },
  { id:11, name:"Joki PUBG Platinum",  kategori:"Joki",     emoji:"🎯",  color:"#e0f4ff", desc:"Push rank PUBG Mobile hingga Platinum dijamin cepat.",                    price:"Rp 40.000",       harga:40000 },
  { id:12, name:"Joki Valorant Gold",  kategori:"Joki",     emoji:"🌀",  color:"#ffe4e4", desc:"Boost rank Valorant ke Gold, proses 2-5 hari.",                           price:"Rp 55.000",       harga:55000 },
  { id:13, name:"Skin ML Epic",        kategori:"Item",     emoji:"🛡️", color:"#e4ffe4", desc:"Skin Epic Mobile Legends pilihan, langsung masuk akun dalam 10 menit.",   price:"Rp 25.000",       harga:25000 },
  { id:14, name:"Item FF Rare",        kategori:"Item",     emoji:"💼",  color:"#ffe4e4", desc:"Bundle dan item rare Free Fire berbagai pilihan.",                         price:"Rp 20.000",       harga:20000 },
  { id:15, name:"Skin PUBG Legendary", kategori:"Item",     emoji:"🎽",  color:"#fffbe4", desc:"Skin Legendary PUBG Mobile dengan harga spesial.",                        price:"Rp 30.000",       harga:30000 },
  { id:16, name:"Akun ML Rare",        kategori:"Akun",     emoji:"👑",  color:"#fff8e4", desc:"Akun ML dengan skin epic/legend lengkap, siap pakai.",                    price:"Rp 75.000",       harga:75000 },
  { id:17, name:"Akun FF Sultan",      kategori:"Akun",     emoji:"🌟",  color:"#f4e4ff", desc:"Akun Free Fire sultan dengan banyak skin langka.",                        price:"Rp 60.000",       harga:60000 },
  { id:18, name:"Akun Valorant Plat",  kategori:"Akun",     emoji:"🌀",  color:"#e4f0ff", desc:"Akun Valorant rank Platinum, skin select.",                               price:"Rp 90.000",       harga:90000 },
  { id:19, name:"Voucher Google Play", kategori:"Voucher",  emoji:"🎫",  color:"#e4f0ff", desc:"Voucher Google Play berbagai nominal, langsung dikirim.",                  price:"Mulai Rp 25.000", harga:25000 },
  { id:20, name:"Voucher Steam",       kategori:"Voucher",  emoji:"🎮",  color:"#e4ffe4", desc:"Voucher Steam Wallet untuk beli game PC.",                                 price:"Mulai Rp 30.000", harga:30000 },
  { id:21, name:"Win Boost ML",        kategori:"Boosting", emoji:"⚡",  color:"#ffe4e4", desc:"Boost win rate Mobile Legends Anda dengan cepat dan aman.",               price:"Rp 30.000",       harga:30000 },
  { id:22, name:"MMR Boost Dota 2",    kategori:"Boosting", emoji:"⚗️", color:"#e4ffe4", desc:"Tingkatkan MMR Dota 2 kamu dengan player profesional.",                   price:"Rp 45.000",       harga:45000 },
];

// ===== STATE =====
let currentUser   = null;
let favorites     = [];
let currentFilter = "semua";
let bannerIndex   = 0;

const el = (id) => document.getElementById(id);

// ===== AUTH LISTENER =====
onAuthChange(async (user) => {
  currentUser = user;
  if (user) {
    await saveUserProfile(user);
    favorites = await getFavoritFromFirestore(user);
  } else {
    favorites = [];
  }
  updateAkunUI(user);
  renderTopupGrid();
  renderPopularGrid();
  if (el("page-store")?.classList.contains("active"))   renderStoreGrid(currentFilter);
  if (el("page-history")?.classList.contains("active")) await renderHistory();
  if (el("page-favorit")?.classList.contains("active")) renderFavorit();
});

// Handle hasil redirect login (saat kembali dari Google)
handleRedirectResult();

// ===== UPDATE UI AKUN =====
function updateAkunUI(user) {
  const loginBtn  = el("loginBtn");
  const logoutBtn = el("logoutBtn");
  const akunName  = el("akunName");
  const akunSub   = el("akunSub");
  const akunPhoto = el("akunPhoto");
  const googleBtn = el("googleLoginBtn");

  if (user) {
    if (loginBtn)  loginBtn.textContent = user.displayName.split(" ")[0];
    if (akunName)  akunName.textContent = user.displayName;
    if (akunSub)   akunSub.textContent  = user.email;
    if (logoutBtn) logoutBtn.style.display = "";
    if (googleBtn) googleBtn.style.display = "none";
    if (akunPhoto) {
      akunPhoto.innerHTML = user.photoURL
        ? `<img src="${user.photoURL}" style="width:64px;height:64px;border-radius:50%;object-fit:cover">`
        : "👤";
    }
  } else {
    if (loginBtn)  loginBtn.textContent = "Masuk";
    if (akunName)  akunName.textContent = "Tamu";
    if (akunSub)   akunSub.textContent  = "Belum login";
    if (logoutBtn) logoutBtn.style.display = "none";
    if (googleBtn) googleBtn.style.display = "flex";
    if (akunPhoto) akunPhoto.innerHTML = "👤";
  }
}

// ===== RENDER FUNCTIONS =====
function renderTopupGrid() {
  const grid = el("topupGrid");
  if (!grid) return;
  grid.innerHTML = PRODUCTS.filter(p => p.kategori === "Top Up").slice(0,8).map(p => `
    <div class="game-item" onclick='openModal(${JSON.stringify(p)})'>
      <div class="game-thumb" style="background:${p.color}">
        <span style="font-size:28px">${p.emoji}</span>
      </div>
      <p>${p.name}</p>
    </div>
  `).join("");
}

function renderPopularGrid() {
  const grid = el("popularGrid");
  if (!grid) return;
  grid.innerHTML = PRODUCTS.filter(p => ["Joki","Boosting","Item"].includes(p.kategori)).slice(0,4).map(p => renderStoreCard(p)).join("");
}

function renderStoreCard(p) {
  const isFav = favorites.includes(p.id);
  return `
    <div class="store-card">
      <div class="s-thumb" style="background:${p.color}">
        <span style="font-size:38px">${p.emoji}</span>
        <button class="fav-btn" onclick="toggleFav(${p.id},this)">${isFav ? "❤️" : "🤍"}</button>
      </div>
      <div class="s-info">
        <h4>${p.name}</h4>
        <p>${p.desc.substring(0,45)}...</p>
        <div class="s-price">${p.price}</div>
        <button class="s-btn" onclick='openModal(${JSON.stringify(p)})'>Pesan Sekarang</button>
      </div>
    </div>
  `;
}

function renderStoreGrid(filter) {
  currentFilter = filter;
  const grid = el("storeGrid");
  if (!grid) return;
  const items = filter === "semua" ? PRODUCTS : PRODUCTS.filter(p => p.kategori === filter);
  grid.innerHTML = items.length
    ? items.map(p => renderStoreCard(p)).join("")
    : '<div class="empty" style="grid-column:1/-1"><div class="empty-icon">📦</div>Tidak ada produk</div>';
}

async function renderHistory() {
  const list = el("historyList");
  if (!list) return;
  if (!currentUser) {
    list.innerHTML = '<div class="empty"><div class="empty-icon">🔐</div>Login dengan Google untuk melihat riwayat pesanan</div>';
    return;
  }
  list.innerHTML = '<div class="empty"><div class="empty-icon">⏳</div>Memuat...</div>';
  try {
    const history = await getOrderHistory(currentUser);
    if (!history.length) {
      list.innerHTML = '<div class="empty"><div class="empty-icon">📋</div>Belum ada riwayat pesanan</div>';
      return;
    }
    list.innerHTML = history.map(h => `
      <div class="history-item">
        <div class="h-head">
          <div class="h-name">${h.emoji || "📦"} ${h.product}</div>
          <div class="h-price">${h.price}</div>
        </div>
        <div class="h-meta">👤 ${h.name} · 📅 ${new Date(h.createdAt).toLocaleString("id-ID")}</div>
        ${h.gameId ? `<div class="h-meta">🆔 ${h.gameId}</div>` : ""}
        ${h.note   ? `<div class="h-meta">📝 ${h.note}</div>`   : ""}
        <span class="history-status">✅ Terkirim</span>
      </div>
    `).join("");
  } catch(e) {
    list.innerHTML = '<div class="empty"><div class="empty-icon">❌</div>Gagal memuat riwayat</div>';
  }
}

function renderFavorit() {
  const list = el("favoritList");
  if (!list) return;
  if (!currentUser) {
    list.innerHTML = '<div class="empty"><div class="empty-icon">🔐</div>Login dengan Google untuk menyimpan favorit</div>';
    return;
  }
  const items = PRODUCTS.filter(p => favorites.includes(p.id));
  list.innerHTML = items.length
    ? '<div class="store-grid" style="padding:0">' + items.map(p => renderStoreCard(p)).join("") + '</div>'
    : '<div class="empty"><div class="empty-icon">❤️</div>Belum ada produk favorit</div>';
}

function renderSidebar() {
  const sidebar = el("sidebarContent");
  if (!sidebar) return;
  const cats = [
    { label:"Top Up Game", filter:"Top Up"   },
    { label:"Joki",        filter:"Joki",     baru:true },
    { label:"Item",        filter:"Item"      },
    { label:"Akun",        filter:"Akun"      },
    { label:"Voucher",     filter:"Voucher"   },
    { label:"Boosting",    filter:"Boosting"  },
    { label:"Semua Produk",filter:"semua"     },
  ];
  sidebar.innerHTML =
    cats.map(c => `
      <button class="sidebar-item" onclick="sidebarFilter('${c.filter}')">
        <span>${c.label}${c.baru ? ' <span class="sidebar-badge">Baru</span>' : ''}</span>
        <span class="sidebar-arrow">›</span>
      </button>
    `).join("") +
    `<button class="sidebar-item" onclick="showPage('history');closeSidebar()">
       <span>📜 Riwayat Pesanan</span><span class="sidebar-arrow">›</span>
     </button>
     <button class="sidebar-item" onclick="showPage('favorit');closeSidebar()">
       <span>❤️ Favorit Saya</span><span class="sidebar-arrow">›</span>
     </button>`;
}

// ===== GLOBAL FUNCTIONS (dipanggil dari HTML onclick) =====
window.showPage = async (page) => {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.querySelectorAll(".nav-item").forEach(b => b.classList.remove("active"));
  el("page-" + page)?.classList.add("active");
  document.querySelector(`[data-page="${page}"]`)?.classList.add("active");
  if (page === "store")   renderStoreGrid(currentFilter);
  if (page === "history") await renderHistory();
  if (page === "favorit") renderFavorit();
  window.scrollTo(0, 0);
};

window.setFilter = (btn, filter) => {
  document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  renderStoreGrid(filter);
};

window.filterKategori = (kat) => {
  window.showPage("store");
  document.querySelectorAll(".filter-btn").forEach(b => {
    b.classList.toggle("active", b.dataset.filter === kat || (kat === "semua" && b.dataset.filter === "semua"));
  });
  renderStoreGrid(kat);
};

window.sidebarFilter = (cat) => { window.filterKategori(cat); window.closeSidebar(); };

window.toggleFav = async (id, btn) => {
  if (!currentUser) { alert("Login dulu untuk menyimpan favorit!"); return; }
  const idx = favorites.indexOf(id);
  if (idx > -1) { favorites.splice(idx, 1); btn.textContent = "🤍"; }
  else          { favorites.push(id);        btn.textContent = "❤️"; }
  await saveFavoritToFirestore(currentUser, favorites);
};

window.goBanner = (n) => {
  bannerIndex = n;
  const track = el("bannerTrack");
  if (track) track.style.transform = `translateX(${-n * 100}%)`;
  document.querySelectorAll(".banner-dots span").forEach((d, i) => d.classList.toggle("active", i === n));
};

window.openSidebar  = () => { el("sidebar")?.classList.add("show"); el("sidebarOverlay")?.classList.add("show"); };
window.closeSidebar = () => { el("sidebar")?.classList.remove("show"); el("sidebarOverlay")?.classList.remove("show"); };

window.doClearHistory = async () => {
  if (!currentUser) return;
  if (!confirm("Hapus semua riwayat pesanan?")) return;
  await clearOrderHistory(currentUser);
  await renderHistory();
};

window.openModal = (product) => {
  document.querySelector(".order-modal")?.remove();
  const modal = document.createElement("div");
  modal.className = "modal-overlay order-modal";
  modal.innerHTML = `
    <div class="modal-content">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px">
        <div style="width:52px;height:52px;border-radius:14px;background:${product.color};display:flex;align-items:center;justify-content:center;font-size:28px;flex-shrink:0">${product.emoji}</div>
        <div>
          <h3 style="margin:0">${product.name}</h3>
          <div class="m-price">${product.price}</div>
        </div>
      </div>
      <p style="font-size:13px;color:#6b7280;margin-bottom:14px;line-height:1.5">${product.desc}</p>
      <input type="text" id="buyerName" placeholder="Nama Anda *" value="${currentUser ? currentUser.displayName : ''}">
      <input type="text" id="buyerId"   placeholder="ID Game / Username (jika perlu)">
      <input type="text" id="orderNote" placeholder="Catatan tambahan (opsional)">
      <div class="modal-btns">
        <button class="btn-pesan" id="confirmOrder">🛒 Pesan Sekarang</button>
        <button class="btn-tutup" id="closeModal">Batal</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  el("closeModal").onclick = () => modal.remove();
  modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
  el("confirmOrder").onclick = async () => {
    const name   = el("buyerName").value.trim();
    const gameId = el("buyerId").value.trim();
    const note   = el("orderNote").value.trim();
    if (!name) { alert("Masukkan nama Anda!"); return; }
    const btn = el("confirmOrder");
    btn.textContent = "⏳ Memproses...";
    btn.disabled = true;
    const order = { product:product.name, emoji:product.emoji, kategori:product.kategori, price:product.price, harga:product.harga, name, gameId, note };
    try {
      if (currentUser) await saveOrderToFirestore(currentUser, order);
      await sendOrderToDiscord(product, name, gameId, note);
      alert(`✅ Pesanan berhasil!\n\nProduk: ${product.name}\nPemesan: ${name}\n\nTim kami segera memproses pesanan Anda.`);
      modal.remove();
    } catch(e) {
      alert("✅ Pesanan dicatat! Hubungi kami via WhatsApp/Discord untuk konfirmasi.");
      modal.remove();
    }
  };
};

window.handleSearch = (q) => {
  q = q.trim().toLowerCase();
  if (!q) { renderStoreGrid(currentFilter); return; }
  window.showPage("store");
  const items = PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.kategori.toLowerCase().includes(q) ||
    p.desc.toLowerCase().includes(q)
  );
  const grid = el("storeGrid");
  if (!grid) return;
  grid.innerHTML = items.length
    ? items.map(p => renderStoreCard(p)).join("")
    : '<div class="empty" style="grid-column:1/-1"><div class="empty-icon">🔍</div>Produk tidak ditemukan</div>';
};

// ===== INIT =====
function init() {
  el("openSidebar")?.addEventListener("click", window.openSidebar);
  el("closeSidebar")?.addEventListener("click", window.closeSidebar);
  el("sidebarOverlay")?.addEventListener("click", window.closeSidebar);
  el("searchInput")?.addEventListener("input", e => window.handleSearch(e.target.value));

  el("loginBtn")?.addEventListener("click", async () => {
    if (!currentUser) {
      try { await loginWithGoogle(); }
      catch(e) { console.error(e); alert("Login gagal: " + e.message); }
    } else {
      window.showPage("account");
    }
  });

  el("googleLoginBtn")?.addEventListener("click", async () => {
    try { await loginWithGoogle(); }
    catch(e) { console.error(e); alert("Login gagal: " + e.message); }
  });

  el("logoutBtn")?.addEventListener("click", async () => {
      if (confirm("Yakin ingin keluar?")) {
        await logoutUser();
        currentUser = null;
        favorites = [];
        updateAkunUI(null);
        renderTopupGrid();
        renderPopularGrid();
        renderStoreGrid(currentFilter);
      }
    });

  setInterval(() => window.goBanner((bannerIndex + 1) % 3), 4000);

  renderTopupGrid();
  renderPopularGrid();
  renderStoreGrid("semua");
  renderSidebar();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}