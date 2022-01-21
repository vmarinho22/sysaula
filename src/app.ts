import express from "express";
import cors from "cors";
import logger from "morgan";
import mongoose from 'mongoose';

import { routerIndex } from './routes/index';
import { routerUsers } from './routes/user';
import { routerClasses } from './routes/class';

require('dotenv').config();

// Cria o app
export const app: any = express();

// Configuração dos middlewares
app.use(express.json());
app.use(cors());
app.use(logger('dev'));

const dbUser: string | undefined = process.env.DB_NAME || '';
const dbLink: string | undefined = process.env.DB_LINK || '';

mongoose.connect(dbLink + dbUser)
.then(() => {
    console.log("Banco conectado com sucesso!");
}) 
.catch((err) => {
    console.log("Erro ao conectar ao banco", err);
});

// Rotas
app.use('/', routerIndex);
app.use('/users', routerUsers);
app.use('/classes', routerClasses);