import Typography from "@mui/material/Typography"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import newCard from "../../Components/Card/CardBox,"
import newInput from "../../Components/Input/Input"

const Cadastro = () => {
    const [nome, setNome] = useState('')
    const [email, setEmail] = useState('')
    const [cpf, setCPF] = useState('')
    const [dataNascimento, setNascimento] = useState()
    const [senha, setSenha] = useState('')
    const redirecionar = useNavigate()


    return (
        <newCard>
            <form>
                <newInput />
                <newInput />
                <newInput />
                <newInput />
                <newInput />
            </form>
        </newCard>
    )
}

export default Cadastro