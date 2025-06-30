import Typography from "@mui/material/Typography"
import { useState, useEffect } from "react"
import Paper from "@mui/material/Paper"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemText from "@mui/material/ListItemText"
import Button from "@mui/material/Button" 
import axios from "axios"
import NewInput from "../../../Components/Input/Input"
import EditButton from "../../../Components/Buttons/EditButton/EditButton"
import DeleteButton from "../../../Components/Buttons/DeleteButton/DelButton"
import TelaDialog from "../../../Components/Dialog/TelaDialog"

const AdminMedico = () => {
  const [pacientes, setPacientes] = useState([])

  const [pacienteNome, setNome] = useState('')
  const [pacienteEmail, setEmail] = useState('')
  const [pacienteSenha, setSenha] = useState('')

  const [showDialog, setShowDialog] = useState(false)
  const [showForm, setShowForm] = useState(false)

  const abreDialog = () => {
    setShowDialog(true)
  }

  const fechaDialog = () => {
    setShowDialog(false)
  }

  const mostraPacientes = async () => {
    try {
      const resp = await axios.get('http://localhost:5000/v1/pacientes')
      setPacientes(resp.data)
    } catch (error) {
      console.error('Erro ao buscar pacientes: ', error)
    }
  }



  const newPaciente = {
    nome: pacienteNome,
    email: pacienteEmail,
    senha: pacienteSenha,
  }

  async function handleSubmit(e) {
    e.preventDefault()

    try {
      await axios.post('http://localhost:5000/v1/paciente', newPacientes)
      mostraMedicos()
      console.log('Paciente adicionado com sucesso')  
      setNome('')
      setEmail('')
      setSenha('')

      setShowForm(false)
    } catch (error) {
      console.error('Erro ao adicionar paciente: ', error)
    }
  }

    const deletarPaciente = async (id) => {
  try {
    await axios.delete(`http://localhost:5000/v1/pacientes/${id}`, {
      withCredentials: true
    });
    mostraPacientes();
  } catch (error) {
    console.error('Erro ao deletar paciente:', error.response?.data || error.message);
  }
}

  useEffect(() => {
    mostraPacientes()
  }, [])

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Página Admin: Pacientes
      </Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={() => setShowForm(!showForm)}
        style={{ marginBottom: '1rem' }}
      >
        {showForm ? 'Cancelar' : 'Adicionar Paciente'}
      </Button>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
          <NewInput
          label={'Nome'}
          valor={pacienteNome}
          aoMudar={(e) => setNome(e.target.value)}
          required={true}  
          />
          <NewInput
          label={'Email'}
          valor={pacienteEmail}
          aoMudar={(e) => setEmail(e.target.value)}
          required={true}  
          />
          <NewInput
          label={'Senha'}
          valor={pacienteSenha}
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
          {pacientes.map((paciente) => (
            <ListItem key={paciente.id}>
              <ListItemText
                primary={`${paciente.nome}`}
              />
              <DeleteButton onClick={() => deletarPaciente(paciente.id)}/>
              <EditButton 
                onClick={abreDialog}
              />
              <TelaDialog abre={showDialog} onClose={fechaDialog}>
                <form>
                  <NewInput/>
                  <NewInput/>
                  <NewInput/>
                  <NewInput/>
                </form>
              </TelaDialog>

            </ListItem>
          ))}   
        </List>
      </Paper>
    </div>
  )
}

export default AdminMedico
