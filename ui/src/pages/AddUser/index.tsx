import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

export default function InserirCliente() {
    const navigate = useNavigate();
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [nascimento, setNascimento] = useState("");
    const [erro, setErro] = useState("");

const salvarCliente = async (event: any) => {
    event.preventDefault();
    // ... resto do seu código

        // Validação básica no front-end antes de enviar
        if (!nome || !email || !nascimento) {
            setErro("Por favor, preencha todos os campos obrigatórios.");
            return;
        }

        try {
            await axios.post("http://localhost:3000/cliente/", {
                nome,
                email,
                nascimento
            });

            // Redireciona de volta para a lista de clientes usando o router do React
            navigate("/clientes"); 
        } catch (error: any) {
            console.error("Erro ao criar cliente:", error);
            setErro(error.response?.data?.message || "Erro ao conectar com o servidor.");
        }
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card border-0 shadow-sm p-4" style={{ borderRadius: '12px' }}>
                        <h2 className="text-center mb-4" style={{ fontWeight: 600 }}>Cadastrar Cliente</h2>
                        
                        {erro && <div className="alert alert-danger py-2">{erro}</div>}

                        <form onSubmit={salvarCliente}>
                            <div className="mb-3">
                                <label htmlFor="nome" className="form-label" style={{ fontWeight: 500 }}>Nome Completo</label>
                                <input
                                    type="text"
                                    className="form-content form-control"
                                    id="nome"
                                    value={nome}
                                    onChange={(e) => setNome(e.target.value)}
                                    placeholder="Digite o nome do cliente"
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="email" className="form-label" style={{ fontWeight: 500 }}>E-mail</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="nome@exemplo.com"
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="nascimento" className="form-label" style={{ fontWeight: 500 }}>Data de Nascimento</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    id="nascimento"
                                    value={nascimento}
                                    onChange={(e) => setNascimento(e.target.value)}
                                />
                            </div>

                            <div className="d-flex gap-3">
                                <Link to="/clientes" className="btn btn-light w-50" style={{ borderRadius: '6px' }}>
                                    Cancelar
                                </Link>
                                <button type="submit" className="btn btn-primary w-50" style={{ borderRadius: '6px' }}>
                                    Salvar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}