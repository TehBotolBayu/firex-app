const {MongoClient} = require('mongodb');
require("dotenv").config();

const uri = process.env.DATABASE_URL;
const client = new MongoClient(uri);

async function main() {
    try {
        client.connect().then(()=>
            console.log('connected to database')
        );
    } catch(error){
        console.error(error);
    }
}

module.exports = {main, client};
