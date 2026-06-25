const express = require('express');
const musicasRouter = require('../src/routes/MusicaRouter');

module.exports = (app) => {
    app.use(express.json());
    app.use('/musica', musicasRouter);
    app.use('/usuario', require('../src/routes/UsuarioRouter'));
    app.use('/album', require('../src/routes/AlbumRouter'));
    app.use('/', require('../src/routes/interacaoRoutes')); 
};