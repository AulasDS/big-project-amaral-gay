import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

interface Cliente {
    _id: string;
    nome: string;
    email: string;
    nascimento: string;
    __v?: number;
}

interface ApiResponse {
    data: Cliente[];
}

export default function ListaClientes() {
    const [clientes, setClientes] = useState<Cliente[]>([]);

    useEffect(() => {
        const carregarClientes = async () => {
            try {
                // Rota baseada no seu ClienteRouter.js
                const response = await axios.get<ApiResponse>("http://localhost:3000/cliente/");
                setClientes(response.data.data);
            } catch (error) {
                console.error("Erro na requisição com Axios:", error);
            }
        };

        carregarClientes();
    }, []);

    const excluir = async (id: string) => {
        if (window.confirm("Tem certeza que deseja excluir este cliente?")) {
            try {
                await axios.delete(`http://localhost:3000/cliente/${id}`);
                // Remove do estado local para sumir da tela instantaneamente sem dar reload na página inteira
                setClientes(clientes.filter(cliente => cliente._id !== id));
            } catch (error) {
                console.error("Erro ao excluir cliente:", error);
            }
        }
    }

    // Função auxiliar para deixar a data no formato brasileiro (DD/MM/AAAA)
    const formatarData = (dataString: string) => {
        const data = new Date(dataString);
        return data.toLocaleDateString("pt-BR", { timeZone: "UTC" });
    }

    return (
        <>
            <div className="container-fluid py-4">
                <h1 className="text-center mb-4" style={{ fontWeight: 600 }}>Lista de Clientes</h1>
                <Link className="btn btn-secondary mb-4 px-4" to="/inserir-cliente">Inserir Cliente</Link>

                <div className="row row-cols-1 row-cols-md-3 g-4">
                    {clientes.map((cliente) => (
                        <div className="col" key={cliente._id}>
                            <div className="card h-100 border-0 shadow-sm" style={{ borderRadius: '12px', overflow: 'hidden' }}>
                                <div className="card-header bg-transparent border-0 pt-3" style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center' }}>
                                    <div></div>

                                    <h5 className="card-title m-0 text-dark" style={{ fontWeight: 600, fontSize: '1.15rem' }}>
                                        {cliente.nome}
                                    </h5>

                                    <div className="text-end">
                                        <button
                                            className="btn btn-link text-danger p-1"
                                            onClick={() => excluir(cliente._id)}
                                            title="Excluir cliente"
                                            style={{ textDecoration: 'none', lineHeight: 1 }}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                                                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                <div className="card-body d-flex flex-column pt-2">
                                    <p className="card-text text-muted small mb-1">
                                        <strong>E-mail:</strong> {cliente.email}
                                    </p>
                                    <p className="card-text text-muted small mb-2">
                                        <strong>Nascimento:</strong> {formatarData(cliente.nascimento)}
                                    </p>

                                    <div className="d-flex justify-content-end align-items-center mt-3 pt-3 border-top">
                                        <Link to={`/editar-cliente/${cliente._id}`} className="btn btn-primary btn-sm px-3" style={{ borderRadius: '6px' }}>
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