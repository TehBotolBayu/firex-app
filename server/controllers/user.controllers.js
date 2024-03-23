const {MongoClient, ObjectId} = require('mongodb');
const {client} = require('../models');

async function findUser(req, res){
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
    const result = await client.db("baru").collection("collection_user").find({"_id" : idEncoded})
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

async function findUsers(req, res){
    const result = await client.db("baru").collection("collection_user").find();

    const list = await result.toArray();
    if(result) {
        res.status(200).json({
            data: list
        })
    } else {
        res.send("data not found");
    }

}

async function deleteUser(req, res){
    const id = String(req.params.id);

    const result = await client.db("baru").collection("collection_user").deleteOne(
        {"_id": new ObjectId(id)}
    );
    res.send(result.deletedCount+" documents was deleted");
}

async function updateUser(req, res){
    const id = String(req.params.id);
    const filter = {"_id": new ObjectId(id)};
    const result = await client.db("baru").collection("collection_user").updateOne(
        filter,
        {$set: req.body},
        {upsert: true}
    );
    if(result.upsertedCount > 0){
        res.status(200).json({message:"new user has been inserted with id "+result.upsertedId._id});
    } else {
        res.status(200).json({message:result.modifiedCount+" user was updated"});
    }
}

module.exports = {findUser, findUsers, deleteUser, updateUser};