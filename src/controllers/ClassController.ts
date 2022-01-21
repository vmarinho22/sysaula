import { Request, Response } from "express";

export const ClassController = {
    index(req: Request, res:Response) {
        res.status(200);
        res.json({
            status: 1,
            response: "Rotas Aulas"
        });
    },

    createClass(req: Request, res:Response) {
        res.status(200);
        res.json({
            status: 1,
            response: "Criar Aula"
        });
    },

    listClasses(req: Request, res:Response) {
        res.status(200);
        res.json({
            status: 1,
            response: "Listar Aulas"
        });
    },

    getClassDetails(req: Request, res:Response) {
        res.status(200);
        res.json({
            status: 1,
            response: "Listar Aulas"
        });
    },

    updateClassDetails(req: Request, res:Response) {
        res.status(200);
        res.json({
            status: 1,
            response: "Atualizar aulas"
        });
    },

    destroyClass(req: Request, res:Response) {
        res.status(200);
        res.json({
            status: 1,
            response: "Atualizar aulas"
        });
    },

    createCommentClass(req: Request, res:Response) {
        res.status(200);
        res.json({
            status: 1,
            response: "Atualizar aulas"
        });
    },

    listCommentClass(req: Request, res:Response) {
        res.status(200);
        res.json({
            status: 1,
            response: "Atualizar aulas"
        });
    },

    destroyCommentClass(req: Request, res:Response) {
        res.status(200);
        res.json({
            status: 1,
            response: "Atualizar aulas"
        });
    },
    
} 