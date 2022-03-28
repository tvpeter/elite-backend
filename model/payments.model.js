const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let paymentSchema = new Schema({
    articleId: {
        type: String,
        required: true,
        trim: true,
    },
    lnAddress: {
        type: String,
        required: true,
        trim: true,
    },
    hash: {
        type: String,
        trim: true,
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
        collection: 'payments'
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('paymentSchema', paymentSchema)