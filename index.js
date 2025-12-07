const { createClient } = require('bedrock-protocol');

let client = null;
let isOnline = false; // status bot di server

function joinServer() {
  console.log("Bot akan masuk server sekarang...");

  client = createClient({
    host: 'buburayam123.aternos.me',
    port: 40635,
    username: 'BotTAIK',
    offline: false
  });

  // Event saat mencoba connect
  client.on('connect', () => {
    console.log("Bot mencoba connect...");
  });

  // Kalau berhasil spawn
  client.on('spawn', () => {
    console.log("Bot sudah masuk server!");
    isOnline = true;

    // Setelah 1 menit, bot keluar
    setTimeout(() => {
      leaveServer();
    }, 60 * 1000);
  });

  // Event disconnect
  client.on('disconnect', (reason) => {
    console.log("Bot disconnect:", reason);
    isOnline = false;
  });

  // Event error
  client.on('error', (err) => {
    console.log("Bot error:", err);
  });
}

function leaveServer() {
  if (!client || !isOnline) return;

  console.log("Bot akan keluar server sekarang...");
  isOnline = false;

  try {
    client.disconnect();
  } catch (e) {}

  // Setelah 1 menit keluar → masuk lagi
  setTimeout(() => {
    joinServer();
  }, 60 * 1000);
}

// Start pertama
joinServer();
