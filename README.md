# Projeto TypeORM API

Uma API RESTful robusta e escalável desenvolvida com **Node.js**, **Express**, **TypeScript** e **TypeORM**. Este projeto implementa autenticação JWT, controle de acesso baseado em cargos (roles), paginação de dados e documentação interativa utilizando Swagger (OpenAPI 3.0).

## Tecnologias Utilizadas

- **Ambiente:** [Node.js](https://nodejs.org/) (ES Modules)
- **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
- **Framework Web:** [Express](https://expressjs.com/)
- **ORM:** [TypeORM](https://typeorm.io/)
- **Autenticação:** JSON Web Token (JWT)
- **Documentação:** Swagger UI (`swagger-ui-express` + `yamljs`)

---

## Pré-requisitos

Certifique-se de ter as seguintes ferramentas instaladas no seu ambiente de desenvolvimento:

- **Node.js** (v20+ recomendado - _o projeto foi testado em v25.2.x_)
- **Gerenciador de pacotes:** npm, yarn ou pnpm
- **Banco de Dados:** Uma instância de banco de dados compatível configurada (ex: PostgreSQL, MySQL, SQLite)

---

## Instalação e Configuração

**1. Clone o repositório:**

```bash
git clone [https://github.com/marcoahansen/projeto-typeorm.git](https://github.com/marcoahansen/projeto-typeorm.git)
cd projeto-typeorm
```

**2. Instale as dependências:**

```bash
npm install

```

**3. Configure as variáveis de ambiente:**
Crie um arquivo `.env` na raiz do projeto, baseado no seu arquivo de exemplo ou utilizando as seguintes variáveis principais:

```env
PORT=3000
FRONT_URL=http://localhost:5173

# Configurações do Banco de Dados (TypeORM)
DB_HOST=localhost
DB_PORT=5432
DB_USER=seu_usuario
DB_PASS=sua_senha
DB_NAME=nome_do_banco

# Autenticação
JWT_SECRET=sua_chave_secreta_super_segura

```

---

## Executando a Aplicação

Para iniciar o servidor em ambiente de desenvolvimento (com hot-reload):

```bash
npm run dev

```

Para compilar o código TypeScript e rodar a versão de produção:

```bash
npm run build
npm start

```

O servidor estará rodando em `http://localhost:3000` (ou na porta definida no seu `.env`).

---

## Documentação da API (Swagger)

A API possui uma documentação interativa completa gerada com o Swagger. Para acessá-la, inicie o servidor e navegue até:

👉 **[http://localhost:3000/api/docs](http://localhost:3000/api-docs)**

Lá você poderá testar todos os endpoints, validar os schemas de requisição/resposta e testar a autorização utilizando o token JWT.

---

## 🛣️ Resumo das Rotas

Abaixo estão os principais módulos da API. O prefixo base para todas as rotas é `/api`.

### 🔐 Autenticação (`/api/login`)

- `POST /login` - Realiza a autenticação e retorna o token JWT.

### 👥 Usuários (`/api/users`)

- `GET /users` - Lista todos os usuários (Paginado).
- `GET /users/active` - Lista apenas usuários ativos (Paginado).
- `GET /users/:id` - Busca um usuário específico pelo ID.
- `POST /users` - Cria um novo usuário.
- `PATCH /users` - Atualiza os dados do usuário autenticado.
- `PATCH /users/:id/toggle` - Ativa ou desativa um usuário (Requer Autenticação).
- `PATCH /users/role/:id` - Atualiza o cargo de um usuário (Apenas Admin).
- `DELETE /users/:id` - Remove um usuário (Requer Autenticação).

### 📝 Posts (`/api/posts`)

- `GET /posts` - Lista todos os posts (Paginado).
- `POST /posts` - Cria um novo post (Requer Autenticação).
- `PATCH /posts/:id` - Atualiza um post (Apenas o autor).
- `DELETE /posts/:id` - Remove um post (Autor ou Admin).

---

## 🏗️ Estrutura do Projeto

O projeto segue uma arquitetura baseada em camadas para garantir separação de responsabilidades (Clean Code) e fácil manutenção:

```text
src/
├── controllers/    # Lógica de controle de requisições e respostas
├── services/       # Lógica de negócio e comunicação com o banco
├── entities/       # Modelos do banco de dados (TypeORM)
├── routes/         # Definição dos endpoints da API
├── middlewares/    # Interceptadores (ex: autenticação, tratamento de erros)
├── data-source.ts  # Configuração de conexão do TypeORM
└── index.ts        # Ponto de entrada da aplicação
```
