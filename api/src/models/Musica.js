const mongoose = require('mongoose'); // importa biblioteca

const Musica = mongoose.model('Musica', {
    nome: String,
    artista: String,
    minutagem: Number,
    descricao: String,
    feat: Boolean
});

module.exports = Musica;