// ===== main.js — Volterraa Store =====

// ===== DATA PRODUK =====
const PRODUCTS = [
  // TOP UP
  { id:1,  name:"Mobile Legends",   short:"ML",   kategori:"Top Up",   emoji:"⚔️",  color:"#e8f0ff", desc:"Top up Diamond Mobile Legends cepat, aman, dan harga terjangkau.",          price:"Mulai Rp 5.000",  harga:5000  },
  { id:2,  name:"Garena Free Fire", short:"FF",   kategori:"Top Up",   emoji:"🔥",  color:"#fff4e0", desc:"Top up Diamond Free Fire langsung masuk, proses cepat.",                  price:"Mulai Rp 4.000",  harga:4000  },
  { id:3,  name:"Genshin Impact",   short:"GI",   kategori:"Top Up",   emoji:"💎",  color:"#f5f0ff", desc:"Top up Genesis Crystal & Welkin Moon Genshin Impact.",                    price:"Mulai Rp 10.000", harga:10000 },
  { id:4,  name:"PUBG Mobile",      short:"PUBG", kategori:"Top Up",   emoji:"🎯",  color:"#fffbe0", desc:"Top up UC PUBG Mobile murah, terpercaya, dan aman.",                      price:"Mulai Rp 8.000",  harga:8000  },
  { id:5,  name:"Valorant",         short:"VAL",  kategori:"Top Up",   emoji:"🌀",  color:"#ffe4e4", desc:"Top up VP Valorant dengan harga terbaik, langsung terima.",               price:"Mulai Rp 12.000", harga:12000 },
  { id:6,  name:"Honkai: Star Rail", short:"HSR", kategori:"Top Up",   emoji:"⭐",  color:"#e4f0ff", desc:"Top up Stellar Jade & Oneiric Shard Honkai: Star Rail.",                  price:"Mulai Rp 10.000", harga:10000 },
  { id:7,  name:"Zepeto",           short:"ZPT",  kategori:"Top Up",   emoji:"👾",  color:"#f0ffe4", desc:"Top up Zepeto Coin dengan mudah dan aman.",                               price:"Mulai Rp 6.000",  harga:6000  },
  { id:8,  name:"League of Legends",short:"LoL",  kategori:"Top Up",   emoji:"🏆",  color:"#fffbe4", desc:"Top up Riot Points League of Legends dengan harga resmi.",                price:"Mulai Rp 15.000", harga:15000 },
  // JOKI
  { id:9,  name:"Joki ML Mythic",   short:"JML",  kategori:"Joki",     emoji:"🚀",  color:"#ffe4f0", desc:"Push rank Mobile Legends hingga Mythic. Dijamin aman, akun tidak banned.",price:"Rp 50.000",       harga:50000 },
  { id:10, name:"Joki FF Grand Master", short:"JFF", kategori:"Joki",  emoji:"🎖️", color:"#fff4e0", desc:"Boost rank Free Fire hingga Grand Master dalam 1–3 hari.",               price:"Rp 35.000",       harga:35000 },
  { id:11, name:"Joki PUBG Platinum",short:"JPG", kategori:"Joki",     emoji:"🎯",  color:"#e0f4ff", desc:"Push rank PUBG Mobile hingga Platinum dijamin cepat.",                   price:"Rp 40.000",       harga:40000 },
  { id:12, name:"Joki Valorant Gold",short:"JVG", kategori:"Joki",     emoji:"🌀",  color:"#ffe4e4", desc:"Boost rank Valorant ke Gold, proses 2–5 hari.",                          price:"Rp 55.000",       harga:55000 },
  // ITEM
  { id:13, name:"Skin ML Epic",     short:"SKN",  kategori:"Item",     emoji:"🛡️", color:"#e4ffe4", desc:"Skin Epic Mobile Legends pilihan, langsung masuk akun dalam 10 menit.",  price:"Rp 25.000",       harga:25000 },
  { id:14, name:"Item FF Rare",     short:"IFF",  kategori:"Item",     emoji:"💼",  color:"#ffe4e4", desc:"Bundle dan item rare Free Fire berbagai pilihan.",                        price:"Rp 20.000",       harga:20000 },
  { id:15, name:"Skin PUBG Legendary",short:"SPG",kategori:"Item",     emoji:"🎽",  color:"#fffbe4", desc:"Skin Legendary PUBG Mobile dengan harga spesial.",                       price:"Rp 30.000",       harga:30000 },
  // AKUN
  { id:16, name:"Akun ML Rare",     short:"AML",  kategori:"Akun",     emoji:"👑",  color:"#fff8e4", desc:"Akun ML dengan skin epic/legend lengkap, siap pakai, sudah terverifikasi.",price:"Rp 75.000",     harga:75000 },
  { id:17, name:"Akun FF Sultan",   short:"AFF",  kategori:"Akun",     emoji:"🌟",  color:"#f4e4ff", desc:"Akun Free Fire sultan dengan banyak skin langka dan bundel.",             price:"Rp 60.000",       harga:60000 },
  { id:18, name:"Akun Valorant Plat",short:"AVP", kategori:"Akun",     emoji:"🌀",  color:"#e4f0ff", desc:"Akun Valorant rank Platinum, skin select dan prime.",                    price:"Rp 90.000",       harga:90000 },
  // VOUCHER
  { id:19, name:"Voucher Google Play",short:"GPY",kategori:"Voucher",  emoji:"🎫",  color:"#e4f0ff", desc:"Voucher Google Play berbagai nominal, langsung dikirim via chat.",        price:"Mulai Rp 25.000", harga:25000 },
  { id:20, name:"Voucher Steam",    short:"STM",  kategori:"Voucher",  emoji:"🎮",  color:"#e4ffe4", desc:"Voucher Steam Wallet berbagai nominal untuk beli game PC.",               price:"Mulai Rp 30.000", harga:30000 },
  // BOOSTING
  { id:21, name:"Win Boost ML",     short:"WBM",  kategori:"Boosting", emoji:"⚡",  color:"#ffe4e4", desc:"Boost win rate Mobile Legends Anda dengan cepat, aman, dan terpercaya.",  price:"Rp 30.000",       harga:30000 },
  { id:22, name:"MMR Boost Dota 2", short:"MBD",  kategori:"Boosting", emoji:"⚗️", color:"#e4ffe4", desc:"Tingkatkan MMR Dota 2 kamu dengan player profesional.",                  price:"Rp 45.000",       harga:45000 },
];

