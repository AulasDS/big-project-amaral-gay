const express = require('express');
const router = express.Router();
const albumController = require('../controllers/AlbumController');

router.post('/', albumController.create);
router.get('/', albumController.getAll);
router.get('/:id', albumController.getById);
router.put('/:id', albumController.update);
router.delete('/:id', albumController.delete);

module.exports = router;