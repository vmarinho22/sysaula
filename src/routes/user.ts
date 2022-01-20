import { Router } from "express";

import Users from '../controllers/UsersController';

export const routerUsers = Router();

routerUsers.get('/', Users.index );