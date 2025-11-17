# 🍎 FruitSelection

Aplicação Full Stack para cadastro, busca e visualização de frutas com informações botânicas e nutricionais.  

---

## 👨‍🏫 Informações Acadêmicas

- **Universidade**: Universidade Tecnológica Federal do Paraná - Campus Cornélio Procópio (UTFPR-CP)  
- **Disciplina**: ES47B - Programação Web Full Stack - Projeto 02  
- **Professor**: Prof. Dr. Willian Massami Watanabe  
- **Aluno**: Henrique Cesar Nogarini de Carvalho  
- **RA**: 2102374  
- **Semestre**: 2025/2  

---

## 🍎 FruitSelection - Instruções de Execução

## 📋 Pré-requisitos

Certifique-se de ter instalado:

1. **Node.js** (versão 16 ou superior)  
   - Baixe em: https://nodejs.org/  
   - Verifique a instalação:  
     ```bash
     node --version
     ```

2. **MongoDB** (versão 6 ou superior)  
   - Baixe em: https://www.mongodb.com/try/download/community  
   - Ou use MongoDB Atlas (cloud): https://www.mongodb.com/cloud/atlas  

3. **npm** (geralmente já vem com o Node.js)  
   - Verifique a instalação:  
     ```bash
     npm --version
     ```

---

## 🚀 Passo a Passo para Rodar o Projeto

### 1️⃣ Iniciar o MongoDB

#### Opção A: MongoDB Local

Abra um terminal PowerShell e execute:

```powershell
# Inicie o serviço do MongoDB
mongod
```

O MongoDB ficará rodando em: `mongodb://127.0.0.1:27017/`

#### Opção B: MongoDB Atlas (Cloud)

Se estiver usando MongoDB Atlas, configure a variável de ambiente no backend:

```powershell
# No PowerShell, navegue até a pasta backend
cd "F:\UTFPR\2025-2\ES47B - Programação Web Fullstack\Projeto 02\FruitSelection\backend"

# Configure a variável de ambiente
$env:MONGO_URI="sua-connection-string-aqui"
```

> **Obs.:** Ajuste o caminho conforme sua estrutura de pastas.

---

### 2️⃣ Instalar Dependências do Backend

Abra um **novo** terminal PowerShell e execute:

```powershell
# Navegue até a pasta do backend
cd "F:\UTFPR\2025-2\ES47B - Programação Web Fullstack\Projeto 02\FruitSelection\backend"

# Instale as dependências
npm install
```

**Pacotes instalados (principais):**

- `express` – Framework web  
- `cors` – Middleware para habilitar CORS  
- `mongodb` – Driver do MongoDB  
- `jsonwebtoken` – Autenticação JWT  
- `nodemon` – Hot reload durante o desenvolvimento  

---

### 3️⃣ Iniciar o Backend

No mesmo terminal do backend:

```powershell
# Modo desenvolvimento (com hot reload)
npm run dev

# OU modo produção
npm start
```

✅ **Backend rodando em:** `http://localhost:4000`

Você verá mensagens como:

```text
Conectado ao MongoDB
Cache em memória inicializado
Back-end rodando em http://localhost:4000
```

---

### 4️⃣ Instalar Dependências do Frontend

Abra um **NOVO** terminal PowerShell:

```powershell
# Navegue até a pasta do frontend
cd "F:\UTFPR\2025-2\ES47B - Programação Web Fullstack\Projeto 02\FruitSelection\frontend"

# Instale as dependências
npm install
```

**Pacotes instalados (principais):**

- `react` – Biblioteca de UI  
- `react-dom` – Renderização do React  
- `axios` – Cliente HTTP para chamadas de API  
- `vite` – Build tool e dev server  

---

### 5️⃣ Iniciar o Frontend

No mesmo terminal do frontend:

```powershell
# Inicie o servidor de desenvolvimento
npm run dev
```

✅ **Frontend rodando em:** `http://localhost:5173`

Saída esperada:

```text
VITE v7.2.2  ready in XXX ms
➜  Local:   http://localhost:5173/
➜  press h + enter to show help
```

---

