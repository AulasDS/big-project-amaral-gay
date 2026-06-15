import './App.css'
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home'
import ListaProdutos from './pages/ListaProdutos'
import NavBar from './components/navBar';
import InserirProduto from './pages/InserirProduto';
import EditarProduto from './pages/EditarProduto';
import ListaCliente from './pages/ListaCliente';
import InserirCliente from './pages/InserirCliente';
import CompraProduto from './pages/CompraProduto';
import ListaCompras from './pages/ListaCompras'; // 👈 1. Importe a nova página aqui

function App() {

  return (
    <>
      <NavBar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/produtos' element={<ListaProdutos />} />
        <Route path='/inserir-produto' element={<InserirProduto />} />
        <Route path='/editar-produto/:id' element={<EditarProduto />} />
        <Route path='/clientes' element={<ListaCliente />} />
        <Route path='/inserir-cliente' element={<InserirCliente />} />
        
        {/* 👈 2. Ajuste as rotas de compras para ficarem organizadas: */}
        <Route path='/compras' element={<ListaCompras />} />
        <Route path='/comprar-produto' element={<CompraProduto />} />
      </Routes>
    </>
  )
}

export default App