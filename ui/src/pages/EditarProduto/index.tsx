import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
    data: Produto;
}

export default function EditarProduto() {
    const { id } = useParams<{ id: string }>(); 
    const navigate = useNavigate();
    
    const [dadosForm, setDadosForm] = useState({
        nome: "",
        preco: "",
        quantidade: "",
        descricao: ""
    });
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
        const buscarProduto = async () => {
            try {
                const response = await axios.get<ApiResponse>(`http://localhost:3000/produto/${id}`);
                setDadosForm({
                    nome: response.data.data.nome,
                    preco: String(response.data.data.preco),
                    quantidade: String(response.data.data.quantidade),
                    descricao: response.data.data.descricao
                });
                setCarregando(false);
            } catch (error) {
                alert("Erro ao carregar os dados do produto.");
                navigate("/");
            }
        };

        if (id) buscarProduto();
    }, [id, navigate]);

    // Função para atualizar o estado conforme o usuário digita nos campos
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setDadosForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        const dadosAtualizados = {
            nome: dadosForm.nome,
            preco: Number(dadosForm.preco),
            quantidade: Number(dadosForm.quantidade),
            descricao: dadosForm.descricao,
        };

        try {
            await axios.put(`http://localhost:3000/produto/${id}`, dadosAtualizados);
            navigate("/produtos"); // Redireciona para a lista de produtos após salvar
        } catch (error) {
            console.error("Erro ao atualizar produto:", error);
            alert("Erro ao salvar as alterações.");
        }
    };

    if (carregando) {
        return (
            <div className="text-center mt-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Carregando...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="d-flex justify-content-center mt-5 align-items-center">
            <div className="card shadow-sm p-4 w-100" style={{ maxWidth: '450px', borderRadius: '12px' }}>
                <h2 className="text-center mb-4 text-secondary fw-semibold">Editar Produto</h2>

                <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
                    <div>
                        <label className="form-label text-muted small fw-medium">Nome do Produto</label>
                        <input 
                            type="text" 
                            className="form-control form-control-lg fs-6" 
                            name="nome" 
                            value={dadosForm.nome} 
                            onChange={handleChange}
                            required 
                        />
                    </div>

                    <div>
                        <label className="form-label text-muted small fw-medium">Preço (R$)</label>
                        <input 
                            type="number" 
                            className="form-control form-control-lg fs-6" 
                            name="preco" 
                            step="0.01"
                            value={dadosForm.preco} 
                            onChange={handleChange}
                            required 
                        />
                    </div>

                    <div>
                        <label className="form-label text-muted small fw-medium">Quantidade</label>
                        <input 
                            type="number" 
                            className="form-control form-control-lg fs-6" 
                            name="quantidade" 
                            value={dadosForm.quantidade} 
                            onChange={handleChange}
                            required 
                        />
                    </div>

                    <div>
                        <label className="form-label text-muted small fw-medium">Descrição</label>
                        <textarea 
                            className="form-control form-control-lg fs-6" 
                            name="descricao" 
                            rows={3}
                            value={dadosForm.descricao} 
                            onChange={handleChange}
                            required 
                        />
                    </div>



                    <div className="d-flex gap-2 mt-2">
                        <button 
                            type="button" 
                            className="btn btn-light btn-lg w-50 fw-medium"
                            onClick={() => navigate("/produtos")}
                        >
                            Cancelar
                        </button>
                        <button 
                            type="submit" 
                            className="btn btn-primary btn-lg w-50 fw-medium"
                            style={{ backgroundColor: '#4F46E5', borderColor: '#4F46E5' }}
                        >
                            Salvar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