## 🎯 Testando o Sistema

### 1. Acesse o Frontend

Abra o navegador em: `http://localhost:5173`

### 2. Crie uma Conta

1. Clique em **"Começar"** ou **"Entrar"**  
2. Clique em **"Registrar-se"**  
3. Preencha os campos:
   - Nome (mínimo 3 caracteres)
   - E-mail (formato válido)
   - Senha (mínimo 6 caracteres)
   - Confirmar senha (deve coincidir)
4. Clique em **"Registrar"**  
5. Você será redirecionado para a tela de login

### 3. Faça Login

1. Digite o e-mail e senha cadastrados  
2. Clique em **"Entrar"**  
3. Você será autenticado e verá a interface principal

### 4. Adicionar Frutas

1. Clique no botão **"+ Adicionar Fruta"**  
2. Preencha os dados:
   - Nome da fruta (obrigatório)
   - Família, Gênero, Ordem (opcionais)
   - URL da imagem (opcional)
   - Informações nutricionais (opcional)
3. Clique em **"Adicionar"**

### 5. Buscar Frutas

1. Use a barra de busca no topo  
2. Escolha o modo de busca:
   - **Todas**: Lista todas as frutas  
   - **Nome**: Busca por nome  
   - **Família**: Filtra por família botânica  
   - **Gênero**: Filtra por gênero  
   - **Ordem**: Filtra por ordem  

### 6. Visualizar Detalhes

1. Clique em qualquer card de fruta  
2. Um modal abrirá com:
   - Imagem da fruta  
   - Informações botânicas  
   - Tabela nutricional completa  

### 7. Fazer Logout

1. Clique no botão **"Sair"** no cabeçalho  
2. Você será desconectado e voltará à tela inicial  

---

## 🧪 Funcionalidades Implementadas

### ✅ Backend

- ✅ Autenticação JWT com login/registro/logout  
- ✅ CRUD completo de frutas  
- ✅ Sistema de cache em memória (60s para listas, 5min para detalhes)  
- ✅ Blacklist de tokens JWT (logout)  
- ✅ Pool de conexões MongoDB  
- ✅ Sanitização de inputs  
- ✅ CORS configurado para o frontend  

### ✅ Frontend

- ✅ Interface inspirada no FruitFavs  
- ✅ Sistema de autenticação completo  
- ✅ Validações de formulário em tempo real:
  - E-mail com regex  
  - Senha com mínimo de 6 caracteres  
  - Nome obrigatório  
  - Confirmação de senha  
- ✅ Mensagens de erro customizadas em vermelho  
- ✅ Modal que não fecha ao clicar fora (apenas pelo **X**)  
- ✅ Busca por nome/família/gênero/ordem  
- ✅ Adicionar frutas com dados nutricionais  
- ✅ Visualização detalhada de frutas  
- ✅ Grid responsivo  
- ✅ Animações e loading states  
- ✅ Persistência de sessão (`localStorage`)  
- ✅ **Todas as requisições usando Axios**  

---

## 🔍 Estrutura do Projeto

```text
FruitSelection/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js          # Conexão MongoDB
│   │   │   └── cache.js       # Sistema de cache
│   │   ├── models/
│   │   │   ├── userModel.js   # CRUD de usuários
│   │   │   └── fruitModel.js  # CRUD de frutas
│   │   ├── routes/
│   │   │   ├── authRoutes.js  # /api/auth/*
│   │   │   └── fruitRoutes.js # /api/fruits/*
│   │   └── index.js           # Entry point
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── AuthModal.jsx
│   │   │   ├── LoginForm.jsx
│   │   │   ├── RegisterForm.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   ├── FruitGrid.jsx
│   │   │   ├── DetailModal.jsx
│   │   │   └── AddFruitModal.jsx
│   │   ├── App.jsx            # Componente principal
│   │   ├── App.css            # Estilos principais
│   │   ├── index.css          # Reset CSS
│   │   └── main.jsx           # Entry point
│   └── package.json
│
└── INSTRUCOES.md              # Este arquivo (ou README)
```

---

## 📡 Endpoints da API

