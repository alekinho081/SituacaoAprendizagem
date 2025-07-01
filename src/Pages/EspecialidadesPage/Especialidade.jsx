import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import NewCard from "../../Components/Card/CardBox";
import { useState, useEffect } from "react";
import axios from "axios";

const EspPage = () => {
    const [especialidades, setEsp] = useState([]);

    const mostraEspecialidades = async () => {
        try {
            const resp = await axios.get("http://localhost:5000/v1/medicos");

                  const agrupado = {};

            resp.data.forEach((medico) => {
                const esp = medico.especialidade;

                if (esp in agrupado) {
                    agrupado[esp]++;
                } else {
                    agrupado[esp] = 1;
                }
            });

         
            const listaEspecialidades = Object.entries(agrupado).map(
                ([especialidade, qtd_medicos]) => ({
                    especialidade,
                    qtd_medicos,
                })
            );

            setEsp(listaEspecialidades);
        } catch (error) {
            console.error("Erro ao buscar especialidades: ", error);
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

                <div 
                    style={{ 
                        display: 'grid',
                        gridTemplateColumns: 'repeat(4, 1fr)',
                        gap: '24px',
                        justifyItems: 'center',
                        maxWidth: '1100px',
                        margin: '0 auto'
                    }}
                >
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
                                Medicos disponiveis para essa especialidade:
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
                            >
                                Marcar Consulta
                            </Button>
                        </NewCard>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default EspPage;
