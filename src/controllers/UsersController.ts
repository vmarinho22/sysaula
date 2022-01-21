import { Request, Response } from "express";

export const UsersController = {
    index(req: Request, res:Response) {
        res.send('Rotas do usuário');
    },
    
} 