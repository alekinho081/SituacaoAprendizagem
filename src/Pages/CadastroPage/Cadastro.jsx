import Typography from "@mui/material/Typography"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import NewCard from "../../Components/Card/CardBox"
import NewInput from "../../Components/Input/Input"
import { Box, colors } from "@mui/material"


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
            const resp = await fetch('http://localhost:5000/v1/pacientes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(usuarios)
            });
            const data = await resp.json();
            console.log('Usuario criado com sucesso')
            redirecionar('/login')

        } catch (error) {
            console.error('Erro ao cadastrar usuario: ', error)
        }


    }


    return (
        <NewCard sx={{ 
            width: 300, 
            padding: 20,
            backgroundColor: '#1976d2' // Apenas esta linha muda a cor do card
        }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <Typography variant="h5" gutterBottom>Cadastro</Typography>
                <NewInput required label="Nome" aoMudar={(e) => setNome(e.target.value)} />
                <NewInput required label="Email" aoMudar={(e) => setEmail(e.target.value)} />
                <NewInput required label="CPF" aoMudar={(e) => setCPF(e.target.value)} />
                <NewInput required label="Idade" aoMudar={(e) => setIdade(e.target.value)} />
                <NewInput required label="Senha" aoMudar={(e) => setSenha(e.target.value)} />
                <button type="submit" style={{ marginTop: '10px' }}>Cadastrar</button>
            </form>
        </NewCard>
    );
}

export default Cadastro