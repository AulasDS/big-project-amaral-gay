const Usuario = require('../models/Usuario');

class UsuarioController {
    // ➕ Criar um novo usuário/cliente
    static async create(req, res) {
        try {
            // Adicionado o campo 'tipo' vindo do formulário React
            const { nome, email, tipo, nascimento } = req.body;
            
            // Removemos a obrigatoriedade estrita do nascimento para não travar o cadastro antigo
            if (!nome || !email) {
                return res.status(400).json({ message: "Dados inválidos. Nome e E-mail são obrigatórios." });
            }

            const clienteData = {
                nome,
                email,
                tipo: tipo || 'Ouvinte', // Padrão caso não seja enviado
                nascimento
            };

            const newUsuario = await Usuario.create(clienteData);
            return res.status(201).json({ message: 'Usuário criado com sucesso', data: newUsuario });

        } catch (error) {
            console.error("💥 ERRO CRÍTICO NO CADASTRO:", error);
            
            // Trata o erro clássico de e-mail duplicado (Código 11000 do MongoDB)
            if (error.code === 11000) {
                return res.status(400).json({ message: 'Este e-mail já está sendo usado por outro perfil!' });
            }

            return res.status(500).json({ message: 'Erro ao criar usuário', error: error.message });
        }
    }

    // 📋 Buscar Todos (Ajustado para o formato padrão esperado pelas telas)
    static async getAll(req, res) {
        try {
            const usuarios = await Usuario.find().sort({ criadoEm: -1 });
            // Retornamos os usuários direto para bater com o "res.data" do seu React!
            return res.status(200).json(usuarios); 
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao encontrar usuários', error: error.message });
        }
    }

    // 🔍 Buscar por ID
    static async getById(req, res) {
        try {
            const { id } = req.params;
            const usuario = await Usuario.findById(id);
            
            if (!usuario) {
                return res.status(404).json({ message: 'Usuário não encontrado' });
            }
            return res.status(200).json(usuario);
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao encontrar usuário', error: error.message });
        }
    }

    // ✏️ Atualizar Dados do Perfil
    static async update(req, res) {
        try {
            const { id } = req.params;
            const { nome, email, tipo, nascimento } = req.body;
            
            const updatedData = {
                nome,
                email,
                tipo,
                nascimento
            };
            
            const updatedUsuario = await Usuario.findByIdAndUpdate(id, updatedData, { new: true });
            
            if (!updatedUsuario) {
                return res.status(404).json({ message: 'Usuário não encontrado' });
            }
            return res.status(200).json({ message: 'Usuário atualizado com sucesso', data: updatedUsuario });
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao atualizar usuário', error: error.message });
        }
    }

    // ❌ Deletar Perfil (Essencial para a tela de gerenciamento)
    static async delete(req, res) {
        try {
            const { id } = req.params;
            const deletedUsuario = await Usuario.findByIdAndDelete(id);
            
            if (!deletedUsuario) {
                return res.status(404).json({ message: 'Usuário não encontrado' });
            }
            return res.status(200).json({ message: 'Usuário deletado com sucesso' });
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao deletar usuário', error: error.message });
        }
    }
}

module.exports = UsuarioController;