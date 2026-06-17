const mongoose = require('mongoose');

const Musica = mongoose.model('Musica', {
    nome: String,       // O React vai mandar o 'titulo' para cá
    artista: String,
    duracao: String,    // Mudamos de minutagem (Number) para duracao (String) para aceitar "3:50"
    albumId: {        // Guarda o ID do álbum vinculado
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Album'
    },
    audioUrl: String    // Guarda o link do arquivo .mp3 para tocar
});

module.exports = Musica;