const express = require('express');
const musicaRouter = require('../src/routes/MusicaRouter');

module.exports = (app) => {
    app.use(express.json());
    app.use('/musica', musicaRouter);
    app.use('/usuario', require('../src/routes/UsuarioRouter'));
    app.use('/playlist', require('../src/routes/PlaylistRouter'));
    app.use('/album', require('.x./src/routes/AlbumRouter'));
};
