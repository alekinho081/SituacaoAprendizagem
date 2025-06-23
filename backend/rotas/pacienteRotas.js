import express from 'express';
import { Paciente } from '../config/db.js';
import bcrypt from 'bcrypt';
import { Op } from 'sequelize';

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
        const paciente = await Paciente.findByPk(req.params.id, {
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


router_pacientes.patch('/pacientes/:id', async (req, res) => {
    try {

        if (req.body.cpf) {
            return res.status(400).json({ error: 'Atualização de CPF não permitida' });
        }


        if (req.body.email) {
            const pacienteComEmail = await Paciente.findOne({
                where: {
                    email: req.body.email,
                    id: { [Op.ne]: req.params.id }
                }
            });

            if (pacienteComEmail) {
                return res.status(400).json({ error: 'Email já está em uso' });
            }
        }


        if (req.body.senha) {
            req.body.senha = await bcrypt.hash(req.body.senha, 10);
        }

        const [updated] = await Paciente.update(req.body, {
            where: { id: req.params.id }
        });

        if (updated) {
            const pacienteAtualizado = await Paciente.findByPk(req.params.id, {
                attributes: { exclude: ['senha'] }
            });
            res.json(pacienteAtualizado);
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

export default router_pacientes;