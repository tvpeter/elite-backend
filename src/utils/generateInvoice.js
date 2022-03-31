const lnurl = require('lnurl-pay');


function generateRequestInvoice(address, tokens){

return lnurl.requestInvoice({
    lnUrlOrAddress: address,
    tokens
});

}

module.exports = generateRequestInvoice;