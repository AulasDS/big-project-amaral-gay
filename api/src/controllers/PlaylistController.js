const Playlist = require('../models/Playlist');

module.exports = {
    // POST '/' - Cria uma playlist vazia ou já com músicas
    create: async (req, res) => {
        try {
            const { nome, descricao, musicas } = req.body;
            
            const novaPlaylist = new Playlist({
                nome,
                descricao,
                musicas // Pode mandar um array de IDs de músicas aqui ex: ["id1", "id2"]
            });

            await novaPlaylist.save();
            return res.status(201).json(novaPlaylist);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao criar a playlist', details: error.message });
        }
    },

    // GET '/' - Lista todas as playlists (trazendo os dados das músicas juntas)
    getAll: async (req, res) => {
        try {
            const playlists = await Playlist.find().populate('musicas');
            return res.status(200).json(playlists);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao buscar as playlists', details: error.message });
        }
    },

    // GET '/:id' - Busca uma playlist específica com todas as suas músicas
    getById: async (req, res) => {
        try {
            const { id } = req.params;
            const playlist = await Playlist.findById(id).populate('musicas');

            if (!playlist) {
                return res.status(404).json({ error: 'Playlist não encontrada' });
            }

            return res.status(200).json(playlist);
        } catch (error) {
            return res.status(400).json({ error: 'ID inválido ou erro na busca', details: error.message });
        }
    },

    // PUT '/:id' - Atualiza o nome, descrição ou a lista de músicas
    update: async (req, res) => {
        try {
            const { id } = req.params;
            const { nome, descricao, musicas } = req.body;

            const playlistAtualizada = await Playlist.findByIdAndUpdate(
                id, 
                { nome, descricao, musicas }, 
                { new: true } // Retorna a playlist já atualizada no JSON
            ).populate('musicas');

            if (!playlistAtualizada) {
                return res.status(404).json({ error: 'Playlist não encontrada para atualização' });
            }

            return res.status(200).json(playlistAtualizada);
        } catch (error) {
            return res.status(400).json({ error: 'Erro ao atualizar a playlist', details: error.message });
        }
    },

    // DELETE '/:id' - Deleta a playlist
    delete: async (req, res) => {
        try {
            const { id } = req.params;
            const playlistDeletada = await Playlist.findByIdAndDelete(id);

            if (!playlistDeletada) {
                return res.status(404).json({ error: 'Playlist não encontrada para exclusão' });
            }

            return res.status(200).json({ message: 'Playlist deletada com sucesso!' });
        } catch (error) {
            return res.status(400).json({ error: 'Erro ao deletar a playlist', details: error.message });
        }
    }
};