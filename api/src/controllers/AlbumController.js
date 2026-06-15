const Album = require('../models/Album');

const albumController = {

    // POST '/' - Cria um álbum real no MongoDB
    create: async (req, res) => {
        try {
            const { nome, artista, capaUrl, ano } = req.body;

            if (!nome || !artista || !ano) {
                return res.status(400).json({ message: 'Nome, Artista e Ano são obrigatórios.' });
            }

            // AGORA CONECTADO AO MONGOOSE:
            const novoAlbum = await Album.create({ nome, artista, capaUrl, ano });

            return res.status(201).json({
                message: 'Álbum criado com sucesso!',
                data: novoAlbum
            });
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao criar álbum.', error: error.message });
        }
    },

    // GET '/' - Busca todos os álbuns do banco
    getAll: async (req, res) => {
        try {
            // AGORA CONECTADO AO MONGOOSE:
            const albuns = await Album.find(); 

            return res.status(200).json(albuns);
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao buscar álbuns.', error: error.message });
        }
    },

    // GET '/:id' - Busca um único álbum por ID
    getById: async (req, res) => {
        try {
            const { id } = req.params;

            // AGORA CONECTADO AO MONGOOSE:
            const album = await Album.findById(id);

            if (!album) {
                return res.status(404).json({ message: 'Álbum não encontrado.' });
            }

            return res.status(200).json(album);
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao buscar o álbum.', error: error.message });
        }
    },

    // PUT '/:id' - Atualiza os dados de um álbum existente
    update: async (req, res) => {
        try {
            const { id } = req.params;
            const { nome, artista, capaUrl, ano } = req.body;

            // AGORA CONECTADO AO MONGOOSE:
            // { new: true } serve para retornar o objeto já atualizado
            const albumAtualizado = await Album.findByIdAndUpdate(
                id, 
                { nome, artista, capaUrl, ano }, 
                { new: true }
            );

            if (!albumAtualizado) {
                return res.status(404).json({ message: 'Álbum não encontrado para atualizar.' });
            }

            return res.status(200).json({
                message: 'Álbum atualizado com sucesso!',
                data: albumAtualizado
            });
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao atualizar álbum.', error: error.message });
        }
    },

    // DELETE '/:id' - Deleta o álbum do banco de dados
    delete: async (req, res) => {
        try {
            const { id } = req.params;

            // AGORA CONECTADO AO MONGOOSE:
            const albumDeletado = await Album.findByIdAndDelete(id);

            if (!albumDeletado) {
                return res.status(404).json({ message: 'Álbum não encontrado para deletar.' });
            }

            return res.status(200).json({ message: `Álbum deletado com sucesso!` });
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao deletar álbum.', error: error.message });
        }
    }
};

module.exports = albumController;