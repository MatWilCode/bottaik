const { createClient } = require('bedrock-protocol');

let client;
let nightLoop;

function connectBot() {
  client = createClient({
    host: 'buburayam123.aternos.me', // ganti dengan servermu
    port: 40635,                     // ganti port servermu
    username: 'BotNight',            // nama bot
    offline: false                     // pakai true kalau mau nama custom
  });

  client.on('spawn', () => {
    console.log('Bot sudah masuk server!');

    checkTime();
  });

  client.on('disconnect', (packet) => {
    console.log('Bot keluar server:', packet.reason);
    clearTimeout(nightLoop); // hentikan loop kalau disconnect
    setTimeout(connectBot, 60000); // reconnect 1 menit
  });

  client.on('error', (err) => {
    console.error('Error client:', err);
  });
}

// Fungsi cek waktu malam/pagi (misal malam 18:00-06:00)
function checkTime() {
  const date = new Date();
  const hour = date.getHours();

  if (hour >= 18 || hour < 6) {
    console.log('Malam detected: Bot akan keluar-masuk tiap 1 menit');

    // Loop keluar-masuk
    nightLoop = setInterval(() => {
      console.log('Bot keluar server...');
      client.close(); // keluar server

      setTimeout(() => {
        console.log('Bot masuk server lagi...');
        connectBot(); // masuk lagi
      }, 10000); // masuk lagi 10 detik setelah keluar
    }, 60000); // setiap 1 menit
  } else {
    console.log('Pagi detected: Bot tetap di server');
  }
}

connectBot();
