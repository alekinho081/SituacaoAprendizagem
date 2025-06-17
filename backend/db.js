import { Sequelize, DataTypes } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    name: process.env.DB_NAME
};

const sequelize = new Sequelize(dbConfig.name, dbConfig.user, dbConfig.password, {
    dialect: 'postgres',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    dialectOptions: {
        ssl: {
            require: true,  
            rejectUnauthorized: false 
        }
    },
    logging: false,  
});

const Medico = sequelize.define('Medico', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome: DataTypes.STRING,
    especialidade: DataTypes.STRING,
    senha: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
},
    {
        tableName: 'medicos',
        timestamps: true
    });

const Paciente = sequelize.define('Paciente', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome: DataTypes.STRING,
    cpf: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    idade: {
        type: DataTypes.STRING,
        allowNull: false
    },
    senha: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'pacientes',
    timestamps: true
});

const Admin = sequelize.define('Admin', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome: DataTypes.STRING,
    email: {
        type: DataTypes.STRING,
        unique: true
    },
    senha: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'admins',
    timestamps: true
});

const Consulta = sequelize.define('Consulta', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    data_hora: {
        type: DataTypes.DATE,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('agendada', 'realizada', 'cancelada', 'remarcada'),
        defaultValue: 'agendada'
    },
    motivo: {
        type: DataTypes.TEXT
    },
    diagnostico: {
        type: DataTypes.TEXT
    },
    prescricao: {
        type: DataTypes.TEXT
    },
    observacoes: {
        type: DataTypes.TEXT
    },
    valor: {
        type: DataTypes.DECIMAL(10, 2)
    },
    medico_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'medicos', // Nome da tabela
            key: 'id'
        }
    },
    paciente_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'pacientes',
            key: 'id'
        }
    }
}, {
    tableName: 'consultas',
    freezeTableName: true,
    indexes: [
        {
            fields: ['medico_id']
        },
        {
            fields: ['paciente_id']
        },
        {
            fields: ['data_hora']
        }
    ]
});


Medico.hasMany(Consulta, { foreignKey: 'medico_id' });

Consulta.belongsTo(Medico, { foreignKey: 'medico_id' });

Paciente.hasMany(Consulta, { foreignKey: 'paciente_id' });

Consulta.belongsTo(Paciente, { foreignKey: 'paciente_id' });


async function runDatabaseOperations() {
    try {
        await sequelize.authenticate();
        console.log('Conexão com o banco de dados estabelecida com sucesso.');

        // Sincroniza todos os modelos com o banco de dados (force: true apaga e recria as tabelas)
        await Medico.sync({force: true})
        await Admin.sync({force: true})
        await Paciente.sync({force: true})
        await Consulta.sync({force: true})
        console.log('Todas as tabelas foram criadas com sucesso');

        // Criando médicos
        const medico1 = await Medico.create({
            nome: 'Dr. João Silva',
            email: 'joao@gmail.com',
            especialidade: 'Cardiologia',
            senha: 'senha123'
        });

        const medico2 = await Medico.create({
            nome: 'Dra. Maria Souza',
            email: 'maria@gmail.com',
            especialidade: 'Pediatria',
            senha: 'senha456'
        });

        // Criando pacientes
        const paciente1 = await Paciente.create({
            nome: 'Carlos Oliveira',
            cpf: '123.456.789-00',
            email: 'carlos@email.com',
            idade: '30',
            senha: 'senha789'
        });

        const paciente2 = await Paciente.create({
            nome: 'Ana Santos',
            cpf: '987.654.321-00',
            email: 'ana@email.com',
            idade: '25',
            senha: 'senha012'
        });

        // Criando admin
        const admin1 = await Admin.create({
            nome: 'Admin Master',
            email: 'admin@clinica.com',
            senha: 'admin123'
        });

        // Criando consultas
        const consulta1 = await Consulta.create({
            data_hora: new Date('2025-12-15 14:30:00'),
            status: 'agendada',
            medico_id: medico1.id,
            paciente_id: paciente1.id
        });

        const consulta2 = await Consulta.create({
            data_hora: new Date('2025-12-16 10:00:00'),
            status: 'agendada',
            medico_id: medico2.id,
            paciente_id: paciente2.id
        });

        console.log('\n=== Médicos cadastrados ===');
        const medicos = await Medico.findAll();
        medicos.forEach(medico => {
            console.log(`ID: ${medico.id}, Nome: ${medico.nome}, Especialidade: ${medico.especialidade}`);
        });

        console.log('\n=== Pacientes cadastrados ===');
        const pacientes = await Paciente.findAll();
        pacientes.forEach(paciente => {
            console.log(`ID: ${paciente.id}, Nome: ${paciente.nome}, CPF: ${paciente.cpf}`);
        });

        console.log('\n=== Consultas agendadas ===');
        const consultas = await Consulta.findAll({
            include: [
                { model: Medico, attributes: ['nome', 'especialidade'] },
                { model: Paciente, attributes: ['nome'] }
            ]
        });

        consultas.forEach(consulta => {
            console.log(`
                Consulta ID: ${consulta.id}
                Data: ${consulta.data_hora}
                Status: ${consulta.status}
                Médico: ${consulta.Medico.nome} (${consulta.Medico.especialidade})
                Paciente: ${consulta.Paciente.nome}
            `);
        });

        // Exemplo de atualização
        // console.log('\nAtualizando status da consulta 1...');
        // await Consulta.update(
        //     { status: 'realizada' },
        //     { where: { id: consulta1.id } }
        // );
        // console.log('Status atualizado com sucesso!');

        // Exemplo de exclusão
        // console.log('\nDeletando a consulta 2...');
        // await Consulta.destroy({ where: { id: consulta2.id } });
        // console.log('Consulta deletada com sucesso!');

    } catch (error) {
        console.error('Erro durante as operações do banco de dados:', error);
    } finally {
        await sequelize.close();
        console.log('Conexão com o banco de dados fechada.');
    }
}

runDatabaseOperations();