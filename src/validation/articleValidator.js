const validator = require('express-validator');
const articleSchema = require('../model/article.model');
const { check, param, query, oneOf, body} = require("express-validator");


const createArticle = [
    check('title')
        .exists()
        .withMessage('Title is required')
        .trim()
        .isLength({min: 10, max: 50})
        .withMessage('Article title should be between 10 and 50 characters')
        .custom(async (value, {req}) => {
            const title = await articleSchema.findOne({title: value});

            if (title) {
                throw new Error('Supplied blog title already exists');
            }
        }),

    check('bodyContent')
        .exists()
        .withMessage('body content is required')
        .trim()
        .isLength({min: 100}),

    check('image')
        .custom((value, {req}) => {
            if (['image/jpeg', 'image/jpg', 'image/png'].indexOf(req.file.mimetype) !== -1) {
                return true;
            } else {
                return false;
            }
        })
        .withMessage('invalid file type.'),


    check('author')
        .exists()
        .withMessage('lightning address is required'),
    //validate it's a valid address

    check('username')
        .exists()
        .withMessage('display name is required')

];

const getArticle = [
    query('address')
        .exists()
        .withMessage('the users lightning address is required')
        .trim(),

    param('id')
        .exists()
        .isNumeric()
        .withMessage('the article id is required')
        .custom(async (value, {req}) => {
            const article = await articleSchema.findById(value);

            if(!article){
                throw new Error('Article does not exist');
            }
        }),
];

const updateArticle = [
    query('id')
        .trim()
        .exists()
        .isNumeric()
        .withMessage('article id is required')
        .custom( async (value, {req}) => {
            const article = await  articleSchema.findById(value);

            if(!article){
                throw new Error('Article does not exist');
            }
        }),

    oneOf([
        check('title').exists().isString().isLength({min: 50}),
        check('bodyContent').exists().isString().isLength({min: 100}),
    ], "provide either title or body content to update"),


];


module.exports = {createArticle, getArticle, updateArticle}