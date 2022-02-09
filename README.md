<p align="center">
  <h3 align="center">Clina Care Challenge</h3>
  <p align="center">
    Backend para Serviço de Agendamento de Salas
  </p>
  <p align="center">
    <a href="https://www.typescriptlang.org/">
      <img src="https://img.shields.io/badge/MADE%20WITH-TypeScript-007acc?style=for-the-badge&labelColor=35495d" alt="Built with TypeScript">
    </a>
    <a href="https://nodejs.org/">
      <img src="https://img.shields.io/badge/Node-7ac024?style=for-the-badge&labelColor=35495d" alt="Built with NodeJS">
    </a>
  </p>
</p>


<!-- TABLE OF CONTENTS -->

## Índice

- [Índice](#Ídice)
- [Introdução](#Introdução)
- [Começando](#Começando)
  - [Pré-requisitos](#Pré-requisitos)
  - [Instalação Uso](#Instalação-E-Uso)
    - [Uso Via NPM](#Uso-Via-NPM)
    - [Via Docker](#Via-Docker)
    - [Uso da API](#Uso-da-API)
- [Prisma](#Prisma)
- [Swagger](#Swagger)


<!-- ABOUT THE PROJECT -->

## Introdução

Esse projeto, foi feito utilizando NodeJs e TypeScript, Postgresql.
Bibliotecas para auxiliar na produção do projeto.
A arquitetura utilizada foi Hexagonal, não só por conforto, e sim pela facilidade de implementar entidades e features.
- [Arquitetura](#Arquitetura)

## Começando

A Aplicação utiliza Docker para facilitar a compilação do ambiente de desenvolvimento em qualquer máquina. Para rodar o projeto basta buildar a imagem.
Como outra alternativa, é possível rodar o projeto sem a utilização do Docker.


#### Pré-requisitos

`npm` ou `Docker` instaldo em sua máquina.

#### Instalação-E-Uso

Clone o repositório

```sh
git clone `https://github.com/tiagocsl/Clina-Challenge.git`
cd Clina-Challenge
```

##### Uso-Via-NPM

Install npm dependencies
```sh
npm i
```

Buildar App e Prisma Generate
```sh
npm run-script build
```

Subir Migrations e Inicilizar App
```sh
npm run-script build::start
```

Modo DEV
```sh
npm run-script dev
```

##### Via-Docker

Criar imagem do App e Inicializar Containers
```sh
docker-compose up
```

##### Uso-da-API

Indenpendente do metódo escolhido para o build do app,
a API estará disponível em `localhost:3000`.
Há um endpoint para o Swagger, `/docs`, ou seja, `localhost:3000/docs`.
O endpoint base para usufruto da API, `/api`, ou seja, `localhost:3000/api`.
Há collections para adiantar o uso dos endpoints, seja via Postman ou Insomnia.

### Prisma

Ao alterar algo no arquivo scheme.prisma, execute os seguintes comandos:
```sh
npx prisma generate
npx prisma migrate dev --name `{NOME DA MIGRATION}`
```

### Swagger

Para gerar um arquivo JSON de configuração do Swagger:
```sh
npm run swagger-autogen
```

## Arquitetura
<small>Estrutura de pastas v2.0:</small>
````````
/
|
|   tsconfig.json
|   README.md
|   package.json
|   nodemon.json
|   index.ts
|   Dockerfile
|   docker-compose
|   .gitignore
|   .dockerignore
|   
\---swagger
|   |   
|   |---swagger.json
|   |---swagger.js
|
\---prisma
|   |   
|   |---schema.prisma
|   |---prismaClient.ts
|   \---migrations
|       |---{migration}
|
\---src
|   |
|   \---domain
|   |   |   
|   |   \---user 
|   |   |   |---user.ts
|   |   |   |---service.ts
|   |   |   |---port.ts
|   |   |
|   |   \---schedule   
|   |   |   |---schedule.ts
|   |   |   |---service.ts
|   |   |   |---port.ts
|   |   |
|   |   \---room
|   |   |   |---room.ts
|   |   |   |---service.ts
|   |   |   |---port.ts
|   |             
|   \---adapter
|   |   |   
|   |   \---storage
|   |   |   \---postgres
|   |   |       |---service.ts
|   |   | 
|   |   \---http
|   |   |   \---rest
|   |   |       |---router.ts
|   |   |       |---user.ts
|   |   |       |---schedule.ts
|   |   |       |---room.ts
|   |   |
|   |   \---cryptor
|   |   |   \---bcrypt
|   |   |       |---encryptor.ts
|   |   | 
|   |   \---authenticator
|   |   |   \---passport
|   |   |   |   |---passport.ts
|   |   |   |
|   |   |   \---jwt
|   |   |       |---authenticator.ts      
````````  

