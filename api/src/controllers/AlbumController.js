const Album = require('../models/Album');

const albumController = {
    // 1. Cadastrar Álbum no Banco
    create: async (req, res) => {
        try {
            const { nome, artista, capaUrl, ano, genero } = req.body;
            
            // Log para ver se os dados estão chegando do React
            console.log("Dados recebidos no backend:", req.body);

            const novoAlbum = await Album.create({ 
                nome, 
                artista, 
                capaUrl, 
                ano, 
                genero: genero || 'Geral' 
            });

            return res.status(201).json({ message: 'Álbum criado!', data: novoAlbum });
        } catch (error) {
            // Essa linha vai forçar o terminal a mostrar o erro real se o banco de dados falhar
            console.error("💥 ERRO CRÍTICO NO BANCO DE DADOS:", error);
            
            return res.status(500).json({ message: 'Erro interno', error: error.message });
        }
    },


    getAll: async (req, res) => {
        try {
            const { genero } = req.query;
            let filtro = {};
            
            if (genero) {
                // Filtro case-insensitive para o gênero musical
                filtro.genero = { $regex: new RegExp("^" + genero + "$", "i") };
            }

            const albuns = await Album.find(filtro);
            return res.status(200).json(albuns);
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao buscar álbuns.', error: error.message });
        }
    },

    getById: async (req, res) => {
        try {
            const { id } = req.params;
            const album = await Album.findById(id).populate('musicas');;
            if (!album) {
                return res.status(404).json({ message: 'Álbum não encontrado.' });
            }
            return res.status(200).json(album);
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao buscar o álbum.', error: error.message });
        }
    },

    update: async (req, res) => {
        try {
            const { id } = req.params;
            const { nome, artista, capaUrl, ano, genero } = req.body;
            const albumAtualizado = await Album.findByIdAndUpdate(id, { nome, artista, capaUrl, ano, genero }, { new: true });
            return res.status(200).json({ message: 'Álbum atualizado!', data: albumAtualizado });
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao atualizar.', error: error.message });
        }
    },

    delete: async (req, res) => {
        try {
            const { id } = req.params;
            await Album.findByIdAndDelete(id);
            return res.status(200).json({ message: 'Deletado com sucesso!' });
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao deletar.', error: error.message });
        }
    }
};

module.exports = albumController;