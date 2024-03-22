const {MongoClient, ObjectId} = require('mongodb');
const {client} = require('../models');

async function createSensor (req, res) {
    req.body.userId = new ObjectId(req.body.userId)
    try {        
        const result = await client.db("baru").collection("collection_sensors").insertOne(req.body);
        res.send("new document created with id" + result.insertedId);
    } catch (error) {
        res.status(505).json({
            error: error.message
        })
        console.log(error);
    }
}


async function getSensorUser(req, res) {
    try {
        const data = await client.db("baru").collection("collection_sensors").aggregate([{
            $lookup: {
            from: 'collection_user',
            localField: 'userId',
            foreignField: '_id',
            as: 'sensor_user'
            }}]);

        const list = await data.toArray();
        res.status(200).json({
            data : list
        })
    } catch (error) {
        res.status(505).json({
            error: error.message
        })
        console.log(error);
    }
}

async function findSensor(req, res){
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
    const result = await client.db("baru").collection("collection_sensors").find({"_id" : idEncoded})
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

async function findSensors(req, res){
    const result = await client.db("baru").collection("collection_sensors").find();

    const list = await result.toArray();
    if(result) {
        res.status(200).json({
            data: list
        })
    } else {
        res.send("data not found");
    }

}

async function deleteSensor(req, res){
    const id = String(req.params.id);

    const result = await client.db("baru").collection("collection_sensors").deleteOne(
        {"_id": new ObjectId(id)}
    );
    res.send(result.deletedCount+" documents was deleted");
}

async function updateSensor(req, res){
    req.body.userId = new ObjectId(req.body.userId)
    const id = String(req.params.id);
    const filter = {"_id": new ObjectId(id)};
    const result = await client.db("baru").collection("collection_sensors").updateOne(
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

module.exports = {createSensor, findSensor, findSensors, deleteSensor, updateSensor, getSensorUser};