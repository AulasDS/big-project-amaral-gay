import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Produto {
    _id: string;
    nome: string;
    quantidade: number;
}

interface Cliente {
    _id: string;
    nome: string;
}

export default function InserirCompra() {
    const navigate = useNavigate();

    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [clienteId, setClienteId] = useState("");
    const [produtoId, setProdutoId] = useState("");
    const [quantidade, setQuantidade] = useState<number | string>("");

    useEffect(() => {
        const buscarProdutosClientes = async () => {
            try {
                const response = await axios.get('http://localhost:3000/produto');
                const listaProdutos = response.data.data || response.data;
                setProdutos(listaProdutos);

                const response2 = await axios.get('http://localhost:3000/cliente');
                const listaClientes = response2.data.data || response2.data;
                setClientes(listaClientes);
            } catch (error) {
                alert("Erro ao carregar a lista de produtos.");
                navigate("/");
            }
        };
        buscarProdutosClientes();
    }, [navigate]);

    const produtoSelecionado = produtos.find(p => p._id === produtoId);
    const quantidadeDisponivel = produtoSelecionado ? produtoSelecionado.quantidade : 0;

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (Number(quantidade) > quantidadeDisponivel) {
            alert(`A quantidade solicitada é maior que o estoque disponível (${quantidadeDisponivel}).`);
            return;
        }

        const dadosCompra = { 
            clienteId: clienteId, 
            produtoId: produtoId, 
            quantidade: Number(quantidade) 
        };

        axios.post('http://localhost:3000/compra', dadosCompra)
            .then(() => {
                axios.put(`http://localhost:3000/produto/${produtoId}`, {
                    quantidade: quantidadeDisponivel - Number(quantidade)
                });
                navigate('/compras');
            })
            .catch((error) => {
                alert("Erro ao inserir a compra. Tente novamente.");
                console.error(error);
            });
    }

    return (
        <div className="d-flex justify-content-center mt-5 align-items-center">
            <div className="card shadow-sm p-4 w-100" style={{ maxWidth: '450px', borderRadius: '12px' }}>
                <h2 className="text-center mb-4 text-secondary fw-semibold">Inserir Compra</h2>

                <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
                    <div>
                        <label className="form-label text-muted small fw-medium">Cliente</label>
                        <select
                            className="form-select form-select-lg fs-6"
                            value={clienteId}
                            onChange={(e) => {
                                setClienteId(e.target.value);
                            }}
                            required
                        >
                            <option value="" disabled>Selecione um cliente</option>
                            {clientes.map((cliente) => (
                                <option key={cliente._id} value={cliente._id}>
                                    {cliente.nome}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="form-label text-muted small fw-medium">Produto</label>
                        <select
                            className="form-select form-select-lg fs-6"
                            value={produtoId}
                            onChange={(e) => {
                                setProdutoId(e.target.value);
                                setQuantidade(""); // Reseta a quantidade ao trocar de produto
                            }}
                            required
                        >
                            <option value="" disabled>Selecione um produto</option>
                            {produtos.map((produto) => (
                                <option key={produto._id} value={produto._id} disabled={produto.quantidade <= 0}>
                                    {produto.nome} {produto.quantidade <= 0 ? '(Sem estoque)' : ''}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="form-label text-muted small fw-medium">
                            Quantidade 
                            {produtoSelecionado && <span className="text-primary ms-2">(Em estoque: {quantidadeDisponivel})</span>}
                        </label>
                        <input
                            type="number"
                            className="form-control form-control-lg fs-6"
                            placeholder="Ex: 10"
                            value={quantidade}
                            onChange={(e) => setQuantidade(e.target.value)}
                            min="1"
                            max={produtoSelecionado ? quantidadeDisponivel : ""} // Trava o input HTML
                            disabled={!produtoId} // Só libera se tiver produto selecionado
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary btn-lg w-100 mt-2 fw-medium"
                        style={{ borderRadius: '8px', backgroundColor: '#4F46E5', borderColor: '#4F46E5' }}
                        disabled={!produtoId || Number(quantidade) > quantidadeDisponivel}
                    >
                        Salvar Compra
                    </button>
                </form>
            </div>
        </div>
    );
}