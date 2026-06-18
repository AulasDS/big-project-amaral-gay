const mongoose = require('mongoose');

const BibliotecaSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Usuario', 
        required: true 
    },
    musicaId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Musica', 
        required: true 
    }
}, {
    timestamps: true
});

// 🟢 Impede que o mesmo usuário curta a mesma música mais de uma vez
BibliotecaSchema.index({ userId: 1, musicaId: 1 }, { unique: true });

module.exports = mongoose.model('Biblioteca', BibliotecaSchema);