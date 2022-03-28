const lnurl = require('lnurl-pay');


function generateRequestInvoice(address){

lnurl.requestInvoice({
    lnUrlOrAddress: address,
    tokens: 10,
})
.then((result) => {
    return result;
})
.catch((error) => {
    return {
        status: false,
        error: error,
    }
});

}

module.exports = generateRequestInvoice;