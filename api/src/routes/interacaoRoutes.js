
const express = require('express');
const router = express.Router();
const interacaoController = require('../controllers/InteracaoController');

//rotas da biblioteca 
router.post('/biblioteca', interacaoController.adicionarNaBiblioteca);
router.get('/biblioteca/:userId', interacaoController.getBibliotecaUsuario);
router.delete('/biblioteca/:userId/:id', interacaoController.removerDaBiblioteca);

//rotas da review 
router.post('/review', interacaoController.criarReview);
router.get('/review/:albumId', interacaoController.getReviewsPorAlbum);
router.delete('/review/:reviewId/:userId', interacaoController.deletarReview);

module.exports = router;