// ===== STATE =====
let currentFilter = "semua";
let favorites = JSON.parse(localStorage.getItem("volt_favs") || "[]");
let user = JSON.parse(localStorage.getItem("volt_user") || "null");
let bannerIndex = 0;

// ===== RENDER: TOPUP GRID (icon 4-col) =====
function renderTopupGrid() {
  const grid = document.getElementById("topupGrid");
  const items = PRODUCTS.filter(p => p.kategori === "Top Up").slice(0,8);
  grid.innerHTML = items.map(p => `
    <div class="game-item" onclick='openModal(${JSON.stringify(p)})'>
      <div class="game-thumb" style="background:${p.color}">
        <span style="font-size:28px">${p.emoji}</span>
      </div>
      <p>${p.name}</p>
    </div>
  `).join("");
}

// ===== RENDER: POPULER GRID =====
function renderPopularGrid() {
  const grid = document.getElementById("popularGrid");
  const items = PRODUCTS.filter(p => ["Joki","Boosting","Item"].includes(p.kategori)).slice(0,4);
  grid.innerHTML = items.map(p => renderStoreCard(p)).join("");
}

// ===== RENDER: STORE GRID =====
function renderStoreGrid(filter) {
  currentFilter = filter;
  const grid = document.getElementById("storeGrid");
  const items = filter === "semua" ? PRODUCTS : PRODUCTS.filter(p => p.kategori === filter);
  if (!items.length) {
    grid.innerHTML = '<div class="empty" style="grid-column:1/-1"><div class="empty-icon">📦</div>Tidak ada produk ditemukan</div>';
    return;
  }
  grid.innerHTML = items.map(p => renderStoreCard(p)).join("");
}

// ===== RENDER: KARTU PRODUK =====
function renderStoreCard(p) {
  const isFav = favorites.includes(p.id);
  return `
    <div class="store-card">
      <div class="s-thumb" style="background:${p.color}">
        <span style="font-size:38px">${p.emoji}</span>
        <button class="fav-btn" onclick="toggleFav(${p.id},this)" title="Favorit">
          ${isFav ? "❤️" : "🤍"}
        </button>
      </div>
      <div class="s-info">
        <h4>${p.name}</h4>
        <p>${p.desc.substring(0,45)}…</p>
        <div class="s-price">${p.price}</div>
        <button class="s-btn" onclick='openModal(${JSON.stringify(p)})'>Pesan Sekarang</button>
      </div>
    </div>
  `;
}

