import { Router } from "express";

import {UsersController} from '../controllers/UsersController';
import {ClassController} from '../controllers/ClassController';

export const routerUsers = Router();

// Users
routerUsers.post('/', UsersController.index);

// Class
routerUsers.post('/', ClassController.createClass);
routerUsers.get('/', ClassController.listClasses);
routerUsers.get('/:id', ClassController.getClassDetails);
routerUsers.put('/:id', ClassController.updateClassDetails);
routerUsers.delete('/:id', ClassController.destroyClass);
routerUsers.post('/comments', ClassController.createCommentClass);
routerUsers.get('/comments', ClassController.listCommentClass);
routerUsers.delete('/comments', ClassController.destroyCommentClass);
