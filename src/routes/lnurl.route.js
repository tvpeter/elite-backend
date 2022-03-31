const lnurl = require('lnurl-pay');
const express = require('express');
const util = require('../utils/util');

const lnurlRoute = express.Router();

lnurlRoute.route('/').post(async (req, res) => {

    try {
        const result = await lnurl.requestPayServiceParams({ lnUrlOrAddress: req.body.address })

        return util.sendSuccess(res, 200, result);
    }
    catch (error) {
        return util.sendError(res, 400, error);
    }

});


module.exports = lnurlRoute;