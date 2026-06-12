import style from './style.module.scss'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function InserirProduto() {

    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const nome = formData.get('nome') as string;
        const preco = Number(formData.get('preco')) as number;
        const quantidade = Number(formData.get('quantidade')) as number;
        const descricao = formData.get('descricao') as string;

        axios.post('http://localhost:3000/produto', { nome, preco, descricao, quantidade })
            .then(() => {
                navigate('/produtos');
            })
    }

    return (
        <div className="d-flex justify-content-center mt-5 align-items-center">
            <div className="card shadow-sm p-4 w-100" style={{ maxWidth: '450px', borderRadius: '12px' }}>
                <h2 className="text-center mb-4 text-secondary fw-semibold">Inserir Produto</h2>

                <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
                    <div>
                        <label className="form-label text-muted small fw-medium">Nome do Produto</label>
                        <input
                            type="text"
                            className="form-control form-control-lg fs-6"
                            placeholder="Ex: Teclado Mecânico"
                            name="nome"
                            required
                        />
                    </div>

                    <div>
                        <label className="form-label text-muted small fw-medium">Preço (R$)</label>
                        <input
                            type="number"
                            className="form-control form-control-lg fs-6"
                            placeholder="0.00"
                            name="preco"
                            step="0.01"
                            required
                        />
                    </div>

                    <div>
                        <label className="form-label text-muted small fw-medium">Quantidade</label>
                        <input
                            type="number"
                            className="form-control form-control-lg fs-6"
                            placeholder="Ex: 10"
                            name="quantidade"
                            required
                        />
                    </div>

                    <div>
                        <label className="form-label text-muted small fw-medium">Descrição</label>
                        <textarea
                            className="form-control form-control-lg fs-6"
                            placeholder="Dê detalhes sobre o produto..."
                            name="descricao"
                            rows={3}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary btn-lg w-100 mt-2 fw-medium"
                        style={{ borderRadius: '8px', backgroundColor: '#4F46E5', borderColor: '#4F46E5' }}
                    >
                        Salvar Produto
                    </button>
                </form>
            </div>
        </div>
    )
}