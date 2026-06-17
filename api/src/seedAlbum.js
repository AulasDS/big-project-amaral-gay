const mongoose = require('mongoose');
const Album = require('./models/Album');

async function seedAlbum() {
  await mongoose.connect('mongodb://127.0.0.1:27017/seu-banco');

  const albumExistente = await Album.findOne({ nome: "Músicas Recomendadas" });

  if (!albumExistente) {
    await Album.create({
      nome: "Músicas Recomendadas"
    });

    console.log("💿 Álbum padrão criado!");
  } else {
    console.log("💿 Álbum já existe");
  }

  process.exit();
}

seedAlbum();