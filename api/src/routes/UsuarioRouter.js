const express = require('express');
const router = express.Router();

const ClienteController = require('../controllers/ClienteController');

// Criar cliente
router.post('/', ClienteController.create);

// Buscar todos os clientes
router.get('/', ClienteController.getAll);

// Buscar cliente por ID
router.get('/:id', ClienteController.getById);

// Atualizar cliente
router.put('/:id', ClienteController.update);

// Deletar cliente
router.delete('/:id', ClienteController.delete);

module.exports = router;