// src/routes/interacaoRoutes.js
const express = require('express');
const router = express.Router();
const interacaoController = require('../controllers/InteracaoController'); // 👈 ATENÇÃO AQUI

// ... rotas

router.post('/biblioteca', interacaoController.curtirAlbum);
router.get('/biblioteca/:userId', interacaoController.getBibliotecaUsuario);
router.post('/review', interacaoController.criarReview);
router.get('/review/:albumId', interacaoController.getReviewsPorAlbum);

module.exports = router;