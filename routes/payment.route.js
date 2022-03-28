const lnurl = require("lnurl-pay");
const express = require("express");
const util = require("../utils/util");

let paymentSchema = require("../model/payments.model");
let articleSchema = require("../model/article.model");

const paymentRoute = express.Router();

paymentRoute.route("/register").post((req, res) => {
  
  paymentSchema.create(req.body, (error, data) => {
    if (error) {
      return util.sendError(res, 400, error);
    } else {
      articleSchema.findById(req.body.articleId, (error, resp) => {
        if (error) {
          return util.sendError(res, 400, error);
        } else {
          let articleData = {
            articleId: req.body.articleId,
            author: req.body.lnAddress,
            userLnAddress: req.query.address
          }
          return util.sendSuccess(res, 201, resp);
        }
      });
    }
  });
});

module.exports = paymentRoute;
