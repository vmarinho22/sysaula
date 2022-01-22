import { Request, Response } from "express";
import {verifyToken} from '../middleware/auth';

import { Class } from "../models/Class";
import { Comment } from "../models/Comment";

export const ClassController = {
    async index(req: Request, res:Response) : Promise<any>{

        // Validação de token
        const token = req.body.token || req.query.token || req.headers["x-access-token"];
        if(!await verifyToken(token)) return res.status(401).json({ status: 0, response: "Usuário não autorizado!" });        

        const { name, description, data_init, data_end, page } = req.query;

        let filter: any = {}

        let filterPage: any = page;

        if (name !== undefined) filter.name = name;
        if (description !== undefined) filter.description = description;
        if (data_init !== undefined) filter.data_init = data_init;
        if (data_end !== undefined) filter.data_end = data_end;

        let skipPage: number = (parseInt(filterPage) -1) * 50;

        try {

            const schemaResult: any = await Class.find(filter).limit(50).skip(skipPage);

               console.log(schemaResult);

            let filteredResult: object[] = [];

            // let commentSchemaResult: any = {};

            // schemaResult.forEach(async (schema: any) => {


            //     filteredResult.push({
            //         id: schema._id,
            //         name: schema.name,
            //         comment: schema.comment,
            //         description:  schema.description,
            //         video:  schema.video,
            //         data_init:  schema.data_init,
            //         data_end:  schema.data_end,
            //         date_create:  schema.date_create,
            //         date_update:  schema.date_update,
            //         total_comments:  schema.total_comments,
            //         last_comment: commentSchemaResult.comment,
            //         last_comment_date:  commentSchemaResult.date_created
            //     });
            // });

            // console.log(filteredResult)

            return res.status(200).json({
                status: 1,
                response: filteredResult,
            });
            

        } catch(err: any){
            return res.status(500).json({
                status: 0,
                response: `Erro ao consultar schema ao banco: ${err}`
            });
        }

    },

    async createClass(req: Request,  res:Response) : Promise<any>{

        // Validação de token
        const token = req.body.token || req.query.token || req.headers["x-access-token"];
        if(!await verifyToken(token)) return res.status(401).json({ status: 0, response: "Usuário não autorizado!" });        

        const { name, description, video, data_init, data_end } = req.body;

        // Validações
        if (!name) return res.status(422).json({ status: 0, response: "O nome é obrigatório!" });
        if (!video) return res.status(422).json({ status: 0, response: "O link do vídeo é obrigatório!" });
        const validateVideoURL = video.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
        if (validateVideoURL == null ) return res.status(422).json({ status: 0, response: "O link do vídeo é invalido!" });
        if (!data_init) return res.status(422).json({ status: 0, response: "A data de inicio da aula é obrigatória!" });
        if (!new Date(data_init).getDate()) return res.status(422).json({ status: 0, response: "Data de inicio da aula invalida!" });
        if (data_end != undefined && !new Date(data_init).getDate()) return res.status(422).json({ status: 0, response: "Data de termino da aula invalida!" });

        const currentDate: Date = new Date();
        
        const newClass: object = {
            name: name,
            description: description,
            video: video,
            data_init: data_init,
            data_end: data_end,
            date_create: currentDate,
            total_comments: 0
        }

        try {

            await Class.create(newClass);

            return res.status(200).json({
                status: 1,
                response: "Aula criado com sucesso!",
            });

        } catch(err: any){
            return res.status(500).json({
                status: 0,
                response: `Erro ao criar documento no banco: ${err}`
            });
        }
    },

    async getClassDetails(req: Request, res:Response) : Promise<any>{
        // Validação de token
        const token = req.body.token || req.query.token || req.headers["x-access-token"];
        if(!await verifyToken(token)) return res.status(401).json({ status: 0, response: "Usuário não autorizado!" });
        
        const { id } = req.params;

        // Validações
        if (!id) return res.status(422).json({ status: 0, response: "ID obrigatório" });

        try {

            const schemaResult: any = await Class.findById(id);

            const formatedResult: object = {
                name: schemaResult.name,
                description:  schemaResult.description,
                video:  schemaResult.video,
                data_init:  schemaResult.data_init,
                data_end:  schemaResult.data_end,
                total_comments:  schemaResult.total_comments,
            }

            // Mostrar os ultimos 3 comentarios

            return res.status(200).json({
                status: 1,
                response: formatedResult,
            });

        } catch(err: any){
            return res.status(500).json({
                status: 0,
                response: `Erro ao consultar schema ao banco: ${err}`
            });
        }
    },

    async updateClassDetails(req: Request, res:Response) : Promise<any> {
        // Validação de token
        const token = req.body.token || req.query.token || req.headers["x-access-token"];
        if(!await verifyToken(token)) return res.status(401).json({ status: 0, response: "Usuário não autorizado!" });        

        const { id ,name, description, video, data_init, data_end } = req.body;
        
        // Validações
        if (!id) return res.status(422).json({ status: 0, response: "ID da aula é obrigatória!" });
        if (video != undefined && video.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g) == null ) return res.status(422).json({ status: 0, response: "O link do vídeo é invalido!" });
        if (data_init != undefined && !new Date(data_init).getDate()) return res.status(422).json({ status: 0, response: "Data de inicio da aula invalida!" });
        if (data_end != undefined && !new Date(data_init).getDate()) return res.status(422).json({ status: 0, response: "Data de termino da aula invalida!" });

        const currentDate: Date = new Date();

        console.log('aqui entrou')

        let filter: any = {}

        if (name !== undefined) filter.name = name;
        if (description !== undefined) filter.description = description;
        if (video !== undefined) filter.video = video;
        if (data_init !== undefined) filter.data_init = data_init;
        if (data_end !== undefined) filter.data_end = data_end;

        if(Object.values(filter).length > 0) {
            try {

                filter.date_update = currentDate;

                await Class.findByIdAndUpdate(id,{$set: filter}, {new: false});
    
                return res.status(200).json({
                    status: 1,
                    response: `Aula ${id} atualizada com sucesso!`,
                });
    
            } catch(err: any){
                return res.status(500).json({
                    status: 0,
                    response: `Erro ao atualizar schema do banco: ${err}`
                });
            }
        }else{
            return res.status(422).json({
                status: 1,
                response: `Nada para ser atualizado`
            });
        } 
        
    },

    async destroyClass(req: Request, res:Response) : Promise<any>{
        // Validação de token
        const token = req.body.token || req.query.token || req.headers["x-access-token"];
        if(!await verifyToken(token)) return res.status(401).json({ status: 0, response: "Usuário não autorizado!" });
        
        const { id } = req.params;

        // Validações
        if (!id) return res.status(422).json({ status: 0, response: "ID obrigatório" });

        try {

            await Class.findByIdAndRemove(id);

            return res.status(200).json({
                status: 1,
                response: `Aula ${id} deletada com sucesso!`,
            });

        } catch(err: any){
            return res.status(500).json({
                status: 0,
                response: `Erro ao consultar schema ao banco: ${err}`
            });
        }
    },

    async createCommentClass(req: Request, res:Response) : Promise<any>{
        // Validação de token
        const token = req.body.token || req.query.token || req.headers["x-access-token"];
        if(!await verifyToken(token)) return res.status(401).json({ status: 0, response: "Usuário não autorizado!" });

        const {id_class, comment} = req.body;

        // Validações
        if (!id_class) return res.status(422).json({ status: 0, response: "O id da aula é obrigatório!" });
        if (!comment) return res.status(422).json({ status: 0, response: "O comentário é obrigatório!" });

        const currentDate: Date = new Date();
        
        const newComment: object = {
            id_class: id_class,
            comment: comment,
            date_create: currentDate,
        }

        try {

            await Comment.create(newComment);

            await Class.findOneAndUpdate({ _id: id_class }, { $inc: { total_comments: 1 }});

            return res.status(200).json({
                status: 1,
                response: "Comentário criado com sucesso!",
            });

        } catch(err: any){
            return res.status(500).json({
                status: 0,
                response: `Erro ao criar comentário no banco: ${err}`
            });
        }
    },

    async listCommentClass(req: Request, res:Response) : Promise<any>{
        // Validação de token
        const token = req.body.token || req.query.token || req.headers["x-access-token"];
        if(!await verifyToken(token)) return res.status(401).json({ status: 0, response: "Usuário não autorizado!" });        

        const { page } = req.query;

        let filterPage: any = page;

        let skipPage: number = (parseInt(filterPage) -1) * 50;

        try {

            const schemaResult: any = await Comment.find().limit(50).skip(skipPage);

            let filteredResult: object[] = [];

            schemaResult.forEach((schema: any) => {
                filteredResult.push({
                    id: schema._id,
                    id_class: schema.id_class,
                    comment: schema.comment,
                    date_created:  schema.date_created,
                });
            });

            return res.status(200).json({
                status: 1,
                response: filteredResult,
            });
            

        } catch(err: any){
            return res.status(500).json({
                status: 0,
                response: `Erro ao consultar schema ao banco: ${err}`
            });
        }
    },

    async destroyCommentClass(req: Request, res:Response) : Promise<any>{
        // Validação de token
        const token = req.body.token || req.query.token || req.headers["x-access-token"];
        if(!await verifyToken(token)) return res.status(401).json({ status: 0, response: "Usuário não autorizado!" });
        
        const { id } = req.params;

        // Validações
        if (!id) return res.status(422).json({ status: 0, response: "ID obrigatório" });

        try {

            await Comment.findByIdAndRemove(id);

            return res.status(200).json({
                status: 1,
                response: `Comentário ${id} deletada com sucesso!`,
            });

        } catch(err: any){
            return res.status(500).json({
                status: 0,
                response: `Erro ao consultar schema ao banco: ${err}`
            });
        }
    },
    
}