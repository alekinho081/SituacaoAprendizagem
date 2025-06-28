import Button from "@mui/material/Button";
import Box from "@mui/material/Box";


const AdminPage = () => {
    return (
        <Box>
            <Button variant="outlined" href="/admin-medico" >Medicos</Button>
            <Button variant="outlined" href="/admin-paciente">Pacientes</Button>
            <Box>
                <Button variant="outlined" href="/admin-consulta">Consultas</Button>
            </Box>
        </Box>
    );
}


export default AdminPage