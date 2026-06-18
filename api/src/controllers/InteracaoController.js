const Biblioteca = require('../models/Biblioteca');
const Review = require('../models/Review');
const Usuario = require('../models/Usuario');

const interacaoController = {
    // POST /biblioteca (Regra 4)
    // 🟢 Atualizado de curtirAlbum para curtirMusica e focado em musicaId
    curtirMusica: async (req, res) => {
        try {
            const { userId, musicaId } = req.body;
            if (!userId || !musicaId) return res.status(400).json({ message: 'Falta userId ou musicaId' });

            const curtida = await Biblioteca.create({ userId, musicaId });
            return res.status(201).json({ message: 'Música adicionada à biblioteca!', data: curtida });
        } catch (error) {
            if (error.code === 11000) {
                return res.status(400).json({ message: 'Você já curtiu esta música!' });
            }
            return res.status(500).json({ message: 'Erro ao curtir.', error: error.message });
        }
    },

    // GET /biblioteca/:userId (Regra 6)
    getBibliotecaUsuario: async (req, res) => {
        try {
            const { userId } = req.params;
            // 🟢 .populate alterado de 'albumId' para 'musicaId' para trazer os dados reais da música
            const curtidas = await Biblioteca.find({ userId }).populate('musicaId');
            return res.status(200).json(curtidas);
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao carregar biblioteca.', error: error.message });
        }
    },

    // POST /review (Regra 5)
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

    // GET /review/:albumId (Regra 5)
    getReviewsPorAlbum: async (req, res) => {
        try {
            const { albumId } = req.params;
            const reviews = await Review.find({ albumId }).populate('userId', 'nome'); // Traz o nome de quem comentou
            return res.status(200).json(reviews);
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao carregar comentários.', error: error.message });
        }
    }
};

module.exports = interacaoController;