# 🚀 ContentFlow API

API RESTful para planejamento e gerenciamento de conteúdo para mídias sociais, desenvolvida com Node.js, Express, TypeScript e Prisma.

## 🛠️ Tecnologias

- Node.js
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL
- Docker e Docker Compose

## 📋 Pré-requisitos

- [Git](https://git-scm.com/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

## ⚙️ Execução

**1. Clone o repositório**

```bash
git clone https://github.com/RonyFonseca/ContentFlow-API.git
```

**2. Acesse a pasta**

```bash
cd ContentFlow-API
```

**3. Configure as variáveis de ambiente**

Crie um arquivo `.env` na raiz do projeto com as variáveis necessárias para a aplicação e a conexão com o banco de dados.

**4. Inicie a aplicação**

```bash
docker compose up --build -d
```

A API estará disponível em `http://localhost:5000`, desde que essa seja a porta configurada no Docker Compose.
