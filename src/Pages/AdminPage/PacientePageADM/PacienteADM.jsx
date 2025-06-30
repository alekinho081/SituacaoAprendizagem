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
import Cookies from 'js-cookie'

const AdminPaciente = () => {
  const [pacientes, setPacientes] = useState([])
  const [pacienteEditando, setPacienteEditando] = useState(null)

  const [pacienteNome, setNome] = useState('')
  const [pacienteEmail, setEmail] = useState('')
  const [pacienteSenha, setSenha] = useState('')

  const [showDialog, setShowDialog] = useState(false)
  const [showForm, setShowForm] = useState(false)

  const abreDialog = (paciente) => {
    setPacienteEditando(paciente);
    setShowDialog(true)
  }

  const fechaDialog = () => {
    setShowDialog(false)
  }

  axios.defaults.withCredentials = true

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
      await axios.post('http://localhost:5000/v1/pacientes', newPaciente)
      mostraPacientes()
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
      let jwt = Cookies.get('jwt')
      await axios.delete(`http://localhost:5000/v1/pacientes/${id}`, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwt}`
        }
      });
      mostraPacientes();
    } catch (error) {
      console.error('Erro ao deletar paciente:', error.response?.data || error.message);
    }
  }

  useEffect(() => {
    mostraPacientes()
  }, [])

  const handleAtualizaSubmit = async (e) => {
    try {
      let jwt = Cookies.get('jwt')
      const pacienteAtualizado = {
        nome: pacienteNome,
        email: pacienteEmail,
        senha: pacienteSenha || undefined
      };
      await axios.put(`http://localhost:5000/v1/pacientes/${pacienteEditando.id}`, pacienteAtualizado, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwt}`
        }
       
      })
      mostraPacientes()
    }catch (error){
      console.error('Erro ao atualizar paciente:', error.response?.data || error.message);
    }
  }

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
                secondary={`Email: ${paciente.email}`}
              />
              <DeleteButton onClick={() => deletarPaciente(paciente.id)} />
              <EditButton
                onClick={() => {abreDialog(paciente)}}
              />
              <TelaDialog abre={showDialog} onClose={fechaDialog} title="Editar Paciente" disableEnforceFocus>
                <form onSubmit={handleAtualizaSubmit}>
                  <NewInput
                    label={'Nome'}
                    value={pacienteNome}
                    aoMudar={(e) => setNome(e.target.value)}
                    required={true}
                  /><br />
                  <NewInput
                    label={'Email'}
                    value={pacienteEmail}
                    aoMudar={(e) => setEmail(e.target.value)}
                    required={true}
                  /><br />
                  <NewInput
                    label={'Senha'}
                    value={pacienteSenha}
                    type={'password'}
                    aoMudar={(e) => setSenha(e.target.value)}
                    required={true}
                  /><br />

                  <Button variant="contained" color="primary" type="submit">
                    Atualizar
                  </Button>
                </form>
              </TelaDialog>
            </ListItem>
          ))}
        </List>
      </Paper>
    </div>
  )
}

export default AdminPaciente