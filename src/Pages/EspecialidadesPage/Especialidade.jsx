import {
    Typography,
    Button,
    TextField,
    MenuItem,
    Snackbar,
    Alert,
    Box
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ptBR } from 'date-fns/locale';
import Cookies from 'js-cookie';
import ConsultaForm from "../../Components/consultaForm/consultaForm";
import NewCard from "../../Components/Card/CardBox";
import { useState, useEffect } from "react";
import axios from "axios";
import TelaDialog from "../../Components/Dialog/TelaDialog";

const EspPage = () => {
    const [currentConsulta, setCurrentConsulta] = useState({
        motivo: '',
        medico_id: '',
        date: null,
        time: null,
        paciente_id: localStorage.getItem('id')
    });
    const [especialidades, setEsp] = useState([]);
    const [showDialog, setShowDialog] = useState(false);
    const [medicos, setMedicos] = useState([]);
    const [espMedicos, setEspMedicos] = useState([]);
    const [horariosOcupados, setHorariosOcupados] = useState([]);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    // Configuração do axios
    axios.defaults.withCredentials = true;
    axios.interceptors.request.use(config => {
        const token = Cookies.get('jwt');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    });

    const abreDialog = async (especialidade) => {
        try {
            const medics = medicos
                .filter(medico => medico.especialidade === especialidade)
                .map(medico => ({ nome: medico.nome, id: medico.id }));

            setEspMedicos(medics);
            setCurrentConsulta(prev => ({
                ...prev,
                especialidade: especialidade
            }));
            setShowDialog(true);
        } catch (error) {
            console.error("Erro ao abrir dialog:", error);
        }
    };

    const fechaDialog = () => {
        setShowDialog(false);
        setCurrentConsulta({
            motivo: '',
            medico_id: '',
            date: null,
            time: null,
            paciente_id: 1
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentConsulta(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleDateChange = (newDate) => {
        const day = newDate.getDay();
        if (day === 0 || day === 6) {
            setSnackbar({
                open: true,
                message: 'Consultas só podem ser agendadas de segunda a sexta',
                severity: 'error'
            });
            return;
        }

        setCurrentConsulta(prev => ({
            ...prev,
            date: newDate
        }));

        if (currentConsulta.medico_id) {
            fetchHorariosOcupados();
        }
    };

    const handleTimeChange = (newTime) => {
        const hours = newTime.getHours();
        if (hours < 8 || hours >= 18) {
            setSnackbar({
                open: true,
                message: 'Consultas só podem ser agendadas entre 8h e 18h',
                severity: 'error'
            });
            return;
        }

        setCurrentConsulta(prev => ({
            ...prev,
            time: newTime
        }));

        if (currentConsulta.medico_id && currentConsulta.date) {
            fetchHorariosOcupados();
        }
    };

    const fetchHorariosOcupados = async () => {
        try {
            const response = await axios.get(
                `http://localhost:5000/v1/consultas/medico/${currentConsulta.medico_id}`
            );
            setHorariosOcupados(response.data.map(c => new Date(c.data_hora).getTime()));
        } catch (error) {
            console.error("Erro ao buscar horários ocupados:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!currentConsulta.date || !currentConsulta.time) {
            setSnackbar({
                open: true,
                message: 'Por favor, selecione data e hora',
                severity: 'error'
            });
            return;
        }

        // Combina data e hora
        const dataHora = new Date(currentConsulta.date);
        const time = new Date(currentConsulta.time);
        dataHora.setHours(time.getHours());
        dataHora.setMinutes(time.getMinutes());

        try {
            // Verifica conflito de horário
            if (horariosOcupados.includes(dataHora.getTime())) {
                setSnackbar({
                    open: true,
                    message: 'Este horário já está ocupado',
                    severity: 'error'
                });
                return;
            }

            // Envia para o backend
            await axios.post('http://localhost:5000/v1/consultas', {
                motivo: currentConsulta.motivo,
                medico_id: currentConsulta.medico_id,
                data_hora: dataHora.toISOString(),
                paciente_id: currentConsulta.paciente_id
            });

            setSnackbar({
                open: true,
                message: 'Consulta agendada com sucesso!',
                severity: 'success'
            });

            fechaDialog();
        } catch (error) {
            setSnackbar({
                open: true,
                message: error.response?.data?.error || 'Erro ao agendar consulta',
                severity: 'error'
            });
        }
    };

    const mostraEspecialidades = async () => {
        try {
            const resp = await axios.get("http://localhost:5000/v1/medicos");
            setMedicos(resp.data);

            const agrupado = resp.data.reduce((acc, medico) => {
                acc[medico.especialidade] = (acc[medico.especialidade] || 0) + 1;
                return acc;
            }, {});

            const listaEspecialidades = Object.entries(agrupado).map(
                ([especialidade, qtd_medicos]) => ({
                    especialidade,
                    qtd_medicos,
                })
            );

            setEsp(listaEspecialidades);
        } catch (error) {
            console.error("Erro ao buscar especialidades: ", error);
            setSnackbar({
                open: true,
                message: 'Erro ao carregar especialidades',
                severity: 'error'
            });
        }
    };

    useEffect(() => {
        mostraEspecialidades();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4" style={{ fontFamily: 'system-ui, sans-serif' }}>
            <div className="bg-white rounded-2xl shadow-lg p-6 w-full" style={{ maxWidth: '1200px' }}>
                <Typography fontSize={25} className="mb-8 text-center" marginBottom={5}>
                    Especialidades
                </Typography>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '24px',
                    justifyItems: 'center',
                    maxWidth: '1100px',
                    margin: '0 auto'
                }}>
                    {especialidades.map((esp, index) => (
                        <NewCard
                            key={index}
                            sx={{
                                width: '250px',
                                height: '180px',
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                                alignItems: "center",
                                padding: 3,
                                borderRadius: "1rem",
                                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                                }
                            }}
                        >
                            <Typography
                                fontSize={20}
                                fontWeight="bold"
                                textAlign="center"
                                sx={{
                                    color: '#1976d2',
                                    marginBottom: 1
                                }}
                            >
                                {esp.especialidade}
                            </Typography>
                            <Typography fontSize={15} textAlign={"center"}>
                                Médicos disponíveis para essa especialidade:
                            </Typography>
                            <Typography
                                fontSize={16}
                                color="textSecondary"
                                textAlign="center"
                                sx={{ marginBottom: 2 }}
                            >
                                {esp.qtd_medicos} médico{esp.qtd_medicos !== 1 ? 's' : ''}
                            </Typography>

                            <Button
                                variant="contained"
                                sx={{
                                    marginLeft: 4,
                                    borderRadius: "0.5rem",
                                    textTransform: "none",
                                    backgroundColor: '#1976d2',
                                    '&:hover': {
                                        backgroundColor: '#1565c0',
                                    },
                                    padding: '8px 24px'
                                }}
                                onClick={() => abreDialog(esp.especialidade)}
                            >
                                Marcar Consulta
                            </Button>
                        </NewCard>
                    ))}
                </div>

                <TelaDialog abre={showDialog} onClose={fechaDialog} title="Marcar consulta">
                    <form onSubmit={handleSubmit}>
                        <TextField
                            label="Motivo"
                            name="motivo"
                            value={currentConsulta.motivo}
                            onChange={handleInputChange}
                            required
                            fullWidth
                            sx={{ mb: 2 }}
                        />

                        <TextField
                            select
                            label="Médico"
                            name="medico_id"
                            value={currentConsulta.medico_id}
                            onChange={(e) => {
                                handleInputChange(e);
                                if (currentConsulta.date) {
                                    fetchHorariosOcupados();
                                }
                            }}
                            required
                            fullWidth
                            sx={{ mb: 2 }}
                        >
                            {espMedicos.map((medico) => (
                                <MenuItem key={medico.id} value={medico.id}>
                                    {medico.nome}
                                </MenuItem>
                            ))}
                        </TextField>

                        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
                            <ConsultaForm 
                                date={currentConsulta.date}
                                time={currentConsulta.time}
                                onDateChange={handleDateChange}
                                onTimeChange={handleTimeChange}
                            />
                        </LocalizationProvider>

                        <Button 
                            variant="contained" 
                            type="submit"
                            fullWidth
                            sx={{ mt: 2 }}
                            disabled={!currentConsulta.motivo || !currentConsulta.medico_id || 
                                     !currentConsulta.date || !currentConsulta.time}
                        >
                            Agendar Consulta
                        </Button>
                    </form>
                </TelaDialog>
            </div>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
            >
                <Alert
                    onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default EspPage;