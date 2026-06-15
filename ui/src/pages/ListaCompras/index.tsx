import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

interface Compra {
    _id: string;
    clienteId: {
        nome: string;
    } | null;
    produtoId: {
        nome: string;
        preco: number;
    } | null;
    quantidade: number;
    data: string;
}

export default function ListaCompras() {
    const [compras, setCompras] = useState<Compra[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");

    const carregarCompras = async () => {
        try {
            setCarregando(true);
            const response = await axios.get("http://localhost:3000/compra/");
            // O seu CompraController devolve os dados dentro de { data: compras }
            setCompras(response.data.data || []);
        } catch (error) {
            console.error("Erro ao buscar compras:", error);
            setErro("Não foi possível carregar o histórico de compras.");
        } finally {
            setCarregando(false);
        }
    };

    const deletarCompra = async (id: string) => {
        if (window.confirm("Tem certeza que deseja estornar/deletar esta compra?")) {
            try {
                await axios.delete(`http://localhost:3000/compra/${id}`);
                // Atualiza a lista removendo a deletada
                setCompras(compras.filter(compra => compra._id !== id));
            } catch (error) {
                console.error("Erro ao deletar compra:", error);
                alert("Erro ao deletar a compra.");
            }
        }
    };

    useEffect(() => {
        carregarCompras();
    }, []);

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="text-secondary fw-semibold">Histórico de Compras / Vendas</h2>
                {/* 🔄 Rota corrigida aqui de "/compras" para "/comprar-produto" */}
                <Link to="/comprar-produto" className="btn btn-primary fw-medium" style={{ backgroundColor: '#4F46E5', borderColor: '#4F46E5' }}>
                    + Registrar Nova Compra
                </Link>
            </div>

            {erro && <div className="alert alert-danger">{erro}</div>}

            {carregando ? (
                <div className="text-center my-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Carregando...</span>
                    </div>
                </div>
            ) : compras.length === 0 ? (
                <div className="alert alert-light text-center border shadow-sm py-4">
                    Nenhuma compra registrada até o momento.
                </div>
            ) : (
                <div className="table-responsive card shadow-sm p-3" style={{ borderRadius: '12px' }}>
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light text-muted small uppercase text-center">
                            <tr>
                                <th>Data</th>
                                <th>Cliente</th>
                                <th>Produto</th>
                                <th>Qtd.</th>
                                <th>Preço Unitário</th>
                                <th>Total</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody className="text-center">
                            {compras.map((compra) => {
                                // Cálculos seguros caso o produto ou cliente tenham sido excluídos do banco
                                const nomeCliente = compra.clienteId?.nome || "Cliente Removido";
                                const nomeProduto = compra.produtoId?.nome || "Produto Removido";
                                const precoUnitario = compra.produtoId?.preco || 0;
                                const total = precoUnitario * compra.quantidade;
                                const dataFormatada = new Date(compra.data).toLocaleDateString('pt-BR');

                                return (
                                    <tr key={compra._id}>
                                        <td className="text-muted">{dataFormatada}</td>
                                        <td className="fw-medium">{nomeCliente}</td>
                                        <td>{nomeProduto}</td>
                                        <td><span className="badge bg-light text-dark border">{compra.quantidade}</span></td>
                                        <td>R$ {precoUnitario.toFixed(2)}</td>
                                        <td className="fw-bold text-success">R$ {total.toFixed(2)}</td>
                                        <td>
                                            <button 
                                                className="btn btn-outline-danger btn-sm"
                                                onClick={() => deletarCompra(compra._id)}
                                                style={{ borderRadius: '6px' }}
                                            >
                                                Deletar
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}