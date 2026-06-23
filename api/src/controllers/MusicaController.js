const Musica = require('../models/Musica');
const Album = require('../models/Album');
const { OpenAI } = require('openai');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

// 🔴 CONFIGURAÇÃO DA IA: Coloque sua chave da Groq aqui!
const openai = new OpenAI({
    apiKey: '', 
    baseURL: 'https://api.groq.com/openai/v1',
});

module.exports = {
    create: async (req, res) => {
        // Criamos a variável fora para o fs conseguir apagar o arquivo no bloco final (catch/finally) se algo falhar
        let tempFilePath = null; 
        
        try {
            let { nome, artista, genero, capaUrl, audioUrl, albumId, gerarLetraAutomatico } = req.body;

            // 🟢 INTEGRAÇÃO INTELIGENTE DA CAPA:
            if (!capaUrl && albumId) {
                const albumPai = await Album.findById(albumId);
                if (albumPai && albumPai.capaUrl) {
                    capaUrl = albumPai.capaUrl;
                }
            }

            let letraGerada = [];

            // 🔴 ENTRADA DA INTELIGÊNCIA ARTIFICIAL:
            if (gerarLetraAutomatico && audioUrl) {
                console.log(`🤖 Baixando áudio para transcrever a faixa: "${nome}"...`);
                
                // Define o caminho temporário do arquivo mp3 de forma única
                tempFilePath = path.join(__dirname, `temp_${Date.now()}_audio.mp3`);
                
                // Faz o download via stream
                const responseAudio = await axios({
                    url: audioUrl,
                    method: 'GET',
                    responseType: 'stream',
                });
                
                const writer = fs.createWriteStream(tempFilePath);
                responseAudio.data.pipe(writer);

                await new Promise((resolve, reject) => {
                    writer.on('finish', resolve);
                    writer.on('error', reject);
                });

                console.log(`✨ Transcrevendo áudio com Whisper AI...`);
                
                // Envia o arquivo baixado para a Groq extrair segmentos de áudio e carimbos de tempo (timestamps)
                const transcricao = await openai.audio.transcriptions.create({
                    file: fs.createReadStream(tempFilePath),
                    model: 'whisper-large-v3',
                    response_format: 'verbose_json',
                });

                if (transcricao.segments) {
                    letraGerada = transcricao.segments.map((segmento) => ({
                        tempo: Math.round(segmento.start), // O segundo em que a frase começa
                        texto: segmento.text.trim(),       // A frase falada/cantada
                    }));
                }

                // Remove o arquivo do servidor imediatamente após o uso
                if (fs.existsSync(tempFilePath)) {
                    fs.unlinkSync(tempFilePath);
                }
                console.log(`✅ Transcrição concluída com sucesso!`);
            }

            // Criando o objeto da música incluindo a letra gerada ou o array vazio []
            const novaMusica = new Musica({
                nome,
                artista,
                genero,
                capaUrl,
                audioUrl,
                albumId,
                letraSincronizada: letraGerada 
            });

            await novaMusica.save();

            if (albumId) {
                await Album.findByIdAndUpdate(albumId, {
                    $push: { musicas: novaMusica._id }
                });
            }

            return res.status(201).json(novaMusica);
        } catch (error) {
            // Segurança: Se der erro no download ou na API, limpa o arquivo morto temporário do servidor
            if (tempFilePath && fs.existsSync(tempFilePath)) {
                fs.unlinkSync(tempFilePath);
            }
            console.error('Erro detalhado no Controller:', error);
            return res.status(500).json({ error: 'Erro ao criar a música', details: error.message });
        }
    },

    getAll: async (req, res) => {
        try {
            const { genero } = req.query;
            let filter = {};

            if (genero && genero !== 'Geral') {
                filter.genero = genero;
            }

            const musicas = await Musica.find(filter);
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