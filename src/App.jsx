import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './Pages/HomePage/Home';
import Cadastro from './Pages/CadastroPage/Cadastro';
import Login from './Pages/LoginPage/Login';
import Consulta from './Pages/ConsultaPage/Consulta';
import Layout from './layout/Layout';
import AdminPage from './Pages/AdminPage/Admin';
import AdminMedico from './Pages/AdminPage/MedicoADM';
import AdminPaciente from './Pages/AdminPage/PacienteADM';
import AdminConsulta from './Pages/AdminPage/ConsultaADM';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Layout />} >

            <Route index element={< Home />} />
            
            <Route path='/consulta' element={<Consulta />} />

            <Route path='/admin-medico' element={<AdminMedico/>}/>

            <Route path='/admin-paciente' element={<AdminPaciente/>}/>

            <Route path='/admin-consulta' element={<AdminConsulta/>}/>

            <Route path='/admin' element={<AdminPage/>}/>

          </Route>


          <Route path='/cadastro' element={<Cadastro />} />
          <Route path='/login' element={<Login />} />





        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
