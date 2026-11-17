# fluxo e regras de negocio do projeot e repositorio com init
Quick, high-signal notes for automated agents working in this repo

What this repo is
- Node/Express app. Entrypoint: app.js. Static frontend served from /public.

Essential commands
- Install deps: npm install
- Start (production): npm start
- Start with auto-reload (development): npm run dev

Environment / .env
- app.js chooses the env file by the top-level variable "ambiente_processo" (lines 1–4). It loads either ".env" (production) or ".env.dev" (development).
- config.js checks process.env.AMBIENTE_PROCESSO and will reject if it's not exactly "producao" or "desenvolvimento". That value must be set in the loaded env file OR you can change the top lines of app.js to select the file.
- Use these filenames exactly: .env (production) and .env.dev (development). Note: a message in src/database/config.js refers to "dev.env" — ignore that; actual loader uses ".env.dev".
- Required env variables (create .env.dev for local work):
  - AMBIENTE_PROCESSO=desenvolvimento
  - APP_PORT=<port number>
  - APP_HOST=<host e.g. 127.0.0.1>
  - DB_HOST
  - DB_DATABASE
  - DB_USER
  - DB_PASSWORD
  - DB_PORT

If the server fails to start or DB calls immediately reject, check AMBIENTE_PROCESSO and APP_PORT are present in the env file the app loads.

Database
- The project expects a MySQL server. Schema and initial inserts: src/database/Script_BD_V3.sql and src/database/Script_BD_Inserts_V3.sql.
- The code opens a new connection per query (mysql2 createConnection). For local testing, run a local MySQL instance and point DB_* env vars to it.

Project structure highlights an agent should know
- app.js: main HTTP server and routing registration (see lines where app.use(...) mounts routes).
- Public frontend is served from the "public" directory (static).
- API routes live in src/routes/*.js (usuario, gestor, instancia, etc.).
- Database helpers: src/database/config.js exports executar(instrucao, valores).

Common mistakes to avoid
- Don't assume environment is controlled only by .env — app.js's top var overrides which file is loaded. Edit app.js only if you understand that switch.
- Filenames matter: create ".env.dev" (not "dev.env") if you want development env loaded.
- The server will crash or listen on undefined port if APP_PORT is missing — always set APP_PORT in the active env file.
- There are no tests / build steps; running npm install then npm run dev is the fastest way to start.

Where to look for more repo-specific instructions
- app.js (environment selection and console hints)
- src/database/config.js (DB connection and AMBIENTE_PROCESSO check)
- src/database/*.sql (schema + inserts)

## 1. Contexto

Este repositório é um projeto de uma aplicação web de monitoramento de servidores de ecommerce.

## 2. Objetivo

Com a aplicação trazer dashboards inteligentes que atualizam de 15 em 15 minutos que traz métricas de hardware dos servidores, junto da customização de quando se há alertas de cada componente,
habilidade de adicionar instâncias e gerenciar usuários.

## 3. Escopo

Delimite o que será desenvolvido nesta versão.

- **Dentro do escopo:** Dashboards de cada componente de hardware, dashboard mais geral dos componentes, dashboard de visão geral de negócio com informações financeiras, tela de login, tela de cadastro de instância,
telas de gerenciamento de usuários, tela de contextualizacao do projeto, monitoramento de instancias da AWS, Dashs personalizadas para personas de cargos distintos dentro da empresa (gestor de infraestrutura/TI e analista de infraestrutura), parte voltada a administrador do Projeto (cadastro de gestores)
- **Fora do escopo:** funcionalidades e recursos que não serão contemplados, instancias nao provisionadas pela AWS para informacao financeira.

## 4. Funcionalidades
- O usuario podera cadastrar uma nova instancia ao instalar o agente de captura localmente, a aplicacao web permitira o cadastro e novos usuarios e cargos por parte do gestor e gerir as suas permissoes. e por parte do administrador do nosso servico, ele podera cadastrar um nobo gestor de uma empresa pela aplicacao


## 5. Regras de negócio

Descreva as condições e restrições que determinam o funcionamento do sistema.
	
Considere campos obrigatórios, validações, dados duplicados e restrições para edição e exclusão.

## 6. Interface

Descreva como o sistema será apresentado e como o usuário deverá interagir com ele.

Considere organização das telas, formulários, botões, filtros, mensagens e identidade visual.

## 7. Critérios de aceitação

Defina condições objetivas para verificar se as funcionalidades foram implementadas corretamente.

- Critério de aceitação 1.
- Critério de aceitação 2.
- Critério de aceitação 3.
