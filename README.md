[![Build Status](https://travis-ci.com/magujun/ignite-nodejs-desafio-7.svg?branch=main)](https://travis-ci.com/magujun/ignite-nodejs-desafio-7)

# 💻 Rocketseat's Ignite - Trilha Node.js

## [Desafio 7](https://www.notion.so/Desafio-01-Testes-unit-rios-0321db2af07e4b48a85a1e4e360fcd11) + [Desafio 8](https://www.notion.so/Desafio-02-Testes-de-integra-o-70a8af48044d444cb1d2c1fa00056958) 🚀

## Sobre os desafios
Nesses desafios, serão criados testes unitários e de integração para uma aplicação já pronta (FinAPI) usando tudo que aprendeu até agora sobre testes.

## Testes
UNIT | INT

[✓] | [✓] Create User

[✓] | [✓] Authenticate User

[✓] | [✓] Show User Profile 

[✓] | [✓] Create Statement 

[✓] | [✓] Show account balance 

[✓] | [✓] Show statement operation 

#
<details>

<summary>Rotas da aplicação</summary>

<details>
<summary>POST `/api/v1/users`</summary>

A rota recebe `name`, `email` e `password` dentro do corpo da requisição, salva o usuário criado no banco e retorna uma resposta vazia com status `201`.</details>

<details>
<summary>POST `/api/v1/sessions`</summary>

A rota recebe `email` e `password` no corpo da requisição e retorna os dados do usuário autenticado junto à um token JWT.
Essa aplicação não possui refresh token, ou seja, o token criado dura apenas 1 dia e deve ser recriado após o período mencionado.</details>

<details>
<summary>GET `/api/v1/profile`</summary>

A rota recebe um token JWT pelo header da requisição e retorna as informações do usuário autenticado.</details>
<details>
<summary>GET `/api/v1/statements/balance`</summary>

A rota recebe um token JWT pelo header da requisição e retorna uma lista com todas as operações de depósito e saque do usuário autenticado e também o saldo total numa propriedade `balance`.</details>

<details>
<summary>POST `/api/v1/statements/deposit`</summary>

A rota recebe um token JWT pelo header e `amount` e `description` no corpo da requisição, registra a operação de depósito do valor e retorna as informações do depósito criado com status `201`.</details>

<details>
<summary>POST `/api/v1/statements/withdraw`</summary>

A rota recebe um token JWT pelo header e `amount` e `description` no corpo da requisição, registra a operação de saque do valor (caso o usuário possua saldo válido) e retorna as informações do saque criado com status `201`.</details>

<details>
<summary>GET `/api/v1/statements/:statement_id`</summary>

A rota recebe um token JWT pelo header e o id de uma operação registrada (saque ou depósito) na URL da rota e retorna as informações da operação encontrada.</details>
</details>
