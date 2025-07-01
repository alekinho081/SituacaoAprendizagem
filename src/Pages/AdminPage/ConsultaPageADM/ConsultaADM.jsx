import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import {
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import NewCard from "../../../Components/Card/CardBox";

const ConsultasPage = () => {
  const [consultas, setConsultas] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentConsulta, setCurrentConsulta] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [loading, setLoading] = useState(false);
  const [refetchInterval, setRefetchInterval] = useState(null);

  const statusOptions = [
    { value: 'agendada', label: 'Agendada' },
    { value: 'realizada', label: 'Realizada' },
    { value: 'cancelada', label: 'Cancelada' }
  ];

  // Configuração do Axios para incluir o token automaticamente
  const api = axios.create({
    baseURL: 'http://localhost:5000/v1',
    withCredentials: true
  });

  api.interceptors.request.use(config => {
    const token = Cookies.get('jwt');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  api.interceptors.response.use(
    response => response,
    error => {
      if (error.response?.status === 401) {
        setSnackbar({
          open: true,
          message: 'Sessão expirada. Por favor, faça login novamente.',
          severity: 'error'
        });
        // Redirecionar para login se necessário
      }
      return Promise.reject(error);
    }
  );

  const fetchConsultas = async () => {
    try {
      setLoading(true);
      const response = await api.get('/consultas');
      setConsultas(response.data.consultas);
    } catch (error) {
      console.error('Erro ao buscar consultas:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.error || 'Erro ao carregar consultas',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Busca inicial
    fetchConsultas();

    // Configura atualização automática a cada 30 segundos
    const interval = setInterval(fetchConsultas, 30000);
    setRefetchInterval(interval);

    // Limpa o intervalo quando o componente é desmontado
    return () => clearInterval(interval);
  }, []);

  const handleOpenDialog = (consulta) => {
    setCurrentConsulta(consulta);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentConsulta(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentConsulta(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveConsulta = async () => {
    try {
      setLoading(true);
      await api.patch(`/consultas/${currentConsulta.id}`, currentConsulta);
      
      setSnackbar({
        open: true,
        message: 'Consulta atualizada com sucesso!',
        severity: 'success'
      });
      
      // Atualiza imediatamente após salvar
      fetchConsultas();
      handleCloseDialog();
    } catch (error) {
      console.error('Erro ao atualizar consulta:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.error || 'Erro ao atualizar consulta',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Data não informada';
    const options = { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit', 
      hour: '2-digit', 
      minute: '2-digit' 
    };
    return new Date(dateString).toLocaleString('pt-BR', options);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'agendada': return '#1976d2';
      case 'realizada': return '#4caf50';
      case 'cancelada': return '#f44336';
      default: return '#9e9e9e';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4" style={{ fontFamily: 'system-ui, sans-serif' }}>
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full" style={{ maxWidth: '1200px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <Typography fontSize={25} fontWeight="bold">
            Consultas Agendadas
          </Typography>
          <Button 
            variant="contained" 
            onClick={fetchConsultas}
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} />}
          >
            Atualizar
          </Button>
        </div>

        {loading && !consultas.length ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
            <CircularProgress />
          </div>
        ) : consultas.length === 0 ? (
          <Typography textAlign="center" color="textSecondary" style={{ margin: '40px 0' }}>
            Nenhuma consulta agendada
          </Typography>
        ) : (
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
                <div style={{ width: '100%' }}>
                  <Typography 
                    fontSize={20} 
                    fontWeight="bold" 
                    textAlign="center"
                    sx={{ 
                      color: getStatusColor(consulta.status),
                      marginBottom: 1
                    }}
                  >
                    {consulta.Medico?.nome || 'Médico não informado'} - {consulta.Medico?.especialidade || 'Sem especialidade'}
                  </Typography>
                  <Typography fontSize={16} textAlign="center">
                    Paciente: {consulta.Paciente?.nome || 'Não informado'}
                  </Typography>
                  <Typography fontSize={14} color="textSecondary" textAlign="center">
                    CPF: {consulta.Paciente?.cpf || 'Não informado'}
                  </Typography>
                  <Typography fontSize={16} textAlign="center" sx={{ mt: 1 }}>
                    {formatDate(consulta.data_hora)}
                  </Typography>
                  <Typography 
                    fontSize={16} 
                    textAlign="center"
                    sx={{ 
                      color: getStatusColor(consulta.status),
                      fontWeight: 'bold',
                      mt: 1
                    }}
                  >
                    {statusOptions.find(s => s.value === consulta.status)?.label || 'Sem status'}
                  </Typography>
                </div>
                
                <Button
                  variant="contained"
                  sx={{
                    borderRadius: "0.5rem", 
                    textTransform: "none",
                    backgroundColor: '#1976d2',
                    '&:hover': {
                      backgroundColor: '#1565c0',
                    },
                    padding: '8px 24px',
                    mt: 2
                  }}
                  onClick={() => handleOpenDialog(consulta)}
                >
                  Editar Consulta
                </Button>
              </NewCard>
            ))}
          </div>
        )}

        {/* Dialog de Edição */}
        <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="md">
          <DialogTitle>Editar Consulta</DialogTitle>
          <DialogContent>
            {currentConsulta && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '10px' }}>
                <TextField
                  label="Médico"
                  value={currentConsulta.Medico?.nome || 'Não informado'}
                  variant="outlined"
                  fullWidth
                  disabled
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="Especialidade"
                  value={currentConsulta.Medico?.especialidade || 'Não informado'}
                  variant="outlined"
                  fullWidth
                  disabled
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="Paciente"
                  value={currentConsulta.Paciente?.nome || 'Não informado'}
                  variant="outlined"
                  fullWidth
                  disabled
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="CPF"
                  value={currentConsulta.Paciente?.cpf || 'Não informado'}
                  variant="outlined"
                  fullWidth
                  disabled
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="Data e Hora"
                  type="datetime-local"
                  name="data_hora"
                  value={currentConsulta.data_hora ? new Date(currentConsulta.data_hora).toISOString().slice(0, 16) : ''}
                  onChange={handleInputChange}
                  variant="outlined"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  sx={{ mb: 2 }}
                />
                <TextField
                  select
                  label="Status"
                  name="status"
                  value={currentConsulta.status || ''}
                  onChange={handleInputChange}
                  variant="outlined"
                  fullWidth
                  sx={{ mb: 2 }}
                >
                  {statusOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  label="Motivo"
                  name="motivo"
                  value={currentConsulta.motivo || ''}
                  onChange={handleInputChange}
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={2}
                  sx={{ mb: 2, gridColumn: '1 / -1' }}
                />
                <TextField
                  label="Diagnóstico"
                  name="diagnostico"
                  value={currentConsulta.diagnostico || ''}
                  onChange={handleInputChange}
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={3}
                  sx={{ mb: 2, gridColumn: '1 / -1' }}
                />
                <TextField
                  label="Prescrição"
                  name="prescricao"
                  value={currentConsulta.prescricao || ''}
                  onChange={handleInputChange}
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={3}
                  sx={{ mb: 2, gridColumn: '1 / -1' }}
                />
                <TextField
                  label="Observações"
                  name="observacoes"
                  value={currentConsulta.observacoes || ''}
                  onChange={handleInputChange}
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={2}
                  sx={{ mb: 2, gridColumn: '1 / -1' }}
                />
                <TextField
                  label="Valor (R$)"
                  name="valor"
                  type="number"
                  value={currentConsulta.valor || ''}
                  onChange={handleInputChange}
                  variant="outlined"
                  fullWidth
                  InputProps={{
                    startAdornment: 'R$'
                  }}
                  sx={{ mb: 2 }}
                />
              </div>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} disabled={loading}>
              Cancelar
            </Button>
            <Button 
              onClick={handleSaveConsulta} 
              color="primary" 
              variant="contained"
              disabled={loading}
              startIcon={loading && <CircularProgress size={20} />}
            >
              Salvar
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar para feedback */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
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
    </div>
  );
};

export default ConsultasPage;