### Autenticação (`/api/auth`)

| Método | Rota                 | Descrição              |
|--------|----------------------|------------------------|
| POST   | `/api/auth/register` | Cadastrar novo usuário |
| POST   | `/api/auth/login`    | Fazer login            |
| POST   | `/api/auth/logout`   | Fazer logout (requer token) |

### Frutas (`/api/fruits`)

| Método | Rota                               | Descrição              | Autenticação |
|--------|------------------------------------|------------------------|--------------|
| GET    | `/api/fruits`                      | Listar todas as frutas | ✅ Sim       |
| GET    | `/api/fruits?search=banana`        | Buscar por nome        | ✅ Sim       |
| GET    | `/api/fruits?family=Rosaceae`      | Buscar por família     | ✅ Sim       |
| GET    | `/api/fruits/:id`                  | Buscar por ID          | ✅ Sim       |
| POST   | `/api/fruits`                      | Adicionar fruta        | ✅ Sim       |

---

## 🐛 Solução de Problemas

### Erro: `ECONNREFUSED` no backend

- **Causa:** MongoDB não está rodando  
- **Solução:** Execute `mongod` em um terminal  

---

### Erro: `Port 4000 already in use`

- **Causa:** Já existe um processo rodando na porta 4000  
- **Solução:**

```powershell
# Encontre o processo
netstat -ano | findstr :4000

# Mate o processo (substitua PID pelo número encontrado)
taskkill /PID [PID] /F
```

---

### Erro: `CORS policy` no navegador

- **Causa:** Backend não está com CORS configurado ou não está rodando  
- **Solução:**
1. Verifique se o backend está rodando em `http://localhost:4000`  
2. Verifique se o arquivo `backend/src/index.js` tem o middleware CORS  
3. Reinicie o backend  

---

### Frontend não carrega frutas

- **Causa:** Usuário não está autenticado ou token expirou  
- **Solução:**
1. Faça logout e login novamente  
2. Verifique o console do navegador (F12) para erros  
3. Verifique se o backend está respondendo em `/api/health`  

---

## 📦 Banco de Dados

O MongoDB criará automaticamente o banco `FruitSelection` com as coleções:

- **users**  
  - Campos: `_id`, `name`, `email`, `passwordHash`, `passwordSalt`, `createdAt`

- **fruits**  
  - Campos: `_id`, `name`, `family`, `genus`, `order`, `image`, `nutritions`, `createdAt`

---

## 🎨 Tecnologias Utilizadas

### Backend

- Node.js + Express  
- MongoDB (driver nativo)  
- JWT (`jsonwebtoken`)  
- Cache em memória  
- CORS  

### Frontend

- React 19  
- Vite  
- Axios  
- CSS puro (sem frameworks)  

---

## 👨‍💻 Desenvolvimento

Para desenvolvimento, recomenda-se abrir **3 terminais**:

1. **Terminal 1:** MongoDB  
   ```bash
   mongod
   ```
2. **Terminal 2:** Backend  
   ```bash
   cd backend
   npm run dev
   ```
3. **Terminal 3:** Frontend  
   ```bash
   cd frontend
   npm run dev
   ```

---

## ✅ Checklist de Verificação

Antes de testar, confirme:

- [ ] MongoDB está rodando  
- [ ] Backend instalou dependências (`npm install`)  
- [ ] Backend está rodando em `http://localhost:4000`  
- [ ] Frontend instalou dependências (`npm install`)  
- [ ] Frontend está rodando em `http://localhost:5173`  
- [ ] Console do navegador não mostra erros de CORS  
- [ ] Consegue se registrar  
- [ ] Consegue fazer login  
- [ ] Consegue adicionar frutas  
- [ ] Consegue buscar frutas  
- [ ] Sistema de cache está ativo (verifique logs do backend)  

---

## 📞 Suporte

Em caso de dúvidas ou problemas:

1. Verifique os logs do backend no terminal  
2. Abra o Console do navegador (F12) e verifique a aba **Network**  
3. Confirme que todas as dependências foram instaladas corretamente  
4. Verifique se as portas **4000** e **5173** estão livres  
