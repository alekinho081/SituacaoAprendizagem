import express from 'express';
import consultaRouter from './rotas/consultaRotas.js';
import medicoRouter from './rotas/medicoRotas.js';
import pacienteRouter from './rotas/pacienteRotas.js';
import adminRouter from './rotas/adminRotas.js';
import { sequelize } from './config/db.js'; 
import cors from 'cors'
import autenticar from './middlewares/authController.js';
import { Paciente } from './config/db.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const app = express();

app.use(cors())
app.use(express.json());


sequelize.authenticate()
  .then(() => console.log('✅ Conexão com o banco estabelecida'))
  .catch(err => console.error('❌ Erro ao conectar ao banco:', err));

app.use('/v1', autenticar,consultaRouter);
app.use('/v1', autenticar,medicoRouter);
app.use('/v1', autenticar,pacienteRouter);
app.use('/v1', autenticar,adminRouter);

app.post('/login', async (req, res) => {
  try {
      const { email, senha } = req.body;

      const paciente = await Paciente.findOne({ where: { email } });

      if (!paciente) {
          return res.status(404).json({ error: 'Paciente não encontrado' });
      }

  
      const senhaValida = await bcrypt.compare(senha, paciente.senha);

      if (!senhaValida) {
          return res.status(401).json({ error: 'Senha incorreta' });
      }

      const token = jwt.sign(
          { id: paciente.id }, 
          process.env.JWT_SECRET,
          { expiresIn: '1h' }
      );

      
      res.json({
          id: paciente.id,
          token,
          nome: paciente.nome,
          email: paciente.email,
      });

  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});


const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});