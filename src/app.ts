import express from "express";
import cors from "cors";
import logger from "morgan";

import { routerIndex } from './routes/index';
import { routerUsers } from './routes/user';

require('dotenv').config();

// Cria o app
export const app = express();

// Configuração dos middlewares
app.use(express.json());
app.use(cors());
app.use(logger('dev')); 

// Rotas
app.use('/', routerIndex);
app.use('/users', routerUsers);