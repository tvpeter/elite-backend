const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");
const lnurl = require("lnurl-pay");

const util = require("../utils/util");
let articleSchema = require("../model/article.model");
let paymentSchema = require("../model/payments.model");
let validate = require('../middlewares/validator');
let createArticle = require('../validation/articleValidator');

dotenv.config();
const articleRoute = express.Router();

const imageUpload = multer({
  dest: "images",
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API,
  api_secret: process.env.CLOUDINARY_SECRET,
});

articleRoute.route("/").get(async (req, res) => {

  try {

    const articles = await articleSchema.find({});
    return util.sendSuccess(res, 200, articles);

  } catch (error) {
    
    return util.sendError(res, 400, error);
  }
});

articleRoute
  .route("/create-article")
  .post(imageUpload.single("image"), validate(createArticle), (req, res, next) => {
   
    cloudinary.uploader
      .upload(req.file.path, { folder: "elite/", format: "png" })
      .then((result) => {
        req.body.image = result.secure_url;
        articleSchema.create(req.body, (error, data) => {
          if (error) {
            return util.sendError(res, 400, error);
          } else {
            return util.sendSuccess(res, 201, data);
          }
        });
      })
      .catch((error) => {
        return util.sendError(res, 400, error);
      });
  });

articleRoute.route("/get-article/:id").get((req, res) => {
  articleSchema.findById(req.params.id, (error, data) => {
    if (error) {
      return util.sendError(res, 400, error);
    } else {
      //check if it's owner or payment has been made
      const address = req.query.address;
      if (data.author === address) {
        return util.sendSuccess(res, 200, data);
      }
      //check if user has already paid
      paymentSchema
        .find({ articleId: data._id, lnAddress: address })
        .count((error, number) => {
          if (error) {
            return util.sendError(res, 400, error);
          } else {
            if (number > 0) {
              return util.sendSuccess(res, 200, data);
            } else {
              //return 402 with invoice
              lnurl
                .requestInvoice({
                  lnUrlOrAddress: data.author,
                  tokens: 10,
                })
                .then((result) => {
                  const articleData = {
                    articleId: data._id,
                    author: data.author,
                    userLnAddress: address
                  }
                  return util.sendSuccess(res, 402, result);
                })
                .catch((error) => {
                  return util.sendError(res, 400, error);
                });
            }
          }
        });
    }
  });
});

articleRoute.route("/update-article/:id").put((req, res, next) => {
  articleSchema.findByIdAndUpdate(
    req.params.id,
    {
      $set: req.body,
    },
    (error, data) => {
      if (error) {
        return util.sendError(res, 400, error);
      } else {
        return util.sendSuccess(res, 200, data);
      }
    }
  );
});

articleRoute.route("/remove-article/:id").delete((req, res, next) => {
  articleSchema.findByIdAndRemove(req.params.id, (error, data) => {
    if (error) {
      return util.sendError(res, 400, error);
    } else {
      return util.sendSuccess(res, 200, data);
    }
  });
});

module.exports = articleRoute;
