const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let articleSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    bodyContent: {
        type: String,
        required: true,
        trim: true,
    },
    image: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    created: {
        type: Date,
        default: Date.now
    },
    updated: {
        type: Date,
        default: Date.now
    },
},
    {
        collection: 'articles'
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('articleSchema', articleSchema)