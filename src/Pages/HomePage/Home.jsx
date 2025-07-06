import Typography from "@mui/material/Typography";
import NewCard from "../../Components/Card/CardBox";
import bannerImage from '../../ImagemBanner/ClinicaMedicaSESI.png'
import { Button, Card, CardMedia, Link } from '@mui/material';
import Box from "@mui/material/Box";

const Home = () => {
    return (
        <div>
            <section className="w-full flex justify-center my-4">
                <Card
                    sx={{
                        maxWidth: '100%',
                        width: '1500px',
                        borderRadius: 2,
                        overflow: 'hidden',
                        boxShadow: 3
                    }}
                >
                    <CardMedia
                        component="img"
                        image={bannerImage}
                        alt="Clínica Médica SESI - Cuidamos da sua saúde com excelência"
                        sx={{
                            width: '100%',
                            height: '400px', // Altura fixa
                            objectFit: 'cover' // Cobre todo o espaço do card
                        }}
                    />
                </Card>
            </section>
            <section
                style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', marginTop: 40 }}
            >
                <Typography fontSize={30} marginBottom={3} sx={{ textAlign: "center" }}>Sobre a Clinica SESI</Typography>
                <NewCard sx={{ width: 1000 }}>
                    <Typography fontSize={20} sx={{ textAlign: "justify" }}>
                        Com mais de 20 anos de experiência, a Clínica SESI é referência em atendimento médico
                        de qualidade. Agora também com consultas 100% online, oferecemos praticidade e conforto
                        para você cuidar da saúde sem sair de casa. Nossa equipe é formada por profissionais
                        altamente qualificados, comprometidos em oferecer um atendimento humanizado, seguro e
                        eficiente, em diversas especialidades. Tudo isso com a agilidade e a confiança que só
                        quem tem duas décadas de história pode garantir.
                    </Typography>
                </NewCard>
            </section>
            <section>
                <Box
                    sx={{
                        display: 'flex',
                        gap: 3,
                        justifyContent: 'center',
                        flexWrap: 'wrap',
                        my: 4
                    }}
                >
                    <NewCard sx={{ flex: 1, maxWidth: 490 }}>
                        <Typography
                            variant="h5"
                            component="h2"
                            gutterBottom
                            sx={{
                                fontWeight: 'bold',
                                textAlign: 'center',
                                mb: 3
                            }}
                        >
                            Como Funciona?
                        </Typography>

                        <Box component="ul" sx={{
                            pl: 2,
                            '& li': {
                                mb: 2,
                                fontSize: 20,
                                listStyleType: 'none',
                                display: 'flex',
                                alignItems: 'center'
                            }
                        }}>
                            <Box component="li">• Encontre um profissional</Box>
                            <Box component="li">• Escolha o melhor horário</Box>
                            <Box component="li">• Agende em segundos</Box>
                            <Box component="li">• Receba confirmação no seu email</Box>
                        </Box>
                    </NewCard>
                    <NewCard sx={{ flex: 1, maxWidth: 490 }}>
                        <Typography
                            variant="h5"
                            component="h2"
                            gutterBottom
                            sx={{
                                fontWeight: 'bold',
                                textAlign: 'center',
                                mb: 3
                            }}
                        >
                            Vantagens
                        </Typography>

                        <Box component="ul" sx={{
                            pl: 2,
                            '& li': {
                                mb: 2,
                                fontSize: 20,
                                listStyleType: 'none',
                                display: 'flex',
                                alignItems: 'center',
                            }
                        }}>
                            <Box component="li">• Agendamento 100% Online</Box>
                            <Box component="li">• Agende de qualquer lugar</Box>
                            <Box component="li">• Médicos profissionais</Box>
                        </Box>
                    </NewCard>
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        my: 2
                    }}
                >
                    <Button href="/especialidades" variant="contained">Agende sua Consulta</Button>
                </Box>
            </section>
        </div>
    );
};

export default Home