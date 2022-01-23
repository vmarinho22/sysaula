import mongoose from 'mongoose';

export const Person: any = mongoose.model('Persons', new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
}));

Person.create({
    "name": "Super admin",
    "email": "admin@sysaula.com.br",
    "password": "teste123"
});