const express = require("express");

const util = require("../utils/util");

const paymentSchema = require('../model/payments.model');
const articleSchema = require('../model/article.model');

const dashboardRoute = express.Router();

dashboardRoute.route("/").get(async (req, res) => {

    const address = req.query.address

    try {
        const myArticles = await articleSchema.find({author: address});

        let count = 0;
        let subscribedUsers = 0;


        for (let article of myArticles) {

            let returnedArticle = await paymentSchema.find({articleId: article.articleId});

            if(returnedArticle){
                count += 1;
                subscribedUsers += 1;
            }
        }

        const subscriptionAmount = count * 10;

        const result = {
            subscriptions: count,
            subscribers: subscribedUsers,
            subscriptionAmount,
        }
        return util.sendSuccess(res, 200, result);
        
    } catch (error) {
        return util.sendError(res, 400, error)
        
    }

    
    
})

module.exports = dashboardRoute;