const express = require('express');
const router = express.Router();
const musicaController = require('../controllers/MusicaController');

router.post('/', musicaController.create);
router.get('/', musicaController.getAll);
router.get('/:id', musicaController.getById);
router.put('/:id', musicaController.update);
router.delete('/:id', musicaController.delete);

module.exports = router;