const mongoose = require('mongoose');

const Usuario = mongoose.model('Usuario', {
    nome: String,
    email: String,
    nascimento: Date,
})

module.exports = Usuario;