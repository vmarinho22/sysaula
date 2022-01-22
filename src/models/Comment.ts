import mongoose from 'mongoose';

export const Comment: any = mongoose.model('Comments', new mongoose.Schema({
    id_class: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    date_created: {
        type: Date, 
        default: Date.now,
        required: true
    },
}));