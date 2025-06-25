import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './Pages/HomePage/Home';
import Cadastro from './Pages/CadastroPage/Cadastro';
import Login from './Pages/LoginPage/Login';
import Consulta from './Pages/ConsultaPage/Consulta';
import Layout from './layout/Layout';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Layout />} >

            <Route index element={< Home />} />
            
            <Route path='/consulta' element={<Consulta />} />

          </Route>


          <Route path='/cadastro' element={<Cadastro />} />
          <Route path='/login' element={<Login />} />





        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
