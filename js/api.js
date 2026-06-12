// ===== api.js =====
const DISCORD_WEBHOOK = ""; // Isi URL webhook Discord kamu di sini

async function sendOrderToDiscord(product, name, gameId, note) {
  if (!DISCORD_WEBHOOK) return;
  const payload = {
    embeds: [{
      title: "📦 Pesanan Baru — Volterraa Store",
      color: 0x1450c4,
      fields: [
        { name:"🎮 Produk",  value: product.name,  inline:true  },
        { name:"💰 Harga",   value: product.price, inline:true  },
        { name:"👤 Pemesan", value: name,           inline:true  },
        { name:"🆔 ID Game", value: gameId||"—",   inline:true  },
        { name:"📝 Catatan", value: note||"—",      inline:false },
        { name:"🕐 Waktu",   value: new Date().toLocaleString("id-ID"), inline:false }
      ],
      footer: { text: "Volterraa Official Store" }
    }]
  };
  try {
    await fetch(DISCORD_WEBHOOK, {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body: JSON.stringify(payload)
    });
  } catch(e) { console.error("Discord webhook error:", e); }
}

export { sendOrderToDiscord };