import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './Pages/HomePage/Home';
import Cadastro from './Pages/CadastroPage/Cadastro';
import Login from './Pages/LoginPage/Login';
import Consulta from './Pages/ConsultaPage/Consulta';
import Layout from './layout/Layout';
import AdminMedico from './Pages/AdminPage/MedicPageADM/MedicoADM';
import AdminConsulta from './Pages/AdminPage/ConsultaPageADM/ConsultaADM'
import AdminPaciente from './Pages/AdminPage/PacientePageADM/PacienteADM'
import EspPage from './Pages/EspecialidadesPage/Especialidade';
import Perfil from './Pages/Perfil/Perfil';
import PrivateRoute from './Components/PrivateRoute'

function App() {
  return (
    <div>

      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Layout />} >
            <Route index element={<Home />} />
            <Route path='/consulta' element={<Consulta />} />
            <Route path='/especialidades' element={<EspPage />} />

            <Route path='/admin-medico' element={
              < PrivateRoute tipoUsuarioRequerido="admin" >
                <AdminMedico />
              </PrivateRoute >} />
            <Route path='/admin-paciente' element={
              < PrivateRoute tipoUsuarioRequerido="admin" >
                <AdminPaciente />
              </PrivateRoute >} />
            <Route path='/admin-consulta' element={
              < PrivateRoute tipoUsuarioRequerido="admin" >
                <AdminConsulta />
              </PrivateRoute >} />
            <Route path='/perfil' element={<Perfil />} />

          </Route>

          <Route path='/cadastro' element={<Cadastro />} />
          <Route path='/login' element={<Login />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App
