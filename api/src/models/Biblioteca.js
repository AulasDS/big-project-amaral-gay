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
        required: false // 🟢 Alterado para false para permitir salvar apenas álbuns
    },
    albumId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Album', 
        required: false // 🟢 Alterado para false para permitir salvar apenas músicas
    }
}, {
    timestamps: true
});

// 🟢 Seus índices únicos estão excelentes! Eles continuam funcionando perfeitamente.

BibliotecaSchema.index(
    { userId: 1, musicaId: 1 },
    { 
        unique: true, 
        partialFilterExpression: { musicaId: { $exists: true } } 
    }
);

// Só aplica a regra de "não duplicar" se o albumId existir de fato (ignora null)
BibliotecaSchema.index(
    { userId: 1, albumId: 1 },
    { 
        unique: true, 
        partialFilterExpression: { albumId: { $exists: true } } 
    }
);

module.exports = mongoose.model('Biblioteca', BibliotecaSchema);