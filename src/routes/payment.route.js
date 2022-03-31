const lnurl = require("lnurl-pay");
const express = require("express");
const util = require("../utils/util");

let paymentSchema = require("../model/payments.model");
let articleSchema = require("../model/article.model");

const paymentRoute = express.Router();

paymentRoute.route("/register").post(async (req, res) => {

  try {
    const payment = await paymentSchema.create(req.body);

    const article = await articleSchema.findById(req.body.articleId);

    return util.sendSuccess(res, 201, article);

  }catch (error) {
    return util.sendError(res, 400, error);

  }

});

module.exports = paymentRoute;
