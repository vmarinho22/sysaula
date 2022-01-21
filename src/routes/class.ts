import { Router } from "express";

import {ClassController} from '../controllers/ClassController';

export const routerClasses = Router();

// Class
routerClasses.get('/', ClassController.index);
routerClasses.post('/', ClassController.createClass);
routerClasses.get('/', ClassController.listClasses);
routerClasses.get('/:id', ClassController.getClassDetails);
routerClasses.put('/:id', ClassController.updateClassDetails);
routerClasses.delete('/:id', ClassController.destroyClass);
routerClasses.post('/comments', ClassController.createCommentClass);
routerClasses.get('/comments', ClassController.listCommentClass);
routerClasses.delete('/comments', ClassController.destroyCommentClass);
