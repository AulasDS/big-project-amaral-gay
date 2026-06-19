const mongoose = require('mongoose');

const AlbumSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true,
        trim: true
        // 🟢 Removido qualquer risco de índice único oculto no nome
    },
    artista: {
        type: String,
        required: true,
        trim: true
    },
    capaUrl: {
        type: String,
        default: 'https://via.placeholder.com/300',
        index: false // 🟢 Garante que o MongoDB não tente criar um índice único para a capa padrão
    },
    ano: {
        type: Number,
        required: true
    },
    musicas: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Musica' // Referência ao modelo de Música
    }]
}, {
    timestamps: true // Cria automaticamente os campos createdAt e updatedAt
});

module.exports = mongoose.model('Album', AlbumSchema);