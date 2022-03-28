const createLnRpc = require('@radar/lnrpc');
const dotenv = require('dotenv')
dotenv.config()

export let node;

export async function initNode() {
  node = await createLnRpc({
    server: process.env.LND_GRPC_URL,
    cert: new (process.env.LND_TLS_CERT, 'base64').toString('ascii'),
    macaroon: new (process.env.LND_MACAROON, 'base64').toString('hex'),
  });
}