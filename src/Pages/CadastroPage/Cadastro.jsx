import Typography from "@mui/material/Typography"
import { useNavigate, NavLink } from "react-router-dom"
import { useState } from "react"
import NewCard from "../../Components/Card/CardBox"
import NewInput from "../../Components/Input/Input"
import axios from 'axios'
import Box from "@mui/material/Box"

const Cadastro = () => {
    const [nome, setNome] = useState('')
    const [email, setEmail] = useState('')
    const [cpf, setCPF] = useState('')
    const [idade, setIdade] = useState()
    const [senha, setSenha] = useState('')

    const redirecionar = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()

        const usuarios = {
            nome,
            email,
            cpf,
            idade,
            senha
        }

        try {
            const resp = await axios.post('http://localhost:5000/v1/pacientes', usuarios);
            console.log('Usuário criado com sucesso:', resp.data);
            redirecionar('/login');
        } catch (error) {
            console.error('Erro ao cadastrar usuário:', error.response?.data || error.message);
        }
    }

    return (
        <Box sx={{
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <NewCard sx={{
                width: 350,
                padding: 2,
            }}>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <Typography variant="h5" gutterBottom>Cadastro</Typography>
                    <NewInput required label="Nome" aoMudar={(e) => setNome(e.target.value)} />
                    <NewInput required label="Email" aoMudar={(e) => setEmail(e.target.value)} />
                    <NewInput required label="CPF" aoMudar={(e) => setCPF(e.target.value)} />
                    <NewInput required label="Idade" aoMudar={(e) => setIdade(e.target.value)} />
                    <NewInput required label="Senha" aoMudar={(e) => setSenha(e.target.value)} />
                    <NavLink to={'/login'}>Ja tenho uma conta</NavLink>
                    <button type="submit" style={{ marginTop: '10px' }}>Cadastrar</button>
                </form>
            </NewCard>
        </Box>
    );
}

export default Cadastro