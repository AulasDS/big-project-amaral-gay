const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/UsuarioController');

router.post('/', usuarioController.create);
router.get('/', usuarioController.getAll);
router.get('/:id', usuarioController.getById);
router.put('/:id', usuarioController.update);
router.delete('/:id', usuarioController.delete);

module.exports = router;