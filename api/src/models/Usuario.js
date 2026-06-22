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
        unique: true, 
        trim: true,
        lowercase: true
    },
    tipo: { 
        type: String,
        enum: ['ouvinte', 'artista'], 
        default: 'ouvinte'          
    },
    nascimento: { 
        type: Date
    },
    criadoEm: {
        type: Date,
        default: Date.now
    }
});

const Usuario = mongoose.model('Usuario', UsuarioSchema);
module.exports = Usuario;