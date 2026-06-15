const Cliente = require('../models/Usuario');

class ClienteController {
    static async create(req, res) {
        try {
            const { nome, email, nascimento } = req.body;
            
            if (!nome || !email || !nascimento) {
                return res.status(400).json({ message: "Dados inválidos. Certifique-se de enviar nome, email e nascimento." });
            }

            const clienteData = {
                nome,
                email,
                nascimento
            };

            const newCliente = await Cliente.create(clienteData);
            return res.status(201).json({ message: 'Cliente criado com sucesso', data: newCliente });

        } catch (error) {
            return res.status(500).json({ message: 'Erro ao criar cliente', error: error.message });
        }
    }

    static async getAll(req, res) {
        try {
            const clientes = await Cliente.find();
            return res.status(200).json({ data: clientes });
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao encontrar clientes', error: error.message });
        }
    }

    static async getById(req, res) {
        try {
            const { id } = req.params;
            const cliente = await Cliente.findById(id);
            
            if (!cliente) {
                return res.status(404).json({ message: 'Cliente não encontrado' });
            }
            return res.status(200).json({ data: cliente });
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao encontrar cliente', error: error.message });
        }
    }

    static async update(req, res) {
        try {
            const { id } = req.params;
            const { nome, email, nascimento } = req.body;
            
            const updatedData = {
                nome,
                email,
                nascimento
            };
            
            const updatedCliente = await Cliente.findByIdAndUpdate(id, updatedData, { new: true });
            
            if (!updatedCliente) {
                return res.status(404).json({ message: 'Cliente não encontrado' });
            }
            return res.status(200).json({ message: 'Cliente atualizado com sucesso', data: updatedCliente });
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao atualizar cliente', error: error.message });
        }
    }

    static async delete(req, res) {
        try {
            const { id } = req.params;
            const deletedCliente = await Cliente.findByIdAndDelete(id);
            
            if (!deletedCliente) {
                return res.status(404).json({ message: 'Cliente não encontrado' });
            }
            return res.status(200).json({ message: 'Cliente deletado com sucesso' });
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao deletar cliente', error: error.message });
        }
    }
}

module.exports = ClienteController;