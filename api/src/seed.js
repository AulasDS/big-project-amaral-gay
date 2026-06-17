const mongoose = require('mongoose');
const Musica = require('./models/Musica');

async function seed() {
  await mongoose.connect('mongodb://127.0.0.1:27017/seu-banco');

  const musicas = [
    {
      nome: "Freek'n You",
      artista: "Jodeci",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
    },
    {
      nome: "Blinding Lights",
      artista: "The Weeknd",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
    },
    {
      nome: "Rap God",
      artista: "Eminem",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
    }
  ];

  await Musica.deleteMany(); // limpa (opcional)
  await Musica.insertMany(musicas);

  console.log("🔥 Seed executado com sucesso!");
  process.exit();
}

seed();