import { Sequelize, DataTypes } from 'sequelize';
import dotenv from 'dotenv';
import fs from 'fs'
import path from 'path'
dotenv.config();

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    name: process.env.DB_NAME
};

const sequelize = new Sequelize({
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: 11628,
    dialect: 'postgres',
    pool: {
        max: 5,
        idle: 30000,
        acquire: 60000,
    },
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: true,
            ca: `-----BEGIN CERTIFICATE-----
MIIEUDCCArigAwIBAgIUbgrVlgMZBO1eCnMkHAK9FY+Uv8gwDQYJKoZIhvcNAQEM
BQAwQDE+MDwGA1UEAww1NjNmZDZiMjgtZjgyNi00MTAxLTgxN2QtMjY1MTgzOWFi
Y2UxIEdFTiAxIFByb2plY3QgQ0EwHhcNMjUwNjEwMjA1NDM5WhcNMzUwNjA4MjA1
NDM5WjBAMT4wPAYDVQQDDDU2M2ZkNmIyOC1mODI2LTQxMDEtODE3ZC0yNjUxODM5
YWJjZTEgR0VOIDEgUHJvamVjdCBDQTCCAaIwDQYJKoZIhvcNAQEBBQADggGPADCC
AYoCggGBAPSoEyT6MxcNHU8d5Cs6oumEW93E8rcWXsVIeL215HKZKmWOJgiLYBQg
daWH8zcvVYttLIPXeSPFZRNtYjn9zq5Rzrd1lxyogRNzIisAGAAKHnmm4+ggtvwd
tT83/OZGIdQcRP3nv42b6TnopBBfb29mMLFpFy1O9+WwPhBT2UyF0Te8FR4wzd5T
gIGmyYDb1F7wEQa7LJy8d7cIN+t9O+ak4BoRAN2iIrB2F7zDWD8QteksGM9UC7fs
Md/a2FXlWoU6jWGNcTZLafs+17ItT2nTdlAd8sLLqr2A+PfPrKhdPcoKiMGu3Jdc
GcJinS1/HD4iy1/73u5QKia5Zw+nc/IyCXa97DeusSPBeSTcsDoxCnQ31Yykeb0g
6f746FDmFO4Vlyp0eGF+cZ/ofFbR+naJdTGuGstmmQ5q9/hBfZOWkQ+wSFr3VAw7
PtM6cWb6fB6PRXp/J8YOVvaQ0Xp1mPkuyiRzqMKZy22tc1hWXtupxrvscqJ7hRwS
th+EJcFuQwIDAQABo0IwQDAdBgNVHQ4EFgQUpvDPLT9+30EvTBSYslO88JLQ+4Mw
EgYDVR0TAQH/BAgwBgEB/wIBADALBgNVHQ8EBAMCAQYwDQYJKoZIhvcNAQEMBQAD
ggGBAIth1akiyVkhSRIvz9zt5bGuoo9FFxvpx6HbxbOaKZorxCgY9nqnCm9fwW6x
I7pcP+ztSXla6aupfG7BtlzhMbkNP8gX4WiEBxhP9T4YGuKmhvldsVDZQUhR1NTo
F/oCuvnrgdn8Dq/Uugxrsnj3B0DU+py77zAFbi3PiXs02nuxxY4/ieeQ+tmHgP84
qzOJJ+Mi863lj2prSeeHIVfVZ33gDWS2RjrsOyHyhMsC1yWCQ1jnhtv6+4bq/xAx
u0PhS4W5w5W5R9FhtZ9BsOraEeqo/c833tnsvn4agM8wuBII9XE+4ZJ4eHtXyRW7
Qd3YFPa+CZXb3ol5BGyfHGYzVIP4N9H7qmJsOPRxaqoAzg8svSR5o7+cu0CIn2Im
VUYBdq17If/L4ND75mdSrlCnOe1spPpgg1Qjv9AMrSBhEwauzvHZsaYNr8+w8j6d
VksfF9a2CYjL0UYAqGCHLr8JZ8vh9mt8oLDThn85TBWp+TvJmZMsiY2l/B2dd4lB
U3J/Qg==
-----END CERTIFICATE-----`,
        },
    },
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