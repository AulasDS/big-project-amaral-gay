const Cliente = require('../models/Usuario');

class ClienteController {

    static sendResponse(res, status, message, data = null) {
        return res.status(status).json({
            message,
            ...(data && { data })
        });
    }

    static async create(req, res) {
        try {
            const { nome, email, nascimento } = req.body;

            if (!nome || !email || !nascimento) {
                return ClienteController.sendResponse(
                    res,
                    400,
                    "Nome, email e nascimento são obrigatórios"
                );
            }

            const newCliente = await Cliente.create({ nome, email, nascimento });

            return ClienteController.sendResponse(
                res,
                201,
                "Cliente criado com sucesso",
                newCliente
            );

        } catch (error) {
            return ClienteController.sendResponse(
                res,
                500,
                "Erro ao criar cliente",
                { error: error.message }
            );
        }
    }

    static async getAll(req, res) {
        try {
            const clientes = await Cliente.find();

            return ClienteController.sendResponse(
                res,
                200,
                "Clientes encontrados",
                clientes
            );
        } catch (error) {
            return ClienteController.sendResponse(
                res,
                500,
                "Erro ao buscar clientes",
                { error: error.message }
            );
        }
    }

    static async getById(req, res) {
        try {
            const { id } = req.params;

            const cliente = await Cliente.findById(id);

            if (!cliente) {
                return ClienteController.sendResponse(
                    res,
                    404,
                    "Cliente não encontrado"
                );
            }

            return ClienteController.sendResponse(
                res,
                200,
                "Cliente encontrado",
                cliente
            );

        } catch (error) {
            return ClienteController.sendResponse(
                res,
                500,
                "Erro ao buscar cliente",
                { error: error.message }
            );
        }
    }

    static async update(req, res) {
        try {
            const { id } = req.params;
            const { nome, email, nascimento } = req.body;

            const updatedCliente = await Cliente.findByIdAndUpdate(
                id,
                { nome, email, nascimento },
                { new: true, runValidators: true }
            );

            if (!updatedCliente) {
                return ClienteController.sendResponse(
                    res,
                    404,
                    "Cliente não encontrado"
                );
            }

            return ClienteController.sendResponse(
                res,
                200,
                "Cliente atualizado com sucesso",
                updatedCliente
            );

        } catch (error) {
            return ClienteController.sendResponse(
                res,
                500,
                "Erro ao atualizar cliente",
                { error: error.message }
            );
        }
    }

    static async delete(req, res) {
        try {
            const { id } = req.params;

            const deletedCliente = await Cliente.findByIdAndDelete(id);

            if (!deletedCliente) {
                return ClienteController.sendResponse(
                    res,
                    404,
                    "Cliente não encontrado"
                );
            }

            return ClienteController.sendResponse(
                res,
                200,
                "Cliente deletado com sucesso"
            );

        } catch (error) {
            return ClienteController.sendResponse(
                res,
                500,
                "Erro ao deletar cliente",
                { error: error.message }
            );
        }
    }
}

module.exports = ClienteController;