# Sistema de Gestão de Reservas para Clínica Médica

## 📋 Pré-requisitos

- Node.js (versão 16 ou superior)
- npm ou yarn
- PostgreSQL
- Git

## 🛠️ Configuração do Ambiente

### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/seu-repositorio.git
cd seu-repositorio
```

### 2. Instale as dependências do frontend
```bash
cd frontend
npm install
# ou
yarn install
```

### 3. Configure o backend
```bash
cd ../backend
npm install
# ou
yarn install
```

### 4. Configure o banco de dados
- Crie um banco PostgreSQL
- Configure as variáveis de ambiente no arquivo `.env` (use `.env.example` como modelo)

## ▶️ Como Executar

### Frontend
```bash
cd frontend
npm start
# ou
yarn start
```

### Backend
```bash
cd backend
npm run dev
# ou
yarn dev
```

## 🔐 Credenciais de Acesso

Você pode usar as seguintes credenciais para acessar como administrador:

**Email:** admins@gmail.com  
**Senha:** admin

## 🌐 Acesso

O frontend estará disponível em:  
[http://localhost:3000](http://localhost:3000)

O backend estará disponível em:  
[http://localhost:5000](http://localhost:5000)

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React** (com React Router, Context API e Hooks)
- **Axios** para requisições HTTP
- **Material-UI** para componentes de UI
- **React Hook Form** para validação de formulários
- **date-fns** para manipulação de datas

### Backend
- **Node.js** com **Express**
- **Sequelize** como ORM para PostgreSQL
- **JWT** para autenticação
- **Bcrypt** para hash de senhas

### Banco de Dados
- **PostgreSQL**
