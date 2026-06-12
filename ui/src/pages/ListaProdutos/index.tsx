import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

interface Produto {
    _id: string;
    nome: string;
    preco: number;
    quantidade: number;
    descricao: string;
    __v?: number;
}

interface ApiResponse {
    data: Produto[];
}

export default function ListaProdutos() {
    const [produtos, setProdutos] = useState<Produto[]>([]);

    useEffect(() => {
        const carregarProdutos = async () => {
            try {
                const response = await axios.get<ApiResponse>("http://localhost:3000/produto/");
                setProdutos(response.data.data);
            } catch (error) {
                console.error("Erro na requisição com Axios:", error);
            }
        };

        carregarProdutos();
    }, []);

    const excluir = async (id: any) => {
        await axios.delete(`http://localhost:3000/produto/${id}`)
            .then(() => {
                window.location.reload();
            });
    }

    return (
        <>
            <div className="container-fluid py-4">
                <h1 className="text-center mb-4" style={{ fontWeight: 600 }}>Lista de Produtos</h1>
                <Link className="btn btn-secondary mb-4 px-4" to="/inserir-produto">Inserir Produto</Link>

                <div className="row row-cols-1 row-cols-md-3 g-4">
                    {produtos.map((produto) => (
                        <div className="col" key={produto._id}>
                            <div className="card h-100 border-0 shadow-sm" style={{ borderRadius: '12px', overflow: 'hidden' }}>
                                <div className="card-header bg-transparent border-0 pt-3" style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center' }}>
                                    <div></div>

                                    <h5 className="card-title m-0 text-dark" style={{ fontWeight: 600, fontSize: '1.15rem' }}>
                                        {produto.nome}
                                    </h5>

                                    <div className="text-end">
                                        <button
                                            className="btn btn-link text-danger p-1"
                                            onClick={() => excluir(produto._id)}
                                            title="Excluir produto"
                                            style={{ textDecoration: 'none', lineHeight: 1 }}
                                        >
                                            <svg xmlns="http://w3.org" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                                                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                <div className="card-body d-flex flex-column pt-2">
                                    <p className="card-text text-muted small mb-2" style={{ flexGrow: 1 }}>
                                        {produto.descricao || "Sem descrição disponível."}
                                    </p>

                                    <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
                                        <div>
                                            <span className="text-muted d-block small" style={{ fontSize: '0.75rem', transform: 'translateY(3px)' }}>PREÇO</span>
                                            <span className="text-success fw-bold" style={{ fontSize: '1.25rem' }}>
                                                R$ {produto.preco}
                                            </span>
                                        </div>
                                        <div className="text-center">
                                            <span className="text-muted d-block small" style={{ fontSize: '0.75rem', transform: 'translateY(3px)' }}>QUANTIDADE</span>
                                            <span style={{ fontSize: '1.25rem'}}>
                                                {produto.quantidade}
                                            </span>
                                        </div>
                                        <Link to={`/editar-produto/${produto._id}`} className="btn btn-primary btn-sm px-3" style={{ borderRadius: '6px' }}>
                                            Editar
                                        </Link>
                                    </div>
                                </div>

                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}