// ===== RENDER: SIDEBAR =====
function renderSidebar() {
  const cats = [
    { label:"Top Up Game",       filter:"Top Up"   },
    { label:"Joki",              filter:"Joki",     baru:true },
    { label:"Item",              filter:"Item"      },
    { label:"Akun",              filter:"Akun"      },
    { label:"Voucher",           filter:"Voucher"   },
    { label:"Boosting",          filter:"Boosting"  },
    { label:"Semua Produk",      filter:"semua"     },
  ];
  document.getElementById("sidebarContent").innerHTML = cats.map(c => `
    <button class="sidebar-item" onclick="sidebarFilter('${c.filter}')">
      <span>${c.label}${c.baru ? ' <span class="sidebar-badge">Baru</span>' : ''}</span>
      <span class="sidebar-arrow">›</span>
    </button>
  `).join("") + `
    <button class="sidebar-item" onclick="showPage('history'); closeSidebar()">
      <span>📜 Riwayat Pesanan</span>
      <span class="sidebar-arrow">›</span>
    </button>
    <button class="sidebar-item" onclick="showPage('favorit'); closeSidebar()">
      <span>❤️ Favorit Saya</span>
      <span class="sidebar-arrow">›</span>
    </button>
  `;
}

// ===== RENDER: HISTORY =====
function renderHistory() {
  const list = document.getElementById("historyList");
  const history = getHistory().slice().reverse();
  if (!history.length) {
    list.innerHTML = '<div class="empty"><div class="empty-icon">📋</div>Belum ada riwayat pesanan</div>';
    return;
  }
  list.innerHTML = history.map(h => `
    <div class="history-item">
      <div class="h-head">
        <div class="h-name">${h.emoji || "📦"} ${h.product}</div>
        <div class="h-price">${h.price || ("Rp " + Number(h.harga||0).toLocaleString("id"))}</div>
      </div>
      <div class="h-meta">👤 ${h.name} · 📅 ${h.date}</div>
      ${h.gameId ? `<div class="h-meta">🆔 ${h.gameId}</div>` : ""}
      ${h.note   ? `<div class="h-meta">📝 ${h.note}</div>`   : ""}
      <span class="history-status">✅ Terkirim</span>
    </div>
  `).join("");
}

// ===== RENDER: FAVORIT =====
function renderFavorit() {
  const list = document.getElementById("favoritList");
  const items = PRODUCTS.filter(p => favorites.includes(p.id));
  if (!items.length) {
    list.innerHTML = '<div class="empty"><div class="empty-icon">❤️</div>Belum ada produk favorit<br><small>Tap 🤍 pada produk untuk menambahkan</small></div>';
    return;
  }
  list.innerHTML = '<div class="store-grid" style="padding:0">' + items.map(p => renderStoreCard(p)).join("") + '</div>';
}

// ===== NAVIGASI =====
function showPage(page) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.querySelectorAll(".nav-item").forEach(b => b.classList.remove("active"));
  document.getElementById("page-" + page)?.classList.add("active");
  document.querySelector(`[data-page="${page}"]`)?.classList.add("active");
  if (page === "store")   renderStoreGrid(currentFilter);
  if (page === "history") renderHistory();
  if (page === "favorit") renderFavorit();
  if (page === "account") updateAkunPage();
  window.scrollTo(0, 0);
}

function setFilter(btn, filter) {
  document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  renderStoreGrid(filter);
}

function filterKategori(kat) {
  showPage("store");
  const f = kat === "semua" ? "semua" : kat;
  document.querySelectorAll(".filter-btn").forEach(b => {
    b.classList.toggle("active", b.dataset.filter === f);
  });
  renderStoreGrid(f);
}

function sidebarFilter(cat) {
  filterKategori(cat);
  closeSidebar();
}

// ===== FAVORIT =====
function toggleFav(id, btn) {
  const idx = favorites.indexOf(id);
  if (idx > -1) { favorites.splice(idx, 1); btn.textContent = "🤍"; }
  else           { favorites.push(id);        btn.textContent = "❤️"; }
  localStorage.setItem("volt_favs", JSON.stringify(favorites));
}

// ===== BANNER SLIDER =====
function goBanner(n) {
  bannerIndex = n;
  document.getElementById("bannerTrack").style.transform = `translateX(${-n * 100}%)`;
  document.querySelectorAll(".banner-dots span").forEach((d, i) => d.classList.toggle("active", i === n));
}
setInterval(() => goBanner((bannerIndex + 1) % 3), 4000);

// ===== SIDEBAR =====
function openSidebar() {
  document.getElementById("sidebar").classList.add("show");
  document.getElementById("sidebarOverlay").classList.add("show");
}
function closeSidebar() {
  document.getElementById("sidebar").classList.remove("show");
  document.getElementById("sidebarOverlay").classList.remove("show");
}

