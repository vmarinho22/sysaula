import { Router } from "express";

import {ClassController} from '../controllers/ClassController';

export const routerClasses = Router();

// Class

routerClasses.route('/')
        .get(ClassController.index)
        .post(ClassController.createClass)
        .put(ClassController.updateClassDetails);

routerClasses.route('/comments')
        .post(ClassController.createCommentClass)
        .get(ClassController.listCommentClass);

routerClasses.route('/comments/:id')
        .delete(ClassController.destroyCommentClass);

routerClasses.route('/:id')
        .get(ClassController.getClassDetails)
        .delete(ClassController.destroyClass);