import mongoose from 'mongoose';

export const Class: any = mongoose.model('Classes', new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    video: {
        type: String,
        required: true
    },
    data_init: {
        type: Date, 
        default: Date.now,
        required: true
    },
    data_end:  {
        type: Date, 
        default: Date.now,
    },
    date_create:  {
        type: Date, 
        default: Date.now,
        required: true
    },
    date_update:  {
        type: Date, 
        default: Date.now
    },
    total_comments:  {
        type     : Number,
        required : true,
    }
}));