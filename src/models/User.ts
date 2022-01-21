import mongoose from 'mongoose';

export const Person: any = mongoose.model('Persons', new mongoose.Schema({
    name: String,
    email: String,
    password: String,
}));