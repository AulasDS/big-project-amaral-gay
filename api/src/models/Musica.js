const mongoose = require('mongoose');

const MusicaSchema = new mongoose.Schema({
    nome: String,       
    artista: String,
    genero: String,
    albumId: {        
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Album'
    },
    ano: Number,
    capaUrl: String,
    audioUrl: String    
});

const Musica = mongoose.model('Musica', MusicaSchema);

module.exports = Musica;