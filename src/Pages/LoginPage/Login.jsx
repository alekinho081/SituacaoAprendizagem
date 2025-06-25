import NewCard from "../../Components/Card/CardBox";
import NewInput from "../../Components/Input/Input";
import axios from 'axios'
import { useState } from "react";

const Login = () => {
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()

        const userLogin = {
            email,
            senha
        }

        try{
            const resp = await axios.post('http://localhost:5000/login', {
                params: userLogin
            })
            console.log(resp.data)
        }catch (error){
            console.error('Erro ao fazer login:', error.response?.data || error.message);  
        }
    }


    return (
        <NewCard sx={{ width: 400, height: 200 }}>
            <form onSubmit={handleSubmit}>
                <NewInput required={true} label={'Email'} aoMudar={e => setEmail(e.target.value)} />
                <NewInput required={true} label={'Senha'} aoMudar={e => setSenha(e.target.value)} />
                <button type="submit" style={{ marginTop: '10px' }}>Logar</button>
            </form>
        </NewCard>
    )
}

export default Login