import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
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
import { useContext } from 'react';
import { AuthContext } from '../../authContext/AuthContext';
import axios from 'axios';


export default function NewHeader() {
  const { user, setUser } = useContext(AuthContext);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const tipo = localStorage.getItem('tipo')

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
  let drawerItems = [];

 if(tipo === 'admin'){
    drawerItems = [
    { text: 'Início', icon: <HomeIcon />, path: '/' },
    { text: 'Pacientes', icon: <AccountCircleIcon />, path: '/admin-paciente' },
    { text: 'Médicos', icon: <AccountCircleIcon />, path: '/admin-medico' },
    { text: 'Consultas', icon: <ContactMailIcon />, path: '/admin-consulta' }
  ];
}else if( tipo === 'paciente'){
  drawerItems = [
    { text: 'Início', icon: <HomeIcon />, path: '/' },
    { text: 'Consultas', icon: <AccountCircleIcon />, path: '/consultas' },
    { text: 'Contato', icon: <ContactMailIcon />, path: '/contact' },
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
          <div>
            <IconButton color="inherit" href="/profile">
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