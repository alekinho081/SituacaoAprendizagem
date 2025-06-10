const { Squelize, DataTypes, Sequelize} = require('sequelize')

const sequelize = new Sequelize('situacaoAprendizagem   ', 'postgres', 'senai',{
    host: 'localhost',
    port: 5432,
    dialect: 'postgres',
    logging: false,

        define:{
            timestemps:true,
            underscored: true, //converte nomes de atribustos CamelCase para snake_case
        }

})

const Consulta = sequelize.define('Consulta', {
    id:{
        type: DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    
    dataCriada:{
        type: DataTypes.DATE,
    }

})


const User = sequelize.define('User',{
    id:{
        type: DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
    },
    email:{
        type: DataTypes.STRING,
        allowNull:true,
        unique:true
    },
    age:{
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue:18
    },
    tipo: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'paciente'
    }
},
{
    tableName: 'users',
    freezeTableName: false,
})

async function runDatabaseOperations() {
   try{
    await sequelize.authenticate()
    console.log('Conexão com o banco de dados estabelecida com sucesso.')

    await User.sync({force: true})
    console.log('Table "users" criada com sucesso')
    
    const user1 = await User.create({
        firstName: 'John',
        lastName: 'Doe',
        email: 'John.doe@gmail.com',
        age: 30
    })

    const user2 = await User.create({
        firstName: 'Bob',
        lastName: 'Fulano',
        email: 'Fulano123@gmail.com'
    })

    const user3 = await User.create({
        firstName: 'Alice',
        lastName: 'Morais',
        email: 'Cice@gmail.com',
        age: 21
    })

    console.log('\n Buscando usuários da tabela "users"...')
    const allUsers = await User.findAll()
    allUsers.forEach(user => {
        console.log(`ID : ${user.id}, Nome: ${user.firstName} ${user.lastName}, Email: ${user.email}, Idade: ${user.age}`)
    })

    console.log('\nAtualizando o usuário 1')
    if(user1){
        user1.age = 31
        user1.save()
        console.log(`Usuario atualizado: ${user1.firstName} ${user1.lastName}, Nova Idade: ${user1.age}`)
    }

    const userToDelete = await User.findOne({where: {firstName: 'Bob'}})
    
    if(userToDelete){
        await userToDelete.destroy()
        console.log(`Usuário deletado: ${userToDelete.firstName} ${userToDelete.lastName}`)
    }else{
        console.log('Usuário não encontrado para deletar.')
    }

   }catch(error){

    console.log('Erro ao conectar ou criar a tabela: ', error)

   }finally{

    await sequelize.close()
    console.log('Conexão com o banco de dados fechada.')

   }
}

runDatabaseOperations()