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


export { sequelize, Medico, Paciente, Admin, Consulta };  