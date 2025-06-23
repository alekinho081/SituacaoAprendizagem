import express from 'express';
import consultaRouter from './rotas/consultaRotas.js';
import medicoRouter from './rotas/medicoRotas.js';
import pacienteRouter from './rotas/pacienteRotas.js';
import adminRouter from './rotas/adminRotas.js';
import { sequelize } from './config/db.js'; 

const app = express();


app.use(express.json());


sequelize.authenticate()
  .then(() => console.log('✅ Conexão com o banco estabelecida'))
  .catch(err => console.error('❌ Erro ao conectar ao banco:', err));

app.use('/v1', consultaRouter);
app.use('/v1', medicoRouter);
app.use('/v1', pacienteRouter);
app.use('/v1', adminRouter);


const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});