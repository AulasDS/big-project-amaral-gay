const Album = require('../models/Album');

const albumController = {

    create: async (req, res) => {
        try {
            const { nome, artista, capaUrl, ano } = req.body;

            // Validação simples
            if (!nome || !artista) {
                return res.status(400).json({ message: 'Nome e Artista são obrigatórios.' });
            }

            // Exemplo com banco: const novoAlbum = await Album.create({ nome, artista, capaUrl, ano });
            const novoAlbum = { id: Date.now(), nome, artista, capaUrl, ano }; // Provisório

            return res.status(201).json({
                message: 'Álbum criado com sucesso!',
                data: novoAlbum
            });
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao criar álbum.', error: error.message });
        }
    },

    // GET '/'
    getAll: async (req, res) => {
        try {
            // Exemplo com banco: const albuns = await Album.find();
            const albuns = []; // Provisório, simulando a lista do banco

            return res.status(200).json(albuns);
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao buscar álbuns.', error: error.message });
        }
    },

    // GET '/:id'
    getById: async (req, res) => {
        try {
            const { id } = req.params;

            // Exemplo com banco: const album = await Album.findById(id);
            const album = { id, nome: "Álbum Exemplo", artista: "Artista Exemplo" }; // Provisório

            if (!album) {
                return res.status(404).json({ message: 'Álbum não encontrado.' });
            }

            return res.status(200).json(album);
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao buscar o álbum.', error: error.message });
        }
    },

    // PUT '/:id'
    update: async (req, res) => {
        try {
            const { id } = req.params;
            const { nome, artista, capaUrl, ano } = req.body;

            // Exemplo com banco: const albumAtualizado = await Album.findByIdAndUpdate(id, { nome, artista, capaUrl, ano }, { new: true });
            const albumAtualizado = { id, nome, artista, capaUrl, ano }; // Provisório

            return res.status(200).json({
                message: 'Álbum atualizado com sucesso!',
                data: albumAtualizado
            });
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao atualizar álbum.', error: error.message });
        }
    },

    // DELETE '/:id'
    delete: async (req, res) => {
        try {
            const { id } = req.params;

            // Exemplo com banco: await Album.findByIdAndDelete(id);

            return res.status(200).json({ message: `Álbum com ID ${id} deletado com sucesso!` });
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao deletar álbum.', error: error.message });
        }
    }
};

module.exports = albumController;