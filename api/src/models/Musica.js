const mongoose = require('mongoose');

// 1. Primeiro definimos a estrutura e criamos o Modelo
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
    audioUrl: String,
    // 🔴 ADICIONADO: Agora o Mongoose vai permitir salvar a letra gerada pela IA!
    letraSincronizada: [
        {
            tempo: Number,
            texto: String
        }
    ]
});

const Musica = mongoose.model('Musica', MusicaSchema);

// 2. Só depois exportamos
module.exports = Musica;