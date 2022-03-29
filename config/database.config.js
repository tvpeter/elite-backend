const dotenv = require('dotenv');

dotenv.config();

const password = process.env.CLUSTER_PASSWORD;

module.exports = {
    url: `mongodb+srv://tvpeter:${password}@elite-blog-cluster.ejuwy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
}