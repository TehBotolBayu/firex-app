const {MongoClient} = require('mongodb')

const uri = "mongodb://127.0.0.1:27017/baru";
const client = new MongoClient(uri);

async function main() {
    try {
        await client.connect();
    } catch(error){
        console.error(error);
    }
}

module.exports = {main, client};
