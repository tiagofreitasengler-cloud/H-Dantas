# H'Dantas — Barbearia

Aplicação web full-stack com Next.js, Prisma e SQLite para cadastro de clientes, login, agendamentos, horários, serviços e administração.

## 1. Pré-requisitos
- Node.js 20+
- npm 10+

## 2. Instalação
```bash
npm install
copy .env.example .env
```
No PowerShell, `copy` pode ser substituído por `Copy-Item .env.example .env`.

Edite `.env` e defina uma senha de administrador forte em `ADMIN_PASSWORD` e um segredo longo em `JWT_SECRET`.

## 3. Banco de dados
```bash
npm run db:push
npm run db:seed
```
O banco SQLite será criado em `prisma/dev.db`.

## 4. Executar
```bash
npm run dev
```
Abra `http://localhost:3000`.

## 5. Acesso administrativo
Use `ADMIN_EMAIL` e `ADMIN_PASSWORD` definidos no `.env`. Acesse `/admin-login` para a entrada administrativa. O usuário criado pelo seed aparece com a função ADMIN e também é o barbeiro Pedro Henrique Dantas.

## 6. Como alterar horários
Acesse `/admin/horarios`. É possível adicionar e remover horários por dia da semana e bloquear datas específicas.

## 7. Como alterar serviços e preços
Acesse `/admin/servicos`. É possível cadastrar serviços e ativar/desativar. O preço de `Corte + Barba` é recalculado automaticamente como `Corte de cabelo + Barba` quando esses dois preços-base são alterados.

## 8. Segurança
- Senhas com bcrypt.
- Sessão em cookie HTTP-only com JWT.
- Rotas administrativas protegidas no servidor.
- Validação frontend + backend.
- Restrição de e-mail único.
- Restrição única de `date + time` para impedir dois agendamentos no mesmo horário.
- Disponibilidade é revalidada no servidor antes de criar o agendamento.

## 9. Para produção
Troque SQLite por PostgreSQL e `DATABASE_URL` por uma URL de banco de produção. Use HTTPS, um `JWT_SECRET` aleatório forte, backups e variáveis secretas no provedor de hospedagem.
