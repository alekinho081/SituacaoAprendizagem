import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './Pages/HomePage/Home';
import Cadastro from './Pages/CadastroPage/Cadastro';
import Login from './Pages/LoginPage/Login';
import Consulta from './Pages/ConsultaPage/Consulta';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
            <Route path='/' element={<Home/>} />
            <Route path='/cadastro' element={<Cadastro/>} />
            <Route path='/login' element={<Login/>} />
            <Route path='/consulta' element={<Consulta/>} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}
 
export default App
