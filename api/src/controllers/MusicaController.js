const Musica = require('../models/Musica'); 
const Album = require('../models/Album'); // 👈 PASSO 1: Importe o model do Album aqui no topo

module.exports = {
    // POST '/' - Cria uma nova música e vincula ao Álbum
    create: async (req, res) => {
        try {
            // 👈 PASSO 2: Recebemos o campo 'album' e 'audioUrl' vindos do formulário do Front-End
            const { nome, artista, minutagem, descricao, feat, album, audioUrl } = req.body;
            
            const novaMusica = new Musica({
                nome,
                artista,
                minutagem,
                descricao,
                feat,
                audioUrl, // Garante que a URL do arquivo de áudio salve no banco
                album     // Salva a referência do ID do álbum na própria música
            });

            await novaMusica.save();

            // 👈 PASSO 3: Se o usuário selecionou um álbum no formulário, atualizamos o documento dele!
            if (album) {
                await Album.findByIdAndUpdate(album, {
                    $push: { musicas: novaMusica._id } // Dá um push com o ID da nova música no array do álbum
                });
            }

            return res.status(201).json(novaMusica);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao criar a música', details: error.message });
        }
    },

    // GET '/' - Lista todas as músicas
    getAll: async (req, res) => {
        try {
            const musicas = await Musica.find();
            return res.status(200).json(musicas);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao buscar as músicas', details: error.message });
        }
    },

    // GET '/:id' - Busca uma música específica pelo ID
    getById: async (req, res) => {
        try {
            const { id } = req.params;
            const musica = await Musica.findById(id);

            if (!musica) {
                return res.status(404).json({ error: 'Música não encontrada' });
            }

            return res.status(200).json(musica);
        } catch (error) {
            return res.status(400).json({ error: 'ID inválido ou erro na busca', details: error.message });
        }
    },

    // PUT '/:id' - Atualiza os dados de uma música
    update: async (req, res) => {
        try {
            const { id } = req.params;
            const { nome, artista, minutagem, descricao, feat, audioUrl, album } = req.body;

            // O { new: true } faz o Mongoose retornar a música já atualizada
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
            return res.status(400).json({ error: 'Erro ao atualizar a música', details: error.message });
        }
    },

    // DELETE '/:id' - Deleta uma música do banco
    delete: async (req, res) => {
        try {
            const { id } = req.params;
            const musicaDeletada = await Musica.findByIdAndDelete(id);

            if (!musicaDeletada) {
                return res.status(404).json({ error: 'Música não encontrada para exclusão' });
            }

            return res.status(200).json({ message: 'Música deletada com sucesso!' });
        } catch (error) {
            return res.status(400).json({ error: 'Erro ao deletar a música', details: error.message });
        }
    }
};