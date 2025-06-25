import NewCard from "../../Components/Card/CardBox";
import NewInput from "../../Components/Input/Input";
import { useState } from "react";

const Login = () => {
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')

    const redirecionar = useNavigate()

    const handleSubmit = async (e) =>{
        e.preventDefault()
        
        const userLogin = {
            email,
            senha
        }
        
        

    }


    return (
        <NewCard sx={{width: 400, height: 200}}>
            <form onSubmit={handleSubmit}>
                <NewInput required={true} label={'Email'} aoMudar={e => setEmail(e.target.value)}/>
                <NewInput required={true} label={'Senha'} aoMudar={e => setSenha(e.target.value)}/>
                <button type="submit" style={{ marginTop: '10px' }}>Logar</button>
            </form>
        </NewCard>
    )
}

export default Login