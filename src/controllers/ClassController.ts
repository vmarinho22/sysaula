import { Request, Response } from "express";
import {verifyToken} from '../middleware/auth';

import { Types } from 'mongoose';

import { Class } from "../models/Class";
import { Comment } from "../models/Comment";

export const ClassController = {

    async index(req: Request, res:Response) : Promise<any>{    

        const { name, description, data_init, data_end, page } = req.query;

        let filter: any = {}

        let filterPage: any = page || 1;

        if (name !== undefined) filter.name = name;
        if (description !== undefined) filter.description = description;
        if (data_init !== undefined) filter.data_init = data_init;
        if (data_end !== undefined) filter.data_end = data_end;

        let skipPage: number = (parseInt(filterPage) -1) * 50;

        try {

            const schemaResult: any = await Class.aggregate([
                {$match:filter},
                { $sort: { date_created: -1 } },
                {
                    $lookup: {
                        from: "comments",
                        localField: '_id',
                        foreignField: 'id_class',
                        as: 'comments',
                        pipeline: [
                            { $sort: { date_created: -1 }} ,
                            { $limit: 1} 
                        ]
                    }
                },
                { $limit : 50 },
                { $skip: skipPage}
            ]);

            let filteredResult: object[] = [];

            let commentSchemaResult: any = {};

            schemaResult.forEach(async (schema: any) => {

                commentSchemaResult = schema.comments[0];
                commentSchemaResult = (commentSchemaResult != undefined) ? commentSchemaResult : commentSchemaResult = { comment: 'Nenhum comentário cadastrado', date_created: 'null'};

                filteredResult.push({
                    id: schema._id,
                    name: schema.name,
                    comment: schema.comment,
                    description:  schema.description,
                    video:  schema.video,
                    data_init:  schema.data_init,
                    data_end:  schema.data_end,
                    date_create:  schema.date_create,
                    date_update:  schema.date_update,
                    total_comments:  schema.total_comments,
                    last_comment: commentSchemaResult.comment,
                    last_comment_date:  commentSchemaResult.date_created
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

    async createClass(req: Request,  res:Response) : Promise<any>{
    

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
        
        const { id } = req.params;

        let objectId: object = new Types.ObjectId(id);

        // Validações
        if (!id) return res.status(422).json({ status: 0, response: "ID obrigatório" });

        try {

            // const schemaResult: any = await Class.findById(id);

            const schemaResult: any = await Class.aggregate([
                {$match: {_id: objectId}},
                {
                    $lookup: {
                        from: "comments",
                        localField: '_id',
                        foreignField: 'id_class',
                        as: 'comments',
                        pipeline: [
                            { $sort: { date_created: -1 }} ,
                            { $limit: 3} 
                        ]
                    }
                },
            ]);

            const resultSchema: any = schemaResult[0];
            
            const comments: any = resultSchema.comments;
            const commentsFilter: string[] = [];

            if(comments != undefined && comments.length > 0) {
                comments.forEach((comment: any) => {
                    commentsFilter.push(comment.comment);
                });
            }else{
                commentsFilter.push('Nenhum comentário cadastrado!'
                );
            }

            const formatedResult: object = {
                name: resultSchema.name,
                description:  resultSchema.description,
                video:  resultSchema.video,
                data_init:  resultSchema.data_init,
                data_end:  resultSchema.data_end,
                total_comments:  resultSchema.total_comments,
                comments: commentsFilter
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

        const { id ,name, description, video, data_init, data_end } = req.body;
        
        // Validações
        if (!id) return res.status(422).json({ status: 0, response: "ID da aula é obrigatória!" });
        if (video != undefined && video.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g) == null ) return res.status(422).json({ status: 0, response: "O link do vídeo é invalido!" });
        if (data_init != undefined && !new Date(data_init).getDate()) return res.status(422).json({ status: 0, response: "Data de inicio da aula invalida!" });
        if (data_end != undefined && !new Date(data_init).getDate()) return res.status(422).json({ status: 0, response: "Data de termino da aula invalida!" });

        const currentDate: Date = new Date();

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

        const { page } = req.query;

        let filterPage: any = page || 1;

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
        
        const { id } = req.params;

        // Validações
        if (!id) return res.status(422).json({ status: 0, response: "ID obrigatório" });

        try {

            const getIdClass : any = await Comment.findById(id);

            const idClass = getIdClass.id_class;

            await Comment.findByIdAndRemove(id); 

            await Class.findOneAndUpdate({ _id: idClass }, { $inc: { total_comments: -1 }});

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