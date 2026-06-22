const Musica = require('../models/Musica');
const Album = require('../models/Album');

module.exports = {
    create: async (req, res) => {
        try {
            let { nome, artista, genero, capaUrl, audioUrl, albumId } = req.body;

            // Se a música pertence a um álbum e não foi fornecida uma capaUrl específica para ela, automaticamente a capa cadastrada no álbum pai
            if (!capaUrl && albumId) {
                const albumPai = await Album.findById(albumId);
                if (albumPai && albumPai.capaUrl) {
                    capaUrl = albumPai.capaUrl;
                }
            }

            const novaMusica = new Musica({
                nome,
                artista,
                genero,
                capaUrl, 
                audioUrl,
                albumId
            });

            await novaMusica.save();

            if (albumId) {
                await Album.findByIdAndUpdate(albumId, {
                    $push: { musicas: novaMusica._id }
                });
            }

            return res.status(201).json(novaMusica);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao criar a música', details: error.message });
        }
    },

    getAll: async (req, res) => {
        try {
            const { genero } = req.query;
            let filtro = {};

            if (genero && genero !== 'Geral') {
                filtro.genero = genero;
            }

            const musicas = await Musica.find(filtro);
            return res.status(200).json(musicas);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao buscar as músicas', details: error.message });
        }
    },

    getById: async (req, res) => {
        try {
            const { id } = req.params;
            const musica = await Musica.findById(id);
            if (!musica) return res.status(404).json({ error: 'Música não encontrada' });
            return res.status(200).json(musica);
        } catch (error) {
            return res.status(400).json({ error: 'ID inválido ou erro na busca', details: error.message });
        }
    },

    update: async (req, res) => {
        try {
            const { id } = req.params;
            const { nome, artista, genero, capaUrl, audioUrl, albumId } = req.body;

            const musicaAtualizada = await Musica.findByIdAndUpdate(
                id,
                { nome, artista, genero, capaUrl, audioUrl, albumId },
                { new: true }
            );

            if (!musicaAtualizada) return res.status(404).json({ error: 'Música não encontrada para atualização' });
            return res.status(200).json(musicaAtualizada);
        } catch (error) {
            return res.status(400).json({ error: 'Erro ao atualizar a música', details: error.message });
        }
    },

    delete: async (req, res) => {
        try {
            const { id } = req.params;
            const musicaDeletada = await Musica.findByIdAndDelete(id);
            if (!musicaDeletada) return res.status(404).json({ error: 'Música não encontrada para exclusão' });
            return res.status(200).json({ message: 'Música deletada com sucesso!' });
        } catch (error) {
            return res.status(400).json({ error: 'Erro ao deletar a música', details: error.message });
        }
    }
};