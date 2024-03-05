const {MongoClient, ObjectId} = require('mongodb');
const {client} = require('../models');

async function createEmergency (req, res) {
    console.log(req.body);
    const result = await client.db("baru").collection("collection_emergencies").insertOne(req.body);
    res.send("new document created with id" + result.insertedId);
}

async function findEmergency(req, res){
    console.log(req.params.id);
    const id = String(req.params.id);
    let idEncoded = undefined;
    try {
        idEncoded = new ObjectId(id)
    } catch (error) {
        return res.status(400).json({
            message: error
        });
    }
    const result = await client.db("baru").collection("collection_emergencies").find({"_id" : idEncoded})
    const list = await result.toArray();
    if(result) {
        res.status(200).json({
            data: list
        })
    } else {
        res.status(404).json({
            message: "data not found"
        })
    }
}

async function findEmergencies(req, res){
    const result = await client.db("baru").collection("collection_emergencies").find();

    const list = await result.toArray();
    if(result) {
        res.status(200).json({
            data: list
        })
    } else {
        res.send("data not found");
    }

}

async function deleteEmergency(req, res){
    const id = String(req.params.id);

    const result = await client.db("baru").collection("collection_emergencies").deleteOne(
        {"_id": new ObjectId(id)}
    );
    res.send(result.deletedCount+" documents was deleted");
}

async function updateEmergency(req, res){
    const id = String(req.params.id);
    const filter = {"_id": new ObjectId(id)};
    const result = await client.db("baru").collection("collection_emergencies").updateOne(
        filter,
        {$set: req.body},
        {upsert: true}
    );
    if(result.upsertedCount > 0){
        res.send("new document has been inserted with id "+result.upsertedId._id);
    } else {
        res.send(result.modifiedCount+" documents was updated");
    }
}

module.exports = {createEmergency, findEmergency, findEmergencies, deleteEmergency, updateEmergency};