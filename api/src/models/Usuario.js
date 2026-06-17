const mongoose = require('mongoose');

const UsuarioSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true, // 🔒 Essencial: não deixa dois perfis usarem o mesmo e-mail
        trim: true,
        lowercase: true
    },
    tipo: { // 💡 Mudamos de 'plano' para 'tipo' para encaixar no seu React!
        type: String,
        enum: ['Ouvinte', 'Artista'], // 👈 Bate certinho com as opções do seu <select>
        default: 'Ouvinte'
    },
    nascimento: { // Mantivemos o campo caso você queira usar no futuro
        type: Date
    },
    criadoEm: {
        type: Date,
        default: Date.now
    }
});

const Usuario = mongoose.model('Usuario', UsuarioSchema);
module.exports = Usuario;