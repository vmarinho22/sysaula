
# Sysaula - API para sistema de aulas

Uma API construida com NodeJS, Typescript, MongoDB e Cypress para o desafio do: Desenvolvedor: Backend

[![MIT License](https://img.shields.io/apm/l/atomic-design-ui.svg?)](https://github.com/tterb/atomic-design-ui/blob/master/LICENSEs)

# Sobre o projeto

Nome: Vinicius Marinho

Email: [viniciusmarinho1616@gmail.com](mailto:viniciusmarinho1616@gmail.com)

Telefone: [(12) 98803-1418](tel:12988031418)

Github: [dinoMarinho](https://github.com/dinoMarinho)

Linkedin: [vinicius-marinho-690207162](https://www.linkedin.com/in/vinicius-marinho-690207162/)


Está API foi desenvolvida utilizando o framework [Express](https://expressjs.com), que facilita todo a estrutura de middlewares e rotas para utilização de métodos HTTP.

Também foi utilizando a biblioteca [Mongoose](https://mongoosejs.com/), é uma biblioteca do Nodejs que proporciona uma solução baseada em esquemas para modelar os dados da sua aplicação, que facilita a manipulação de schemas através de models.

Para realização dos testes unitários, foi utilizado a biblioteca [Cypress](https://www.cypress.io/), que é uma plataforma Javascript para testes end-to-end, com uma interface poderosa e bem explicativa, além de facíl compreensão dos resultados

**Sobre o Deploy da Aplicação na AWS**

Não tenho muita experiência em deploy com AWS, mas com toda certeza utilizaria a tecnologia dos Containers para realizar esse deploy, como Docker e Kubernets, para mantém minha aplicação isolada com alta performance. Mas segundo minhas pesquisas, o melhor ambiente para realizar esse deploy é utilizar **AWS EC2**, pois é uma ambiente elástico com memória RAM dedicada, ambiente pronto para receber imagens de container, com SSH já integrado e um deploy realtivamento simples, bastando subir o build da aplicação!


## Stack utilizada

**Back-end:** NodeJS, Express, Typescript, Bcrypt, Cors, DotEnv, JsonWebToken, Mongoose, Morgam, Nodemon, TS-Node.

**Banco de Dados:** MongoDB

**Testes:** Cypress


## Rodando localmente

**Subindo o servidor da API**

Primeiramente você deve ter o **NodeJS, NPM e MongoDB** instalados em sua maquina para executar o projeto localmente.

*(Recomendação MongoDB: Utilizar o Robo 3T para ver os registros do banco)

Agora clone o projeto:

```bash
  git clone https://gitlab.com/dinoMarinho/sysaulas.git
```

Entre no diretório do projeto

```bash
  cd sysaulas
```

Clone o arquivo ".env-example" e renomeio para ".env", e preencha as informações relacionadas a conexão do banco

Execute o comando de instalação das depêndencias do projeto:

```bash
  npm i
```

Inicie o servidor local com o seguinte comando:

```bash
  npm run dev
```
Pronto, agora seu servidor API está online na porta 3500!

Vá ao seu banco de dados, acesse a colletion persons e insira o usuário administrador do sistema, como no exemplo abaixo:

```json
{
    "name" : "Admin",
    "email" : "admin@sysaula.com.br",
    "password" : "senha123",
}
```

Finalizando esse processo, você está pronto para acessar a API!

**Subindo e executando o servidor de testes**

Agora clone o projeto:

```bash
  git clone https://gitlab.com/dinoMarinho/sysaulas.git
```

Entre no diretório do projeto

```bash
  cd sysaulas
```

Modifique as informações contidas no arquivo cypress.json, com as informações do usuário de administração criadas por você!
```json
{
    "env": {
        "url": "http://localhost:3500/",
        "login": "admin@sysaula.com.br",
        "password": "teste123",
        "page": 1
    }
}
```
Sendo page o parametro utilizado nas páginações dos retornos das pesquisas de aulas e comentários.

Execute o comando de instalação das depêndencias do projeto:

```bash
  npm i
```

Inicie o servidor local com o seguinte comando:

```bash
  npm run test
```

Logo, deve aparecer a tela de interações do cypress, similar a imagem abaixo:

![Screenshot](https://i.pinimg.com/564x/5c/d3/4e/5cd34e9fd13f80bf314764425597151e.jpg)

Então você deve clicar sobre o `user.spec.js`, que abrirá uma guia do chrome controlada pelo cypress com os testes rodando em tempo real e com os resultados, como na tela abaixo: 

![Screenshot](https://i.pinimg.com/564x/d9/b4/ff/d9b4ff7f6f69d8ed65e8143ace35ccd6.jpg)
## Documentação da API

A API se autentica através de um TOKEN JWT, passado utilizando um Bearer token no **header**, **Com execessão da rota de autenticar usuário, todas as rotas necessitam do token de autenticação, então não se esqueça de enviar ele no header como no exemplo abaixo:**

| Parâmetro   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
| `authorization` | `string` | **Obrigatório!** Bearer {token} |


**Home**

#### Status da API

```http
  GET /
```

| Parâmetro   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |

Retorno: Retorno do status da API

**Usuários**

#### Autenticar Usuários

```http
  POST /users
```

| Parâmetro   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
| `email` | `string` | **Obrigatório**. Email do usuário |
| `password` | `string` | **Obrigatório**. Senha do usuário |

Retorno: Status e response com token para utilizar nas outras requisições

#### Criar usuário

```http
  POST /users/create
```

| Parâmetro   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
| `name` | `string` | **Obrigatório** Nome do usuário |
| `email` | `string` | **Obrigatório** Email do usuário |
| `password` | `string` | **Obrigatório** Senha do usuário |

Retorno: Status e response avisando sobre a criação do usuário

**Aulas**

#### Criar aula

```http
  POST /classes
```

| Parâmetro   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
| `name` | `string` | **Obrigatório** Título da aula |
| `description` | `string` | **Obrigatório** Descrição da aula |
| `video` | `string` | **Obrigatório** Link da aula |
| `data_init` | `Date` | **Obrigatório** Data de inicio da aula(yyyy-mm-dd) |
| `data_end` | `Date` | Data de encerramento da aula(yyyy-mm-dd) |

Retorno: Status e response avisando sobre a criação da aula

#### Buscar aulas

```http
  GET /classes
```

| Parâmetro   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
| `page` | `integer` | **Obrigatório** Número da página a ser retornada |
| `name` | `string` |  Título da aula |
| `description` | `string` |  Descrição da aula |
| `video` | `string` |  Link da aula |
| `data_init` | `date` | Data de inicio da aula(yyyy-mm-dd) |
| `data_end` | `date` | Data de encerramento da aula(yyyy-mm-dd) |

Retorno: Status e response com as informações das aulas

#### Buscar detalhes de uma aula

```http
  GET /classes/:id
```

| Parâmetro   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
| `id` | `string` | **Obrigatório** ID da aula |


Retorno: Status e response com as informações das aula

#### Deletar aula

```http
  DELETE /classes/:id
```

| Parâmetro   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
| `id` | `string` | **Obrigatório** ID da aula |


Retorno: Status e response avisando que a aula foi deletada!

#### Atualizar detalhes de aula

```http
  PUT /classes
```

| Parâmetro   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
| `id` | `integer` | **Obrigatório** ID da aula|
| `name` | `string` |  Título da aula |
| `description` | `string` |  Descrição da aula |
| `video` | `string` |  Link da aula |
| `data_init` | `date` | Data de inicio da aula(yyyy-mm-dd) |
| `data_end` | `date` | Data de encerramento da aula(yyyy-mm-dd) |

Retorno: Status e response avisando da atualização da aula

**Comentários**

#### Criar comentário

```http
  POST /classes/comments
```

| Parâmetro   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
| `id_class` | `string` | **Obrigatório** ID da aula que o comentário foi realizado |
| `comment` | `string` | **Obrigatório** Texto do comentário |

Retorno: Status e response avisando sobre a criação do comentário

#### Buscar comentários

```http
  GET /classes/comments
```

| Parâmetro   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
| `page` | `integer` | **Obrigatório** Número da página a ser retornada |

Retorno: Status e response com todos os comentários

#### Deletar comentário

```http
  DELETE /classes/comments/:id
```

| Parâmetro   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
| `id` | `string` | **Obrigatório** ID do comentário |


Retorno: Status e response avisando que o comentário foi deletado!





## Referência

 - [NodeJS](https://nodejs.org/en/)
 - [Cypress](https://www.cypress.io/)
 - [Typescript](https://www.typescriptlang.org/)
 - [Bcrypt](https://www.npmjs.com/package/bcrypt)
 - [Cors](https://www.npmjs.com/package/cors)
 - [DotEnv](https://www.npmjs.com/package/dotenv)
 - [JsonWebToken](https://www.npmjs.com/package/jsonwebtoken)
 - [MongoDB](https://www.mongodb.com/)
 - [Mongoose](https://mongoosejs.com/)
 - [Morgam](https://www.npmjs.com/package/morgan)
 - [Nodemon](https://www.npmjs.com/package/nodemon)
 - [TS-Node](https://www.npmjs.com/package/ts-node)

