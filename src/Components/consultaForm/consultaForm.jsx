import { TextField, Box } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { ptBR } from 'date-fns/locale';

const ConsultaForm = ({ date, time, onDateChange, onTimeChange }) => {
    // Desabilita fins de semana
    const shouldDisableDate = (day) => {
        return day.getDay() === 0 || day.getDay() === 6;
    };

    // Configuração dos horários permitidos - SIMPLIFICADA
    const shouldDisableTime = (timeValue, clockType) => {
        // Não desabilita nada - o minutesStep já controla os intervalos
        return false;
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <DatePicker
                    label="Data"
                    value={date}
                    onChange={onDateChange}
                    shouldDisableDate={shouldDisableDate}
                    minDate={new Date()}
                    renderInput={(params) => (
                        <TextField {...params} fullWidth required sx={{ mb: 2 }} />
                    )}
                />

                <TimePicker
                    label="Hora"
                    value={time}
                    onChange={onTimeChange}
                    minTime={new Date(0, 0, 0, 8)}  // Começa às 8h
                    maxTime={new Date(0, 0, 0, 18)}  // Termina às 18h
                    minutesStep={15}  // Intervalos de 15 minutos
                    ampm={false}      // Formato 24h
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            fullWidth
                            required
                            sx={{ mb: 2 }}
                        />
                    )}
                />
            </Box>
        </LocalizationProvider>
    );
};

export default ConsultaForm;    