import express from 'express';
import { Admin } from '../config/db.js';
import bcrypt from 'bcrypt';
import { Op } from 'sequelize';

const router_admins = express.Router();


router_admins.post('/admins', async (req, res) => {
    try {

        if (!req.body.nome || !req.body.email || !req.body.senha) {
            return res.status(400).json({ error: 'Nome, email e senha são obrigatórios' });
        }


        const adminExistente = await Admin.findOne({
            where: { email: req.body.email }
        });

        if (adminExistente) {
            return res.status(400).json({ error: 'Email já cadastrado' });
        }


        const saltRounds = 10;
        const hashedSenha = await bcrypt.hash(req.body.senha, saltRounds);

        const novoAdmin = await Admin.create({
            nome: req.body.nome,
            email: req.body.email,
            senha: hashedSenha
        });


        const adminResponse = {
            id: novoAdmin.id,
            nome: novoAdmin.nome,
            email: novoAdmin.email,
            createdAt: novoAdmin.createdAt,
            updatedAt: novoAdmin.updatedAt
        };

        res.status(201).json(adminResponse);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router_admins.get('/admins', async (req, res) => {
    try {
        const admins = await Admin.findAll({
            attributes: { exclude: ['senha'] },
            order: [['nome', 'ASC']]
        });
        res.json(admins);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router_admins.get('/admins/:id', async (req, res) => {
    try {
        const admin = await Admin.findByPk(req.params.id, {
            attributes: { exclude: ['senha'] }
        });

        if (admin) {
            res.json(admin);
        } else {
            res.status(404).json({ error: 'Admin não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router_admins.patch('/admins/:id', async (req, res) => {
    try {

        if (req.body.email) {
            const adminComEmail = await Admin.findOne({
                where: {
                    email: req.body.email,
                    id: { [Op.ne]: req.params.id } 
                }
            });

            if (adminComEmail) {
                return res.status(400).json({ error: 'Email já está em uso' });
            }
        }

    
        if (req.body.senha) {
            req.body.senha = await bcrypt.hash(req.body.senha, 10);
        }

        const [updated] = await Admin.update(req.body, {
            where: { id: req.params.id }
        });

        if (updated) {
            const adminAtualizado = await Admin.findByPk(req.params.id, {
                attributes: { exclude: ['senha'] }
            });
            res.json(adminAtualizado);
        } else {
            res.status(404).json({ error: 'Admin não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router_admins.put('/admins/:id', async (req, res) => {
    try {

        if (!req.body.nome || !req.body.email || !req.body.senha) {
            return res.status(400).json({ error: 'Nome, email e senha são obrigatórios' });
        }

        const admin = await Admin.findByPk(req.params.id);
        if (!admin) {
            return res.status(404).json({ error: 'Admin não encontrado' });
        }


        if (req.body.email !== admin.email) {
            const emailExistente = await Admin.findOne({
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


        admin.nome = req.body.nome;
        admin.email = req.body.email;
        admin.senha = hashedSenha;

        await admin.save();


        const adminResponse = {
            id: admin.id,
            nome: admin.nome,
            email: admin.email,
            createdAt: admin.createdAt,
            updatedAt: admin.updatedAt
        };

        res.json(adminResponse);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router_admins.delete('/admins/:id', async (req, res) => {
    try {
        const deleted = await Admin.destroy({
            where: { id: req.params.id }
        });

        if (deleted) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'Admin não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router_admins.post('/admins/login', async (req, res) => {
    try {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({ error: 'Email e senha são obrigatórios' });
        }

        const admin = await Admin.findOne({ where: { email } });

        if (!admin) {
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }

        const senhaValida = await bcrypt.compare(senha, admin.senha);

        if (!senhaValida) {
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }


        const adminResponse = {
            id: admin.id,
            nome: admin.nome,
            email: admin.email,
            createdAt: admin.createdAt,
            updatedAt: admin.updatedAt
        };

        res.json(adminResponse);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router_admins;