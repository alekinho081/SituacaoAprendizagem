import express from 'express';
import { Paciente, Medico, Admin } from '../config/db.js';
import bcrypt from 'bcrypt';
import { Op } from 'sequelize';
import jwt from 'jsonwebtoken'


const router_pacientes = express.Router();


router_pacientes.post('/pacientes', async (req, res) => {
    try {

        if (!req.body.nome || !req.body.cpf || !req.body.email || !req.body.idade || !req.body.senha) {
            return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
        }


        const pacienteExistente = await Paciente.findOne({
            where: {
                [Op.or]: [
                    { cpf: req.body.cpf },
                    { email: req.body.email }
                ]
            }
        });

        if (pacienteExistente) {
            return res.status(400).json({
                error: pacienteExistente.cpf === req.body.cpf ?
                    'CPF já cadastrado' : 'Email já cadastrado'
            });
        }


        const hashedSenha = await bcrypt.hash(req.body.senha, 10);

        const novoPaciente = await Paciente.create({
            nome: req.body.nome,
            cpf: req.body.cpf,
            email: req.body.email,
            idade: req.body.idade,
            senha: hashedSenha
        });


        const pacienteResponse = {
            id: novoPaciente.id,
            nome: novoPaciente.nome,
            cpf: novoPaciente.cpf,
            email: novoPaciente.email,
            idade: novoPaciente.idade,
            createdAt: novoPaciente.createdAt,
            updatedAt: novoPaciente.updatedAt
        };

        res.status(201).json(pacienteResponse);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router_pacientes.put('/pacientes/:id', async (req, res) => {
    try {

        if (!req.body.nome || !req.body.email || !req.body.senha) {
            return res.status(400).json({ error: 'Nome, email e senha são obrigatórios' });
        }

  
        const paciente = await Paciente.findByPk(req.params.id);
        if (!paciente) {
            return res.status(404).json({ error: 'Paciente não encontrado' });
        }

    
        if (req.body.email !== paciente.email) {
            const emailExistente = await Paciente.findOne({
                where: {
                    email: req.body.email,
                    id: { [Op.ne]: req.params.id }
                }
            });
            if (emailExistente) {
                return res.status(400).json({ error: 'Email já está em uso' });
            }
        }


        const hashedSenha = await bcrypt.hash(req.body.senha, 10);


        paciente.nome = req.body.nome;
        paciente.email = req.body.email;
        paciente.senha = hashedSenha;

        await paciente.save();


        const pacienteResponse = {
            id: paciente.id,
            nome: paciente.nome,
            cpf: paciente.cpf,
            email: paciente.email,
            idade: paciente.idade,
            createdAt: paciente.createdAt,
            updatedAt: paciente.updatedAt
        };

        res.json(pacienteResponse);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router_pacientes.get('/pacientes', async (req, res) => {
    try {
        const pacientes = await Paciente.findAll({
            attributes: { exclude: ['senha'] },
            order: [['nome', 'ASC']]
        });
        res.json(pacientes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router_pacientes.get('/pacientes/:id', async (req, res) => {
    try {
        const email = req.body

        const paciente = await Paciente.findOne({ where: { email: email } }, {
            attributes: { exclude: ['senha'] }
        });

        if (paciente) {
            res.json(paciente);
        } else {
            res.status(404).json({ error: 'Paciente não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});




router_pacientes.delete('/pacientes/:id', async (req, res) => {
    try {
        const deleted = await Paciente.destroy({
            where: { id: req.params.id }
        });

        if (deleted) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'Paciente não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router_pacientes.post('/login', async (req, res) => {
    try {
        const { email, senha } = req.body;

        
        const [paciente, medico, admin] = await Promise.all([
            Paciente.findOne({ where: { email } }),
            Medico.findOne({ where: { email } }),
            Admin.findOne({ where: { email } })
        ]);


        const usuario = paciente || medico || admin;
        const tipoUsuario = paciente ? 'paciente' : medico ? 'medico' : admin ? 'admin' : null;

        if (!usuario) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

 
        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        if (!senhaValida) {
            return res.status(401).json({ error: 'Senha incorreta' });
        }

        const token = jwt.sign(
            { 
                id: usuario.id,
                tipo: tipoUsuario,  
                email: usuario.email
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );


        res.cookie('jwt', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 3600000
        });

        const responseData = {
            id: usuario.id,
            tipo: tipoUsuario,
            nome: usuario.nome,
            email: usuario.email,
            ...(tipoUsuario === 'medico' && { especialidade: usuario.especialidade }),
        };

        res.json(responseData);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router_pacientes.get('/check-auth', async (req, res) => {
    try {
      const token = req.cookies.jwt; 
  
      if (!token) {
        return res.status(401).json({ isAuthenticated: false });
      }
  
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const paciente = await Paciente.findByPk(decoded.id);
  
      if (!paciente) {
        return res.status(401).json({ isAuthenticated: false });
      }
  
      res.json({ 
        isAuthenticated: true,
        user: { id: paciente.id, email: paciente.email, nome: paciente.nome }
      });
    } catch (error) {
      res.status(401).json({ isAuthenticated: false });
    }
  });

router_pacientes.get('/logout', (req, res) => {
  res.clearCookie('jwt'); 
  res.status(200).json({ message: 'Logout successful' });
});




export default router_pacientes;