const validator = require('express-validator');
const util = require('../utils/util');

const validationResult = validator.validationResult;


const validate = (schema) => {
    return async (req, res, next) => {
        await Promise.all(schema.map((schema) => schema.run(req)));

        const result = validationResult(req);
        if(result.isEmpty()){
            return next();
        }

        const errors = result.array();
        return util.sendError(res, 400, errors);
    }
}

module.exports = validate;