const Compra = require('../models/Compra');

class CompraController {
    static async create(req, res) {
        try {
            const { clienteId, produtoId, quantidade } = req.body;
            
            if (!clienteId || !produtoId || !quantidade) {
                return res.status(400).json({ message: "Dados inválidos. Envie clienteId, produtoId e quantidade." });
            }

            const compraData = {
                clienteId,
                produtoId,
                quantidade
            };

            const newCompra = await Compra.create(compraData);
            return res.status(201).json({ message: 'Compra registrada com sucesso', data: newCompra });

        } catch (error) {
            return res.status(500).json({ message: 'Erro ao registrar compra', error: error.message });
        }
    }

    static async getAll(req, res) {
        try {
            const compras = await Compra.find()
                .populate('clienteId')
                .populate('produtoId');
                
            return res.status(200).json({ data: compras });
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao listar compras', error: error.message });
        }
    }

    static async getById(req, res) {
        try {
            const { id } = req.params;
            const compra = await Compra.findById(id)
                .populate('clienteId')
                .populate('produtoId');

            if (!compra) {
                return res.status(404).json({ message: 'Compra não encontrada' });
            }
            return res.status(200).json({ data: compra });
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao buscar compra', error: error.message });
        }
    }

    static async update(req, res) {
        try {
            const { id } = req.params;
            const { clienteId, produtoId, quantidade, data } = req.body;
            
            const updatedData = {
                clienteId,
                produtoId,
                quantidade,
                data
            };

            const updatedCompra = await Compra.findByIdAndUpdate(id, updatedData, { new: true });
            
            if (!updatedCompra) {
                return res.status(404).json({ message: 'Compra não encontrada' });
            }
            return res.status(200).json({ message: 'Compra atualizada com sucesso', data: updatedCompra });
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao atualizar compra', error: error.message });
        }
    }

    static async delete(req, res) {
        try {
            const { id } = req.params;
            const deletedCompra = await Compra.findByIdAndDelete(id);
            
            if (!deletedCompra) {
                return res.status(404).json({ message: 'Compra não encontrada' });
            }
            return res.status(200).json({ message: 'Compra deletada com sucesso' });
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao deletar compra', error: error.message });
        }
    }
}

module.exports = CompraController;