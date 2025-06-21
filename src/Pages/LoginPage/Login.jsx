import Typography from "@mui/material/Typography";
import { useState } from "react";

const Login = () => {
    const [email, setEmail] = useState('')
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

export default Login