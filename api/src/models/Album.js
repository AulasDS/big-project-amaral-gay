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
        default: 'https://via.placeholder.com/300',
        index: false 
    },
    ano: {
        type: Number,
        required: true
    },
    musicas: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Musica' 
    }]
}, {
    timestamps: true 
});

module.exports = mongoose.model('Album', AlbumSchema);