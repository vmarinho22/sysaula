import { Router } from "express";
import {verifyToken} from '../middleware/auth';

import {UsersController} from '../controllers/UsersController';

export const routerUsers = Router();

// Users
routerUsers.route('/')
        .post(UsersController.index);

routerUsers.route('/create')
        .all(verifyToken)
        .post(UsersController.createUser);

