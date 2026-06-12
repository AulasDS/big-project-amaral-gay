const Produto = require('../models/Produto');

class ProdutoController {
    static async create(req, res) {
        try {
            const { nome, preco, quantidade, descricao } = req.body;
            
            if (!nome || !preco || quantidade === undefined || !descricao) {
                return res.status(400).json({ message: "Dados inválidos. Certifique-se de enviar nome, preco, quantidade e descricao." });
            }

            const produtoData = {
                nome,
                preco,
                quantidade,
                descricao
            };

            const newProduto = await Produto.create(produtoData);
            return res.status(201).json({ message: 'Produto criado com sucesso', data: newProduto });

        } catch (error) {
            return res.status(500).json({ message: 'Erro ao criar produto', error: error.message });
        }
    }

    static async getAll(req, res) {
        try {
            const products = await Produto.find();
            return res.status(200).json({ data: products });
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao encontrar produtos', error: error.message });
        }
    }

    static async getById(req, res) {
        try {
            const { id } = req.params;
            const product = await Produto.findById(id);
            if (!product) {
                return res.status(404).json({ message: 'Produto não encontrado' });
            }
            return res.status(200).json({ data: product });
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao encontrar produto', error: error.message });
        }
    }

    static async update(req, res) {
        try {
            const { id } = req.params;
            const { nome, preco, quantidade, descricao } = req.body;
            
            const updatedData = {
                nome,
                preco,
                quantidade,
                descricao
            };
            
            const updatedProduct = await Produto.findByIdAndUpdate(id, updatedData, { new: true });
            
            if (!updatedProduct) {
                return res.status(404).json({ message: 'Produto não encontrado' });
            }
            return res.status(200).json({ message: 'Produto atualizado com sucesso', data: updatedProduct });
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao atualizar produto', error: error.message });
        }
    }

    static async delete(req, res) {
        try {
            const { id } = req.params;
            const deletedProduct = await Produto.findByIdAndDelete(id);
            if (!deletedProduct) {
                return res.status(404).json({ message: 'Produto não encontrado' });
            }
            return res.status(200).json({ message: 'Produto deletado com sucesso' });
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao deletar produto', error: error.message });
        }
    }
}

module.exports = ProdutoController;