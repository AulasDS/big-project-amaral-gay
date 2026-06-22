const Biblioteca = require('../models/Biblioteca');
const Review = require('../models/Review');
const Usuario = require('../models/Usuario');

const interacaoController = {

    adicionarNaBiblioteca: async (req, res) => {
        try {
            const { userId, musicaId, albumId } = req.body;

            if (!userId) {
                return res.status(400).json({ message: 'Falta userId' });
            }
            if (!musicaId && !albumId) {
                return res.status(400).json({ message: 'Falta informar o musicaId ou albumId para adicionar.' });
            }

            const dadosInsercao = { userId };
            if (musicaId) dadosInsercao.musicaId = musicaId;
            if (albumId) dadosInsercao.albumId = albumId;

            const curtida = await Biblioteca.create(dadosInsercao);

            const tipoItem = musicaId ? 'Música' : 'Álbum';
            return res.status(201).json({ message: `${tipoItem} adicionado(a) à biblioteca!`, data: curtida });
        } catch (error) {
            if (error.code === 11000) {
                return res.status(400).json({ message: 'Você já curtiu/salvou este item!' });
            }
            return res.status(500).json({ message: 'Erro ao salvar na biblioteca.', error: error.message });
        }
    },

    getBibliotecaUsuario: async (req, res) => {
        try {
            const { userId } = req.params;

            const curtidas = await Biblioteca.find({ userId })
                .populate('musicaId')
                .populate('albumId');

            return res.status(200).json(curtidas);
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao carregar biblioteca.', error: error.message });
        }
    },

    removerDaBiblioteca: async (req, res) => {
        try {
            const { userId, id } = req.params; // 'id' pode ser musicaId ou albumId

            const deletado = await Biblioteca.findOneAndDelete({
                userId,
                $or: [{ albumId: id }, { musicaId: id }]
            });

            if (!deletado) {
                return res.status(404).json({ message: 'Item não encontrado na biblioteca.' });
            }

            return res.status(200).json({ message: 'Item removido com sucesso da biblioteca!' });
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao remover da biblioteca.', error: error.message });
        }
    },

    // POST /review 
    criarReview: async (req, res) => {
        try {
            const { userId, albumId, comentario, nota } = req.body;
            if (!userId || !albumId || !comentario || !nota) {
                return res.status(400).json({ message: 'Todos os campos da review são obrigatórios.' });
            }
            const novaReview = await Review.create({ userId, albumId, comentario, nota });
            return res.status(201).json({ message: 'Review publicada com sucesso!', data: novaReview });
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao salvar review.', error: error.message });
        }
    },

    // GET /review/:albumId
    getReviewsPorAlbum: async (req, res) => {
        try {
            const { albumId } = req.params;
            const reviews = await Review.find({ albumId }).populate('userId', 'nome'); // Traz o nome de quem comentou
            return res.status(200).json(reviews);
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao carregar comentários.', error: error.message });
        }
    },

    //   DELETE /review/:reviewId/:userId
    deletarReview: async (req, res) => {
        try {
            const { reviewId, userId } = req.params;

            // Busca a review e garante que o userId bate com quem está tentando apagar
            const reviewDeletada = await Review.findOneAndDelete({ _id: reviewId, userId: userId });

            if (!reviewDeletada) {
                return res.status(404).json({ message: 'Review não encontrada ou você não tem permissão.' });
            }

            return res.status(200).json({ message: 'Review excluída com sucesso!' });
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao deletar review.', error: error.message });
        }
    }

};

module.exports = interacaoController;