const mongoose = require('mongoose');

const BibliotecaSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Usuario', 
        required: true 
    },
    albumId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Album', 
        required: true 
    }
}, {
    timestamps: true
});

// Impede que o mesmo usuário curta o mesmo álbum mais de uma vez
BibliotecaSchema.index({ userId: 1, albumId: 1 }, { unique: true });

module.exports = mongoose.model('Biblioteca', BibliotecaSchema);