import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import CircularProgress from '@mui/material/CircularProgress';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../authContext/AuthContext';
import axios from 'axios';
import ExplicitIcon from '@mui/icons-material/Explicit';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Badge from '@mui/material/Badge';
import Popover from '@mui/material/Popover';
import Divider from '@mui/material/Divider';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function NewHeader() {
  const { user, setUser } = useContext(AuthContext);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const tipo = localStorage.getItem('tipo');
  
  // Estado para as notificações
  const [notifications, setNotifications] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [loadingNotifications, setLoadingNotifications] = useState(false);

  const toggleDrawer = (abriu) => (e) => {
    if (e.type === 'keydown' && (e.key === 'Tab' || e.key === 'Shift')) {
      return;
    }
    setDrawerOpen(abriu);
  };

  const handleLogout = async () => {
    try {
      await axios.get('http://localhost:5000/v1/logout', {
        withCredentials: true,
      });
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Funções para o popover de notificações
  const handleNotificationClick = (event) => {
    setAnchorEl(event.currentTarget);
    fetchConsultasAgendadas();
  };

  const handleCloseNotifications = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'notifications-popover' : undefined;

  // Busca consultas agendadas para notificações
  const fetchConsultasAgendadas = async () => {
    try {
      setLoadingNotifications(true);
      const userId = localStorage.getItem('id');
      const response = await axios.get(`http://localhost:5000/v1/consultas/${tipo}/${userId}`);
      
      // Filtra apenas consultas futuras
      const consultasFuturas = response.data.filter(consulta => 
        new Date(consulta.data_hora) > new Date()
      );
      
      setNotifications(consultasFuturas);
    } catch (error) {
      console.error('Erro ao buscar consultas:', error);
    } finally {
      setLoadingNotifications(false);
    }
  };

  let drawerItems = [];

  if(tipo === 'admin'){
    drawerItems = [
      { text: 'Início', icon: <HomeIcon />, path: '/' },
      { text: 'Pacientes', icon: <AccountCircleIcon />, path: '/admin-paciente' },
      { text: 'Médicos', icon: <AccountCircleIcon />, path: '/admin-medico' },
      { text: 'Especialidades', icon: <ExplicitIcon />, path: '/especialidades' },
      { text: 'Consultas', icon: <ContactMailIcon />, path: '/admin-consulta' }
    ];
  } else if(tipo === 'medico'){
    drawerItems = [
      { text: 'Início', icon: <HomeIcon />, path: '/' },
      { text: 'Especialidades', icon: <ExplicitIcon />, path: '/especialidades' },
      { text: 'Contato', icon: <ContactMailIcon />, path: '/contact' },
    ];
  } else {
    drawerItems = [
      { text: 'Início', icon: <HomeIcon />, path: '/' },
      { text: 'Especialidades', icon: <ExplicitIcon />, path: '/especialidades' },
    ];
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Clinica SESI
          </Typography>

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {/* Botão de Notificações */}
              <IconButton 
                color="inherit" 
                aria-describedby={id}
                onClick={handleNotificationClick}
              >
                <Badge 
                  badgeContent={notifications.length} 
                  color="error"
                  max={9}
                >
                  <NotificationsIcon />
                </Badge>
              </IconButton>

              <IconButton color="inherit" href="/perfil">
                <AccountCircleIcon />
              </IconButton>
              <Button color="inherit" onClick={handleLogout}>
                Sair
              </Button>
            </div>
          ) : (
            <Button color="inherit" href='/login'>Login</Button>
          )}
        </Toolbar>
      </AppBar>

      {/* Popover de Notificações */}
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleCloseNotifications}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Box sx={{ width: 360, p: 2 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Consultas Agendadas
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          {loadingNotifications ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
              <CircularProgress size={24} />
            </Box>
          ) : notifications.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
              Nenhuma consulta agendada
            </Typography>
          ) : (
            <List sx={{ maxHeight: 400, overflow: 'auto' }}>
              {notifications.map((consulta, index) => (
                <React.Fragment key={consulta.id}>
                  <ListItem disablePadding>
                    <ListItemButton>
                      <ListItemText
                        primary={
                          tipo === 'paciente' 
                            ? `Dr. ${consulta.Medico?.nome || 'Médico'}`
                            : `Paciente: ${consulta.Paciente?.nome || 'Paciente'}`
                        }
                        secondary={
                          <>
                            <Typography component="span" variant="body2" color="text.primary">
                              {format(new Date(consulta.data_hora), "PPPPp", { locale: ptBR })}
                            </Typography>
                            <br />
                            {consulta.Medico?.especialidade && (
                              <Typography component="span" variant="body2" color="text.secondary">
                                {consulta.Medico.especialidade}
                              </Typography>
                            )}
                          </>
                        }
                      />
                    </ListItemButton>
                  </ListItem>
                  {index < notifications.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          )}
        </Box>
      </Popover>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
      >
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <List>
            {drawerItems.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton href={item.path}>
                  <ListItemIcon>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </Box>
  );
}