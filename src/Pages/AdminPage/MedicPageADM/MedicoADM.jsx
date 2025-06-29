import Typography from "@mui/material/Typography"
import { useState, useEffect } from "react"
import Paper from "@mui/material/Paper"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemText from "@mui/material/ListItemText"
import Button from "@mui/material/Button" 
import axios from "axios"
import NewInput from "../../../Components/Input/Input"
import IconButton from "@mui/material/IconButton"
import EditButton from "../../../Components/Buttons/EditButton/EditButton"
import DeleteButton from "../../../Components/Buttons/DeleteButton/DelButton"

const AdminMedico = () => {
  const [medicos, setMedicos] = useState([])

  const [medicoNome, setNome] = useState('')
  const [medicoEsp, setEsp] = useState('')
  const [medicoEmail, setEmail] = useState('')
  const [medicoSenha, setSenha] = useState('')


  const [showForm, setShowForm] = useState(false)

  const mostraMedicos = async () => {
    try {
      const resp = await axios.get('http://localhost:5000/v1/medicos')
      setMedicos(resp.data)
    } catch (error) {
      console.error('Erro ao buscar medicos: ', error)
    }
  }

  const newMedicos = {
    nome: medicoNome,
    especialidade: medicoEsp,
    email: medicoEmail,
    senha: medicoSenha,
  }

  async function handleSubmit(e) {
    e.preventDefault()

    try {
      await axios.post('http://localhost:5000/v1/medicos', newMedicos)
      mostraMedicos()
      console.log('Medico adicionado com sucesso')  
      setNome('')
      setEsp('')
      setEmail('')
      setSenha('')

      setShowForm(false)
    } catch (error) {
      console.error('Erro ao adicionar medico: ', error)
    }
  }

    const deletarMedico = async (id) => {
        try{
          await axios.delete(`http://localhost:5000/v1/medicos/${id}`)
          mostraMedicos()
        }catch (error){
          console.error('Erro ao deletar medico: ', error)
        }
    }

  useEffect(() => {
    mostraMedicos()
  }, [])

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Página Admin: Médicos
      </Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={() => setShowForm(!showForm)}
        style={{ marginBottom: '1rem' }}
      >
        {showForm ? 'Cancelar' : 'Adicionar Médico'}
      </Button>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
          <NewInput
          label={'Nome'}
          valor={medicoNome}
          aoMudar={(e) => setNome(e.target.value)}
          required={true}  
          />
          <NewInput
          label={'Especialidade'}
          valor={medicoEsp}
          aoMudar={(e) => setEsp(e.target.value)}
          required={true}  
          />
          <NewInput
          label={'Email'}
          valor={medicoEmail}
          aoMudar={(e) => setEmail(e.target.value)}
          required={true}  
          />
          <NewInput
          label={'Senha'}
          valor={medicoSenha}
          tipo={'password'}
          aoMudar={(e) => setSenha(e.target.value)}
          required={true} 
          />

          <Button variant="contained" color="primary" type="submit">
            Salvar
          </Button>
        </form>
      )}

      <Paper elevation={3} style={{ padding: "1rem" }}>
        <List>
          {medicos.map((medico) => (
            <ListItem key={medico.id}>
              <ListItemText
                primary={`${medico.nome} (${medico.especialidade})`}
              />
              <DeleteButton onClick={() => deletarMedico(medico.id)}/>
              <EditButton/>
            </ListItem>
          ))}   
        </List>
      </Paper>
    </div>
  )
}

export default AdminMedico