// ===== LOGIN =====
function updateAkunPage() {
  if (user) {
    document.getElementById("akunName").textContent = user.name;
    document.getElementById("akunSub").textContent  = user.wa || "Member Volterraa";
    document.getElementById("loginBtn").textContent  = user.name.split(" ")[0];
    document.getElementById("logoutBtn").style.display = "";
  } else {
    document.getElementById("akunName").textContent = "Tamu";
    document.getElementById("akunSub").textContent  = "Belum login";
    document.getElementById("loginBtn").textContent  = "Masuk";
    document.getElementById("logoutBtn").style.display = "none";
  }
}

function doLogin() {
  const name = document.getElementById("loginName").value.trim();
  if (!name) { alert("⚠️ Masukkan nama Anda!"); return; }
  user = { name, wa: document.getElementById("loginWa").value.trim() };
  localStorage.setItem("volt_user", JSON.stringify(user));
  document.getElementById("loginModal").style.display = "none";
  updateAkunPage();
  alert("Selamat datang, " + name + "! 🎉");
}

// ===== SEARCH =====
function handleSearch(q) {
  q = q.trim().toLowerCase();
  if (!q) { renderStoreGrid(currentFilter); return; }
  showPage("store");
  const grid = document.getElementById("storeGrid");
  const items = PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.kategori.toLowerCase().includes(q) ||
    p.desc.toLowerCase().includes(q)
  );
  if (!items.length) {
    grid.innerHTML = '<div class="empty" style="grid-column:1/-1"><div class="empty-icon">🔍</div>Produk tidak ditemukan</div>';
  } else {
    grid.innerHTML = items.map(p => renderStoreCard(p)).join("");
  }
}

// ===== ORDER MODAL =====
function openModal(product) {
  const existing = document.querySelector(".order-modal");
  if (existing) existing.remove();

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
      <input type="text"  id="buyerName" placeholder="Nama Anda *"                     value="${user ? user.name : ''}">
      <input type="text"  id="buyerId"   placeholder="ID Game / Username (jika perlu)">
      <input type="text"  id="orderNote" placeholder="Catatan tambahan (opsional)">
      <div class="modal-btns">
        <button class="btn-pesan" id="confirmOrder">🛒 Pesan Sekarang</button>
        <button class="btn-tutup" id="closeModal">Batal</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  document.getElementById("closeModal").onclick = () => modal.remove();
  modal.addEventListener("click", e => { if (e.target === modal) modal.remove(); });

  document.getElementById("confirmOrder").onclick = () => {
    const name   = document.getElementById("buyerName").value.trim();
    const gameId = document.getElementById("buyerId").value.trim();
    const note   = document.getElementById("orderNote").value.trim();
    if (!name) { alert("⚠️ Masukkan nama Anda!"); return; }

    const btn = document.getElementById("confirmOrder");
    btn.textContent = "⏳ Memproses...";
    btn.disabled = true;

    // Simpan ke history lokal dulu
    saveToHistory(product, name, gameId, note);

    // Kirim ke Discord
    sendOrderToDiscord(product, name, gameId, note,
      () => {
        alert(`✅ Pesanan berhasil dikirim!\n\nProduk: ${product.name}\nPemesan: ${name}\n\nTim kami akan segera memproses pesanan Anda.`);
        modal.remove();
      },
      () => {
        alert(`✅ Pesanan dicatat!\n\nProduk: ${product.name}\nPemesan: ${name}\n\nHubungi kami via WhatsApp/Discord untuk konfirmasi lebih lanjut.`);
        modal.remove();
      }
    );
  };
}

// ===== EVENT LISTENERS =====
document.addEventListener("DOMContentLoaded", () => {
  // Sidebar
  document.getElementById("openSidebar").addEventListener("click", openSidebar);
  document.getElementById("closeSidebar").addEventListener("click", closeSidebar);
  document.getElementById("sidebarOverlay").addEventListener("click", closeSidebar);

  // Login
  document.getElementById("loginBtn").addEventListener("click", () => {
    if (!user) document.getElementById("loginModal").style.display = "flex";
    else showPage("account");
  });
  document.getElementById("logoutBtn").addEventListener("click", () => {
    if (confirm("Yakin ingin keluar?")) {
      user = null;
      localStorage.removeItem("volt_user");
      updateAkunPage();
    }
  });
  document.getElementById("loginModal").addEventListener("click", e => {
    if (e.target === document.getElementById("loginModal"))
      document.getElementById("loginModal").style.display = "none";
  });

  // Search
  document.getElementById("searchInput").addEventListener("input", e => handleSearch(e.target.value));

  // Init render
  renderTopupGrid();
  renderPopularGrid();
  renderStoreGrid("semua");
  renderSidebar();
  updateAkunPage();
});