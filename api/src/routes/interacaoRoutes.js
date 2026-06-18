const express = require('express');
const router = express.Router();
const interacaoController = require('../controllers/InteracaoController');

router.post('/biblioteca', interacaoController.curtirMusica);
router.get('/biblioteca/:userId', interacaoController.getBibliotecaUsuario);
router.post('/review', interacaoController.criarReview);
router.get('/review/:albumId', interacaoController.getReviewsPorAlbum);

module.exports = router;