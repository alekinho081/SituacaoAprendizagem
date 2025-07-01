import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import NewCard from "../../../Components/Card/CardBox";
import { useState, useEffect } from "react";
import axios from "axios";

const AdminConsulta = () => {
    const [consultas, setConsultas] = useState([]);

    const fetchConsultas = async () => {
        try {
            const response = await axios.get("http://localhost:5000/v1/consultas");
            
            // Para cada consulta, buscar detalhes do médico e paciente
            const consultasComDetalhes = await Promise.all(
                response.data.map(async (consulta) => {
                    const [medico, paciente] = await Promise.all([
                        axios.get(`http://localhost:5000/v1/medicos/${consulta.medico_id}`),
                        axios.get(`http://localhost:5000/v1/pacientes/${consulta.paciente_id}`)
                    ]);
                    
                    return {
                        ...consulta,
                        medico_nome: medico.data.nome,
                        medico_especialidade: medico.data.especialidade,
                        paciente_nome: paciente.data.nome
                    };
                })
            );
            
            setConsultas(consultasComDetalhes);
        } catch (error) {
            console.error("Erro ao buscar consultas: ", error);
        }
    };

    useEffect(() => {
        fetchConsultas();
    }, []);

    const formatarData = (dataString) => {
        const data = new Date(dataString);
        return data.toLocaleString('pt-BR');
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4" style={{ fontFamily: 'system-ui, sans-serif' }}>
            <div className="bg-white rounded-2xl shadow-lg p-6 w-full" style={{ maxWidth: '1200px' }}>
                <Typography fontSize={25} className="mb-8 text-center" marginBottom={5}>
                    Minhas Consultas
                </Typography>

                <div 
                    style={{ 
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                        gap: '24px',
                        justifyItems: 'center',
                        maxWidth: '1100px',
                        margin: '0 auto'
                    }}
                >
                    {consultas.map((consulta, index) => (
                        <NewCard
                            key={index}
                            sx={{
                                width: '100%',
                                minHeight: '220px',
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                                alignItems: "flex-start",
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
                                fontSize={18} 
                                fontWeight="bold" 
                                sx={{ 
                                    color: '#1976d2',
                                    marginBottom: 1
                                }}
                            >
                                Consulta - {formatarData(consulta.data_hora)}
                            </Typography>
                            
                            <div style={{ width: '100%', marginBottom: '12px' }}>
                                <Typography fontSize={14} color="textSecondary">
                                    Médico:
                                </Typography>
                                <Typography fontSize={16}>
                                    {consulta.medico_nome} ({consulta.medico_especialidade})
                                </Typography>
                            </div>
                            
                            <div style={{ width: '100%', marginBottom: '12px' }}>
                                <Typography fontSize={14} color="textSecondary">
                                    Paciente:
                                </Typography>
                                <Typography fontSize={16}>
                                    {consulta.paciente_nome}
                                </Typography>
                            </div>
                            
                            <div style={{ width: '100%', marginBottom: '12px' }}>
                                <Typography fontSize={14} color="textSecondary">
                                    Status:
                                </Typography>
                                <Typography fontSize={16} color={
                                    consulta.status === 'agendada' ? 'primary' :
                                    consulta.status === 'realizada' ? 'success' :
                                    'error'
                                }>
                                    {consulta.status}
                                </Typography>
                            </div>
                            
                            <Button
                                variant="contained"
                                sx={{
                                    alignSelf: 'flex-end',
                                    borderRadius: "0.5rem", 
                                    textTransform: "none",
                                    backgroundColor: '#1976d2',
                                    '&:hover': {
                                        backgroundColor: '#1565c0',
                                    },
                                    padding: '6px 16px',
                                    marginTop: '8px'
                                }}
                            >
                                Detalhes
                            </Button>
                        </NewCard>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminConsulta;