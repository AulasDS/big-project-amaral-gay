const mongoose = require('mongoose');

const PlaylistSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true, // Nome é obrigatório
        trim: true
    },
    descricao: {
        type: String,
        trim: true
    },
    // Cria um vínculo (Array) com o seu modelo de Música usando o ID delas
    musicas: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Musica' // Deve ser o exato mesmo nome do model de música
    }],
    criadaEm: {
        type: Date,
        default: Date.now
    }
});

// Exporta o modelo com o nome correto
const Playlist = mongoose.model('Playlist', PlaylistSchema);
module.exports = Playlist;