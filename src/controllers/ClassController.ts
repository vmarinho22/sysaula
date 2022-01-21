import { Request, Response } from "express";
import {verifyToken} from '../middleware/auth';

export const ClassController = {
    async index(req: Request, res:Response) {

        const token = req.body.token || req.query.token || req.headers["x-access-token"];
        if(!await verifyToken(token)) return res.status(401).json({ status: 0, response: "Usuário não autorizado!" });        

    },

    async createClass(req: Request,  res:Response) {
        res.status(200);
        res.json({
            status: 1,
            response: "Criar Aula"
        });
    },

    async listClasses(req: Request, res:Response) {
        res.status(200);
        res.json({
            status: 1,
            response: "Listar Aulas"
        });
    },

    async getClassDetails(req: Request, res:Response) {
        res.status(200);
        res.json({
            status: 1,
            response: "Listar Aulas"
        });
    },

    async updateClassDetails(req: Request, res:Response) {
        res.status(200);
        res.json({
            status: 1,
            response: "Atualizar aulas"
        });
    },

    async destroyClass(req: Request, res:Response) {
        res.status(200);
        res.json({
            status: 1,
            response: "Atualizar aulas"
        });
    },

    async createCommentClass(req: Request, res:Response) {
        res.status(200);
        res.json({
            status: 1,
            response: "Atualizar aulas"
        });
    },

    async listCommentClass(req: Request, res:Response) {
        res.status(200);
        res.json({
            status: 1,
            response: "Atualizar aulas"
        });
    },

    async destroyCommentClass(req: Request, res:Response) {
        res.status(200);
        res.json({
            status: 1,
            response: "Atualizar aulas"
        });
    },
    
}