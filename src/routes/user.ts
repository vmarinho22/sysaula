import { Router } from "express";

import {UsersController} from '../controllers/UsersController';

export const routerUsers = Router();

// Users
routerUsers.post('/', UsersController.index);
routerUsers.post('/create', UsersController.createUser);

