const express = require('express');
const musicasRouter = require('../src/routes/MusicaRouter');

module.exports = (app) => {
    app.use(express.json());
    
    // Rotas principais do Spotify
    app.use('/musica', musicasRouter);
    app.use('/usuario', require('../src/routes/UsuarioRouter'));
    app.use('/playlist', require('../src/routes/PlaylistRouter'));
    
    // Nova rota para os Álbuns 🎵
    app.use('/album', require('../src/routes/AlbumRouter'));

    // 👇 ADICIONE ESSA LINHA PARA ATIVAR AS REGRAS 4, 5 e 6 👇
    app.use('/', require('../src/routes/interacaoRoutes')); 
};