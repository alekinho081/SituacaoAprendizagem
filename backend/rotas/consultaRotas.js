import express from 'express';
import { Consulta } from '../config/db.js';

const router_consultas = express.Router();

router_consultas.get('/consultas', async (req, res) => {
    try {
        const consultas = await Consulta.findAll();
        res.json(consultas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router_consultas.get('/consultas/:id', async (req, res) => {
    try {
        const consulta = await Consulta.findByPk(req.params.id);
        if (consulta) {
            res.json(consulta);
        } else {
            res.status(404).json({ error: 'Consulta não encontrada' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router_consultas.post('/consultas', async (req, res) => {
    try {
        const consulta = await Consulta.create(req.body);
        res.status(201).json(consulta);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


router_consultas.patch('/consultas/:id', async (req, res) => {
    try {
        const [updated] = await Consulta.update(req.body, {
            where: { id: req.params.id }
        });
        if (updated) {
            const updatedConsulta = await Consulta.findByPk(req.params.id);
            res.json(updatedConsulta);
        } else {
            res.status(404).json({ error: 'Consulta não encontrada' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


router_consultas.delete('/consultas/:id', async (req, res) => {
    try {
        const deleted = await Consulta.destroy({
            where: { id: req.params.id }
        });
        if (deleted) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'Consulta não encontrada' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router_consultas;