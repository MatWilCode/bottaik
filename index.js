const { createClient } = require('bedrock-protocol');

let client;
let nightLoop;
let walkLoop;

function connectBot() {
  client = createClient({
    host: 'buburayam123.aternos.me',
    port: 40635,
    username: 'BotNight',
    offline: false
  });

  client.on('spawn', () => {
    console.log('Bot sudah masuk server!');

    checkTime();
    startWalking();
  });

  client.on('disconnect', (packet) => {
    console.log('Bot keluar server:', packet.reason);
    clearTimeout(nightLoop);
    clearTimeout(walkLoop);
    setTimeout(connectBot, 60000);
  });

  client.on('error', (err) => {
    console.error('Error client:', err);
  });
}

// Fungsi cek waktu malam/pagi
function checkTime() {
  const date = new Date();
  const hour = date.getHours();

  if (hour >= 18 || hour < 6) {
    console.log('Malam detected: Bot akan keluar-masuk tiap 1 menit');

    nightLoop = setInterval(() => {
      console.log('Bot keluar server...');
      client.close();

      setTimeout(() => {
        console.log('Bot masuk server lagi...');
        connectBot();
      }, 10000); // masuk lagi 10 detik setelah keluar
    }, 60000); // setiap 1 menit
  } else {
    console.log('Pagi detected: Bot tetap di server');
  }
}

// Fungsi jalan-jalan acak
function startWalking() {
  walkLoop = setInterval(() => {
    if (!client) return;

    const directions = ['forward', 'back', 'left', 'right'];
    const dir = directions[Math.floor(Math.random() * directions.length)];
    const duration = Math.floor(Math.random() * 3000) + 1000; // 1-4 detik

    console.log(`Bot bergerak ${dir} selama ${duration}ms`);

    client.queue('move', {
      x: dir === 'forward' ? 1 : dir === 'back' ? -1 : 0,
      z: dir === 'right' ? 1 : dir === 'left' ? -1 : 0
    });

    // stop gerakan setelah durasi
    setTimeout(() => {
      client.queue('move', { x: 0, z: 0 });
    }, duration);
  }, 5000); // tiap 5 detik pilih arah baru
}

connectBot();
