const Biblioteca = require('../models/Biblioteca');
const Review = require('../models/Review');
const Usuario = require('../models/Usuario');

const interacaoController = {
    // POST /biblioteca
    // 🟢 Atualizado para aceitar de forma flexível 'musicaId' ou 'albumId'
    adicionarNaBiblioteca: async (req, res) => {
        try {
            const { userId, musicaId, albumId } = req.body;
            
            if (!userId) {
                return res.status(400).json({ message: 'Falta userId' });
            }
            if (!musicaId && !albumId) {
                return res.status(400).json({ message: 'Falta informar o musicaId ou albumId para adicionar.' });
            }

            // 🟢 AJUSTE ESSENCIAL: Cria o objeto apenas com as chaves que realmente existem.
            // Isso impede que o campo que ficou de fora seja salvo como 'null' e estoure o índice único do Mongo!
            const dadosInsercao = { userId };
            if (musicaId) dadosInsercao.musicaId = musicaId;
            if (albumId) dadosInsercao.albumId = albumId;

            const curtida = await Biblioteca.create(dadosInsercao);
            
            const tipoItem = musicaId ? 'Música' : 'Álbum';
            return res.status(201).json({ message: `${tipoItem} adicionado(a) à biblioteca!`, data: curtida });
        } catch (error) {
            // Se você tiver um índice único composto no Mongoose para evitar duplicidade, ele cairá aqui
            if (error.code === 11000) {
                return res.status(400).json({ message: 'Você já curtiu/salvou este item!' });
            }
            return res.status(500).json({ message: 'Erro ao salvar na biblioteca.', error: error.message });
        }
    },

    // GET /biblioteca/:userId
    getBibliotecaUsuario: async (req, res) => {
        try {
            const { userId } = req.params;
            
            // 🟢 Traz os dados reais preenchidos tanto para música quanto para álbum
            const curtidas = await Biblioteca.find({ userId })
                .populate('musicaId')
                .populate('albumId');
                
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