const lnurl = require('lnurl-pay');
const express = require('express');
const util = require('../utils/util');

let articleSchema = require('../model/article.model');
let paymentSchema = require('../model/payments.model');


const userRoute = express.Router();


userRoute.route('/articles').get(async (req, res) => {

    try {
        const authorArticles = await articleSchema.find({ author: req.query.address });

        return util.sendSuccess(res, 200, authorArticles);
        
    } catch (error) {
        return util.sendError(res, 400, error);
    }
});


userRoute.route('/mypaid/articles').get(async (req, res) => {

    try {
        let paidArticles = [];

        const articles = await paymentSchema.find({ lnAddress: req.query.address });

        for (let article of articles) {
            let returnedArticle = await articleSchema.findById(article.articleId);

            paidArticles.push(returnedArticle);
        }

        return util.sendSuccess(res, 200, paidArticles);

    } catch (error) {
        return util.sendError(res, 400, error);
    }
});


module.exports = userRoute;