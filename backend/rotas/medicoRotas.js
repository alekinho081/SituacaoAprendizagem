import express from 'express';
import { Medico } from '../config/db.js';
import bcrypt from 'bcrypt';
import { Op } from 'sequelize';

const router_medicos = express.Router();


router_medicos.post('/medicos', async (req, res) => {
    try {

        if (!req.body.nome || !req.body.email || !req.body.senha) {
            return res.status(400).json({ error: 'Nome, email e senha são obrigatórios' });
        }

        const medicoExistente = await Medico.findOne({ where: { email: req.body.email } });
        if (medicoExistente) {
            return res.status(400).json({ error: 'Email já cadastrado' });
        }


        const saltRounds = 10;
        const hashedSenha = await bcrypt.hash(req.body.senha, saltRounds);

        const novoMedico = await Medico.create({
            nome: req.body.nome,
            especialidade: req.body.especialidade || null,
            email: req.body.email,
            senha: hashedSenha
        });


        const medicoResponse = {
            id: novoMedico.id,
            nome: novoMedico.nome,
            especialidade: novoMedico.especialidade,
            email: novoMedico.email,
            createdAt: novoMedico.createdAt,
            updatedAt: novoMedico.updatedAt
        };

        res.status(201).json(medicoResponse);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router_medicos.get('/medicos', async (req, res) => {
    try {
        const medicos = await Medico.findAll({
            attributes: { exclude: ['senha'] },
            order: [['nome', 'ASC']]
        });
        res.json(medicos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router_medicos.get('/medicos/:id', async (req, res) => {
    try {
        const medico = await Medico.findByPk(req.params.id, {
            attributes: { exclude: ['senha'] }
        });

        if (medico) {
            res.json(medico);
        } else {
            res.status(404).json({ error: 'Médico não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router_medicos.patch('/medicos/:id', async (req, res) => {
    try {


        if (req.body.senha) {
            req.body.senha = await bcrypt.hash(req.body.senha, 10);
        }

        const [updated] = await Medico.update(req.body, {
            where: { id: req.params.id }
        });

        if (updated) {
            const medicoAtualizado = await Medico.findByPk(req.params.id, {
                attributes: { exclude: ['senha'] }
            });
            res.json(medicoAtualizado);
        } else {
            res.status(404).json({ error: 'Médico não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router_medicos.put('/medicos/:id', async (req, res) => {
    try {

        if (!req.body.nome || !req.body.email || !req.body.senha) {
            return res.status(400).json({ error: 'Nome, email e senha são obrigatórios' });
        }
q
        const medico = await Medico.findByPk(req.params.id);
        if (!medico) {
            return res.status(404).json({ error: 'Médico não encontrado' });
        }


        if (req.body.email !== medico.email) {
            const emailExistente = await Medico.findOne({
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


        medico.nome = req.body.nome;
        medico.especialidade = req.body.especialidade || null;
        medico.email = req.body.email;
        medico.senha = hashedSenha;

        await medico.save();


        const medicoResponse = {
            id: medico.id,
            nome: medico.nome,
            especialidade: medico.especialidade,
            email: medico.email,
            createdAt: medico.createdAt,
            updatedAt: medico.updatedAt
        };

        res.json(medicoResponse);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router_medicos.delete('/medicos/:id', async (req, res) => {
    try {
        const deleted = await Medico.destroy({
            where: { id: req.params.id }
        });

        if (deleted) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'Médico não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router_medicos;