const Musica = require('../models/Musica');
const Album = require('../models/Album');

module.exports = {

    create: async (req, res) => {
        try {
            const {
                nome,
                artista,
                minutagem,
                descricao,
                feat,
                album,
                albumId,
                audioUrl
            } = req.body;

            const albumFinal = album || albumId;

            const novaMusica = new Musica({
                nome,
                artista,
                minutagem,
                descricao,
                feat,
                audioUrl,
                album: albumFinal
            });

            await novaMusica.save();

            if (albumFinal) {
                await Album.findByIdAndUpdate(albumFinal, {
                    $push: { musicas: novaMusica._id }
                });
            }

            return res.status(201).json(novaMusica);

        } catch (error) {
            return res.status(500).json({
                error: 'Erro ao criar a música',
                details: error.message
            });
        }
    },

    getAll: async (req, res) => {
        try {
            const musicas = await Musica.find();
            return res.status(200).json(musicas);
        } catch (error) {
            return res.status(500).json({
                error: 'Erro ao buscar as músicas',
                details: error.message
            });
        }
    },

    getById: async (req, res) => {
        try {
            const { id } = req.params;
            const musica = await Musica.findById(id);

            if (!musica) {
                return res.status(404).json({ error: 'Música não encontrada' });
            }

            return res.status(200).json(musica);
        } catch (error) {
            return res.status(400).json({
                error: 'ID inválido ou erro na busca',
                details: error.message
            });
        }
    },

    update: async (req, res) => {
        try {
            const { id } = req.params;
            const { nome, artista, minutagem, descricao, feat, audioUrl, album } = req.body;

            const musicaAtualizada = await Musica.findByIdAndUpdate(
                id,
                { nome, artista, minutagem, descricao, feat, audioUrl, album },
                { new: true }
            );

            if (!musicaAtualizada) {
                return res.status(404).json({ error: 'Música não encontrada para atualização' });
            }

            return res.status(200).json(musicaAtualizada);

        } catch (error) {
            return res.status(400).json({
                error: 'Erro ao atualizar a música',
                details: error.message
            });
        }
    },

    delete: async (req, res) => {
        try {
            const { id } = req.params;
            const musicaDeletada = await Musica.findByIdAndDelete(id);

            if (!musicaDeletada) {
                return res.status(404).json({ error: 'Música não encontrada para exclusão' });
            }

            return res.status(200).json({ message: 'Música deletada com sucesso!' });

        } catch (error) {
            return res.status(400).json({
                error: 'Erro ao deletar a música',
                details: error.message
            });
        }
    }
};