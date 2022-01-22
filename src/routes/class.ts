import { Router } from "express";
import {verifyToken} from '../middleware/auth';

import {ClassController} from '../controllers/ClassController';

export const routerClasses = Router();

// Class

routerClasses.route('/')
        .all(verifyToken)
        .get(ClassController.index)
        .post(ClassController.createClass)
        .put(ClassController.updateClassDetails);

routerClasses.route('/comments')
        .all(verifyToken)
        .post(ClassController.createCommentClass)
        .get(ClassController.listCommentClass);

routerClasses.route('/comments/:id')
        .all(verifyToken)
        .delete(ClassController.destroyCommentClass);

routerClasses.route('/:id')
        .all(verifyToken)
        .get(ClassController.getClassDetails)
        .delete(ClassController.destroyClass);