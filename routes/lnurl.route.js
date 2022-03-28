const lnurl = require('lnurl-pay');
const express = require('express');
const util = require('../utils/util');

const lnurlRoute = express.Router();

lnurlRoute.route('/').post((req, res) => {

    lnurl.requestPayServiceParams({lnUrlOrAddress:req.body.address})
        .then((result) => {
            return util.sendSuccess(res, 200, result);
        })
        .catch((error) => {
            return util.sendError(res, 400, 'Invalid address');
        })

});


module.exports = lnurlRoute;