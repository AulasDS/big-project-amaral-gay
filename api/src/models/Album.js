const mongoose = require('mongoose');

const AlbumSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true,
        trim: true
    },
    artista: {
        type: String,
        required: true,
        trim: true
    },
    capaUrl: {
        type: String,
        default: 'https://via.placeholder.com/300' // Imagem padrão caso não enviem capa
    },
    ano: {
        type: Number,
        required: true
    }
}, {
    timestamps: true // Cria automaticamente os campos createdAt e updatedAt
});

module.exports = mongoose.model('Album', AlbumSchema);