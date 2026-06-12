// ===== api.js — Volterraa Store =====
// Konfigurasi webhook Discord (isi dengan URL webhook kamu)
const DISCORD_WEBHOOK = "https://discord.com/api/webhooks/1467770551568302131/WanFF52CqqPxXh__MWPTff979iCIV-kXPxbG_XaDVPbqf52ay6FkUmIWGkJMcyXeJJoV"; // Contoh: "https://discord.com/api/webhooks/xxx/yyy"

/**
 * Kirim pesanan ke Discord webhook
 * @param {Object} product  - Data produk
 * @param {string} name     - Nama pembeli
 * @param {string} gameId   - ID game pembeli
 * @param {string} note     - Catatan tambahan
 * @param {Function} onSuccess - Callback sukses
 * @param {Function} onError   - Callback gagal
 */
function sendOrderToDiscord(product, name, gameId, note, onSuccess, onError) {
  if (!DISCORD_WEBHOOK) {
    // Webhook belum diset, anggap sukses lokal
    onSuccess();
    return;
  }

  const payload = {
    embeds: [{
      title: "📦 Pesanan Baru — Volterraa Store",
      color: 0x1450c4,
      thumbnail: { url: "https://i.imgur.com/placeholder.png" },
      fields: [
        { name: "🎮 Produk",    value: product.name,          inline: true  },
        { name: "💰 Harga",     value: product.price,         inline: true  },
        { name: "👤 Pemesan",   value: name,                  inline: true  },
        { name: "🆔 ID Game",   value: gameId  || "—",        inline: true  },
        { name: "📝 Catatan",   value: note    || "—",        inline: false },
        { name: "🕐 Waktu",     value: new Date().toLocaleString("id-ID"), inline: false }
      ],
      footer: { text: "Volterraa Official Store" }
    }]
  };

  fetch(DISCORD_WEBHOOK, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  })
    .then(res => {
      if (res.ok) onSuccess();
      else onError();
    })
    .catch(() => onError());
}

/**
 * Simpan pesanan ke localStorage
 */
function saveToHistory(product, name, gameId, note) {
  const history = JSON.parse(localStorage.getItem("volterraa_history") || "[]");
  history.push({
    product: product.name,
    emoji:   product.emoji,
    kategori: product.kategori,
    name:    name,
    gameId:  gameId,
    note:    note,
    price:   product.price,
    harga:   product.harga,
    date:    new Date().toLocaleString("id-ID"),
    status:  "Terkirim"
  });
  localStorage.setItem("volterraa_history", JSON.stringify(history));
}

/**
 * Ambil riwayat pesanan
 */
function getHistory() {
  return JSON.parse(localStorage.getItem("volterraa_history") || "[]");
}

/**
 * Hapus semua riwayat
 */
function clearHistory() {
  localStorage.removeItem("volterraa_history");
}