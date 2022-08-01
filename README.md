# FORMULÁRIO MULTI STEP - BACKEND(API)

Projeto criado com Node.Js

## Instruções para rodar o projeto na sua própria máquina.

### `git clone`

Clone este repositório.

### `npm install`

Intala todas as dependências do projeto.

### `nodemon start`

Roda o projeto na porta http://localhost:5000

### `rotas`

- "/checkemail/:id" - "PUT". Verifica no banco de dados se o email está disponível para cadastro de novo usuário.
- "/cadastrar" - "POST". Registra um novo usuário.
- "/login" - "POST". Login de usuário.
- "/:id" - "POST". Atualiza dados do usuário.
- "/:id" - "DELETE". Delete o usuário.

**Nota: Você pode fazer as requisições pelo Insomina/Postman ou pelo frontend da aplicação. Ver: https://github.com/jefersonPMatos/form-multipart/tree/master/form-multstep-frontend **
