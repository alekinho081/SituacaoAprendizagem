import Typography from "@mui/material/Typography";
import NewCard from "../../Components/Card/CardBox";
import NewInput from "../../Components/Input/Input";
import { useState } from "react";

const Login = () => {
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')

    const handleSubmit = async (e) =>{
        e.preventDefault()
    
        

    }


    return (
        <NewCard css={{width: 100, height: 100}}>
            <form onSubmit={handleSubmit}>
                <NewInput required={true} label={'Email'} aoMudar={e => setEmail(e.target.value)}/>
                <NewInput required={true} label={'Senha'} aoMudar={e => setSenha(e.target.value)}/>
                <button>Logar</button>
            </form>
        </NewCard>
    )
}

export default Login