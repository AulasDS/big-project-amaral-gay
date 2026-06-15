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

    const salvarCliente = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErro("");

        if (!nome || !email || !nascimento) {
            setErro("Por favor, preencha todos os campos obrigatórios.");
            return;
        }

        try {
            await axios.post("http://localhost:3000/clientes", {
                nome,
                email,
                nascimento
            });

            navigate("/clientes");

        } catch (error: any) {
            console.error("Erro ao criar cliente:", error);
            setErro(
                error.response?.data?.message ||
                "Erro ao conectar com o servidor."
            );
        }
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card border-0 shadow-sm p-4" style={{ borderRadius: "12px" }}>
                        <h2 className="text-center mb-4">Cadastrar Cliente</h2>

                        {erro && (
                            <div className="alert alert-danger py-2">
                                {erro}
                            </div>
                        )}

                        <form onSubmit={salvarCliente}>
                            <div className="mb-3">
                                <label className="form-label">Nome Completo</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={nome}
                                    onChange={(e) => setNome(e.target.value)}
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">E-mail</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <div className="mb-4">
                                <label className="form-label">Data de Nascimento</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    value={nascimento}
                                    onChange={(e) => setNascimento(e.target.value)}
                                />
                            </div>

                            <div className="d-flex gap-3">
                                <Link to="/clientes" className="btn btn-light w-50">
                                    Cancelar
                                </Link>

                                <button type="submit" className="btn btn-primary w-50">
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