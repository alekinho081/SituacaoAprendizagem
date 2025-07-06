import express from 'express';
import { Consulta, Medico, Paciente } from '../config/db.js';
import { Op } from 'sequelize';

const router_consultas = express.Router();

router_consultas.get('/consultas', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const offset = (page - 1) * limit;
        
   
        const where = {};
        if (req.query.status) {
            where.status = req.query.status;
        }
        if (req.query.data_inicio && req.query.data_fim) {
            where.data_hora = {
                [Op.between]: [new Date(req.query.data_inicio), new Date(req.query.data_fim)]
            };
        }

        const { count, rows } = await Consulta.findAndCountAll({
            where,
            limit,
            offset,
            order: [['data_hora', 'DESC']],
            include: [
                {
                    model: Medico,
                    attributes: ['id', 'nome', 'especialidade']
                },
                {
                    model: Paciente,
                    attributes: ['id', 'nome', 'cpf']
                }
            ]
        });
        
        res.json({
            consultas: rows,
            total: count,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router_consultas.get('/consultas/:id', async (req, res) => {
    try {
        const consulta = await Consulta.findByPk(req.params.id, {
            include: [
                {
                    model: Medico,
                    attributes: ['id', 'nome', 'especialidade', 'email']
                },
                {
                    model: Paciente,
                    attributes: ['id', 'nome', 'cpf', 'email', 'idade']
                }
            ]
        });
        
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
   
        if (!req.body.data_hora || !req.body.medico_id || !req.body.paciente_id) {
            return res.status(400).json({ error: 'Data/hora, médico e paciente são obrigatórios' });
        }

        const conflito = await Consulta.findOne({
            where: {
                medico_id: req.body.medico_id,
                data_hora: req.body.data_hora,
                status: {
                    [Op.not]: 'cancelada'
                }
            }
        });

        if (conflito) {
            return res.status(400).json({ error: 'Médico já possui consulta neste horário' });
        }

        const consulta = await Consulta.create({
            ...req.body,
            status: 'agendada',
            valor: 180
        });
        
        res.status(201).json(consulta);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


router_consultas.patch('/consultas/:id', async (req, res) => {
    try {
        const consulta = await Consulta.findByPk(req.params.id);
        if (!consulta) {
            return res.status(404).json({ error: 'Consulta não encontrada' });
        }

  
        if (req.body.medico_id && req.body.medico_id !== consulta.medico_id) {
            return res.status(400).json({ error: 'Não é permitido alterar o médico da consulta' });
        }

        if (req.body.paciente_id && req.body.paciente_id !== consulta.paciente_id) {
            return res.status(400).json({ error: 'Não é permitido alterar o paciente da consulta' });
        }

       
        const camposPermitidos = ['data_hora', 'status', 'motivo', 'diagnostico', 'prescricao', 'observacoes', 'valor'];
        const dadosAtualizacao = {};
        
        camposPermitidos.forEach(campo => {
            if (req.body[campo] !== undefined) {
                dadosAtualizacao[campo] = req.body[campo];
            }
        });

        await Consulta.update(dadosAtualizacao, {
            where: { id: req.params.id }
        });

        const updatedConsulta = await Consulta.findByPk(req.params.id, {
            include: [
                { model: Medico, attributes: ['nome'] },
                { model: Paciente, attributes: ['nome'] }
            ]
        });
        
        res.json(updatedConsulta);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


router_consultas.delete('/consultas/:id', async (req, res) => {
    try {
        const consulta = await Consulta.findByPk(req.params.id);
        
        if (!consulta) {
            return res.status(404).json({ error: 'Consulta não encontrada' });
        }

        if (consulta.status === 'realizada') {
            return res.status(400).json({ error: 'Não é possível excluir consultas já realizadas' });
        }

        await consulta.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router_consultas.get('/consultas/:tipo/:id', async (req, res) => {
  try {
    const { tipo, id } = req.params;
    
    let consultas;
    if (tipo === 'paciente') {
      consultas = await Consulta.findAll({
        where: { paciente_id: id },
        include: [{ model: Medico, as: 'Medico' }]
      });
    } else if (tipo === 'medico') {
      consultas = await Consulta.findAll({
        where: { medico_id: id },
        include: [{ model: Paciente, as: 'Paciente' }]
      });
    } else {
      return res.status(400).json({ error: 'Tipo de usuário inválido' });
    }

    res.json(consultas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router_consultas;