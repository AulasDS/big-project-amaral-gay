const express = require('express');
const router = express.Router();
const playlistController = require('../controllers/PlaylistController');

router.post('/', playlistController.create);
router.get('/', playlistController.getAll);
router.get('/:id', playlistController.getById);
router.put('/:id', playlistController.update);
router.delete('/:id', playlistController.delete);

module.exports = router;