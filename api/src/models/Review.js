const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Usuario', 
        required: true 
    },
    albumId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Album', 
        required: true 
    },
    comentario: { 
        type: String, 
        required: true,
        trim: true
    },
    nota: { 
        type: Number, 
        min: 1, 
        max: 5,
        required: true 
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Review', ReviewSchema);