# 🚀 ContentFlow API

**API RESTful para planejamento e gerenciamento de conteúdo para mídias sociais.**

O **ContentFlow** é uma plataforma desenvolvida para facilitar a organização da rotina de criadores de conteúdo e profissionais de mídias sociais, centralizando publicações, ideias e calendários editoriais em um único lugar.

Esta API é responsável por gerenciar a comunicação entre o frontend e o banco de dados, disponibilizando endpoints para as funcionalidades da plataforma.

---

## ✨ Funcionalidades

- 🔐 **Autenticação e autorização** — gerenciamento de acesso dos usuários.
- 📝 **Gerenciamento de publicações** — criação, edição e organização de posts.
- 💡 **Banco de ideias** — armazenamento de ideias para conteúdos futuros.
- 📅 **Calendário editorial** — planejamento e organização das publicações.
- 🗂️ **Organização de conteúdo** — gerenciamento por categorias, tipos e status.
- 🛡️ **Validação de dados** — tratamento e validação das informações recebidas pela API.

> *As funcionalidades acima representam o escopo do projeto; a disponibilidade de cada recurso depende da implementação atual da API.*

---

## 🛠️ Tecnologias

- **Node.js** — ambiente de execução.
- **Express.js** — framework para construção da API REST.
- **TypeScript** — tipagem estática e maior segurança no desenvolvimento.
- **Prisma ORM** — comunicação com o banco de dados.
- **PostgreSQL** — banco de dados relacional.
- **JWT** — autenticação baseada em tokens, caso configurada no projeto.

---

## 📋 Pré-requisitos

Antes de executar a aplicação, certifique-se de ter instalado:

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)
- [PostgreSQL](https://www.postgresql.org/)

---

## ⚙️ Instalação e execução

**1. Clone o repositório**

```bash
git clone https://github.com/RonyFonseca/ContentFlow-API.git
```

**2. Acesse a pasta do projeto**

```bash
cd ContentFlow-API
```

**3. Instale as dependências**

```bash
npm install
```

**4. Configure as variáveis de ambiente**

Crie um arquivo `.env` na raiz do projeto com as configurações necessárias, incluindo a conexão com o PostgreSQL.

```env
DATABASE_URL="postgresql://USUARIO:SENHA@localhost:5432/contentflow"
```

Ajuste os valores conforme a configuração do seu ambiente.

**5. Configure o banco de dados**

Caso o projeto utilize Prisma Migrate, execute:

```bash
npx prisma migrate dev
```

**6. Inicie a aplicação**

Utilize o script de desenvolvimento configurado no `package.json`. Por exemplo, se houver um script `dev`:

```bash
npm run dev
```

---

## 📁 Estrutura do projeto

A estrutura abaixo é ilustrativa e deve ser ajustada conforme a organização real do repositório.

```text
ContentFlow-API/
├── prisma/
│   └── schema.prisma
├── src/
│   ├── controllers/
│   ├── services/
│   ├── routes/
│   ├── middlewares/
│   ├── validators/
│   └── server.ts
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

## 🔗 Integração com o frontend

A API foi desenvolvida para atuar como camada de comunicação entre o banco de dados e a interface do ContentFlow, permitindo que o frontend consuma os recursos disponibilizados por meio de requisições HTTP.

---

## 🔒 Segurança

- Mantenha credenciais e tokens fora do controle de versão.
- Utilize variáveis de ambiente para configurações sensíveis.
- Valide os dados recebidos nas requisições.
- Configure corretamente a autenticação e as permissões de acesso.

---

<p align="center">
  <strong>ContentFlow API</strong> · Organize ideias. Planeje conteúdos. Publique com propósito.
</p>
