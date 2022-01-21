import { Request, Response } from "express";
import * as bcrypt from 'bcrypt';
import * as jwt from "jsonwebtoken";

import { Person } from "../models/User";


export const UsersController = {
    async index(req: Request, res:Response) {

        const { email, password } = req.body;
        
        const userInfos: any = await Person.findOne({email});

        // Validação de existencia de usuário
        if(userInfos===null || userInfos.length === 0) res.status(404).json({ status: 0, response: "Usuário não encontrado" });

        const hashedPassword: string = userInfos.password;

        // Verifica a senha
        await bcrypt.compare(password, hashedPassword).then(function(result) {
            if(result) {

                // Cria o token
                const token: string = jwt.sign({ user: email},process.env.SECRET || '', {
                    expiresIn: "1h",
                });

                res.status(200).json({
                    status: 1,
                    response: "Usuário logado com sucesso",
                    token: token
                });
            }else{
                res.status(403).json({
                    status: 0,
                    response: "O usuário e a senha não coincidem!"
                });
            }
        });
    },

    async createUser(req: Request, res: Response) {

        const { name, email, password } = req.body;

        // Validações
        if (!name) res.status(422).json({ status: 0, response: "O nome é obrigatório!" });
        if (!email) res.status(422).json({ status: 0, response: "O email é obrigatório!" });
        if (email.indexOf('@')==-1 || email.indexOf('.')==-1) res.status(422).json({ status: 0, response: "E-mail invalido!" });
        if (!password) res.status(422).json({ status: 0, response: "A senha é obrigatória!" });

        // Criando Hash para senha
        const saltRounds = 10;
        const hashPassword = await bcrypt.hash(password, saltRounds);

        try{

            const userExist: any = await Person.findOne({email});

            // Validação de existencia de usuário
            if(userExist!= null || userExist.length > 0) res.status(409).json({ status: 0, response: "Usuário já existe. Por favor faça login!" });

            // Criando dados no banco
            await Person.create({
                name: name,
                email: email.toLowerCase(),
                password: hashPassword
            });

            res.status(201).json({
                status: 1,
                response: "Pessoa cadastrado com sucesso"
            });
        } catch(err: any){
            res.status(500).json({
                status: 0,
                response: `Erro ao inserir entidade ao banco: ${err}`
            });
        }
    },
    
} 