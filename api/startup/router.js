const express = require('express');
const musicaRouter = require('../src/routes/MusicaRouter');

module.exports = (app) => {
    app.use(express.json());
    
    // Rotas principais do Spotify
    app.use('/musica', musicaRouter);
    app.use('/usuario', require('../src/routes/UsuarioRouter'));
    app.use('/playlist', require('../src/routes/PlaylistRouter'));
    
    // Nova rota para os Álbuns 🎵
    app.use('/album', require('../src/routes/AlbumRouter'));
};