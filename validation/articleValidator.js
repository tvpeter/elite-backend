const validator = require('express-validator');
const articleSchema = require('../model/article.model');


const check = validator.check;

const createArticle = [
    check('title')
    .exists()
    .withMessage('Title is required')
    .trim()
    .isLength({min:10, max: 50})
    .withMessage('Article title should be between 10 and 50 characters')
    .custom(async (value, {req}) => {
        const title = await articleSchema.findOne({where: {title: value}});

        if(title){
            throw new Error('Supplied blog title already exists');
        }
    }),

    check('bodyContent')
    .exists()
    .withMessage('body content is required')
    .trim()
    .isLength({min: 100}),

    check('image')
    .exists()
    .withMessage('cover image is required'),

    check('author')
    .exists()
    .withMessage('lightning address is required'),
    //validate it's a valid address

    check('username')
    .exists()
    .withMessage('display name is required')

];

export { createArticle }