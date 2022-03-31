const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");
const lnurl = require("lnurl-pay");

const util = require("../utils/util");
let articleSchema = require("../model/article.model");
let paymentSchema = require("../model/payments.model");
let validate = require('../middlewares/validator');
let articleValidator = require('../validation/articleValidator');
const generateRequestInvoice = require('../utils/generateInvoice');

dotenv.config();
const articleRoute = express.Router();
const createArticle = articleValidator.createArticle;
const getArticle = articleValidator.getArticle;

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

        const articles = await articleSchema.find({}, {title: 1, image: 1, username: 1});
        return util.sendSuccess(res, 200, articles);

    } catch (error) {

        return util.sendError(res, 400, error);
    }
});

articleRoute
    .route("/create-article")
    .post(imageUpload.single("image"), validate(createArticle), async (req, res, next) => {

        try {

            const uploadedImage = await cloudinary.uploader.upload(req.file.path, {folder: "elite/", format: "png"});

            req.body.image = uploadedImage.secure_url;

            const article = await articleSchema.create(req.body);

            return util.sendSuccess(res, 201, article);

        } catch (error) {

            return util.sendError(res, 400, error);

        }

    });

articleRoute.route("/get-article/:id")
    .get(validate(getArticle), async (req, res) => {

        try {
            const article = await articleSchema.findById(req.params.id);

            const address = req.query.address;
            //check if it's owner or payment has been made
            if (article.author === address) {
                return util.sendSuccess(res, 200, article);
            }

            const paymentCount = await paymentSchema.find({articleId: article._id, lnAddress: address}).count();

            if (paymentCount > 0) {
                return util.sendSuccess(res, 200, article);
            } else {
                //return 402 with invoice
                const invoice = await generateRequestInvoice(article.author, 10);

                return util.sendSuccess(res, 402, invoice);
            }
        } catch (error) {
            return util.sendError(res, 400, error);
        }
    });

articleRoute.route("/update-article/:id").put(async (req, res, next) => {
//check that it is the same author
    try {
        const updatedArticle = await articleSchema.findByIdAndUpdate(req.params.id, {$set: req.body});

        return util.sendSuccess(res, 200, updatedArticle);

    } catch (error) {

        return util.sendError(res, 400, error);
    }
});

articleRoute.route("/remove-article/:id").delete(async (req, res, next) => {

    try {
        const article = await articleSchema.findByIdAndRemove(req.params.id);

        return util.sendSuccess(res, 200, article);
    } catch (error) {
        return util.sendError(res, 400, error);
    }

});

module.exports = articleRoute;
