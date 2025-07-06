import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import {
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
axios.defaults.withCredentials = true
axios.interceptors.request.use(config => {
        const token = Cookies.get('jwt');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    });

const MinhasConsultas = () => {
  const [consultas, setConsultas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info'
  });

  // Recupera dados do usuário do localStorage
  const userId = localStorage.getItem('id');
  const userType = localStorage.getItem('tipo');

  const fetchConsultas = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/v1/consultas/${userType}/${userId}`);
      setConsultas(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao carregar consultas');
      setSnackbar({
        open: true,
        message: 'Erro ao carregar consultas',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId && userType) {
      fetchConsultas();
    } else {
      setError('Usuário não identificado');
      setSnackbar({
        open: true,
        message: 'Faça login para acessar suas consultas',
        severity: 'warning'
      });
    }
  }, [userId, userType]);

  const handleCancelarConsulta = async (consultaId) => {
    try {
      await axios.patch(`http://localhost:5000/v1/consultas/${consultaId}`, {
        status: 'cancelada'
      });
      fetchConsultas();
      setSnackbar({
        open: true,
        message: 'Consulta cancelada com sucesso',
        severity: 'success'
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Erro ao cancelar consulta',
        severity: 'error'
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'agendada': return 'primary';
      case 'realizada': return 'success';
      case 'cancelada': return 'error';
      default: return 'default';
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <div style={{ padding: '24px' }}>
      <Typography variant="h4" gutterBottom>
        {userType === 'paciente' ? 'Minhas Consultas' : 'Minha Agenda'}
      </Typography>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '40px' }}>
          <CircularProgress />
        </div>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : consultas.length === 0 ? (
        <Typography variant="body1" style={{ marginTop: '20px' }}>
          Nenhuma consulta agendada
        </Typography>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {consultas.map(consulta => (
            <Card key={consulta.id} variant="outlined">
              <CardContent>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" component="div">
                    {userType === 'paciente' ? consulta.Medico.nome : consulta.Paciente.nome}
                  </Typography>
                  <Chip 
                    label={consulta.status} 
                    color={getStatusColor(consulta.status)} 
                    size="small"
                  />
                </div>

                <Typography color="text.secondary" sx={{ mt: 1 }}>
                  {format(new Date(consulta.data_hora), 'PPPPp', { locale: ptBR })}
                </Typography>

                {consulta.Medico?.especialidade && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Especialidade: {consulta.Medico.especialidade}
                  </Typography>
                )}

                {consulta.motivo && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Motivo: {consulta.motivo}
                  </Typography>
                )}

                <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
                  {consulta.status === 'agendada' && (
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => handleCancelarConsulta(consulta.id)}
                    >
                      Cancelar
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default MinhasConsultas;