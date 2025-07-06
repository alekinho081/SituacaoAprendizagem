import NewCard from "../../Components/Card/CardBox";
import NewInput from "../../Components/Input/Input";
import axios from 'axios'
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";


const Login = () => {
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')
    const redirecionar = useNavigate()
    axios.defaults.withCredentials = true;
    const handleSubmit = async (e) => {
        e.preventDefault()

        const userLogin = {
            email,
            senha
        }

        try{
            const resp = await axios.post('http://localhost:5000/v1/login', userLogin)
            console.log(resp.data)
  
            localStorage.setItem('tipo',resp.data.tipo)
            localStorage.setItem('id',resp.data.id )
            redirecionar('/')
        }catch (error){
            console.error('Erro ao fazer login:', error.response?.data || error.message);  
        }
    }


    return (
        <Box 
          sx={{ 
            height: '100vh', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center' 
          }}
        >
          <NewCard sx={{ width: 350, padding: 2 }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <NewInput required label="Email" aoMudar={e => setEmail(e.target.value)} />
              <NewInput required label="Senha" aoMudar={e => setSenha(e.target.value)} />
              <NavLink to={'/cadastro'}>Não tenho uma conta</NavLink>
              <button type="submit" style={{ marginTop: '10px' }}>Logar</button>
            </form>
          </NewCard>
        </Box>
      );
}

export default Login