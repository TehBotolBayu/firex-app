const {MongoClient, ObjectId} = require('mongodb');
const {client} = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
const revokedTokens = [];
const { 
    hashPassword, comparePassword, createToken, revokeToken
} = require('../middlewares/auth')


async function validateToken(req, res) {
    const {token} = req.body;
    
    try {
        const jwtPayLoad = jwt.verify(token, "secret_key");
        // console.log(jwtPayLoad);
        if (!jwtPayLoad) {
          return res.status(403).json({
            error: "unauthenticated",
          });
        }
    
        if (revokedTokens.includes(token)) {
          return res.status(403).json({
            message: "token has been revoked",
          });
        }

        return res.status(200).json({
          message: "valid token",
          data: jwtPayLoad
        })
        // res.locals.userId = jwtPayLoad.id;
        // res.locals.roleId = jwtPayLoad.roleId
    
        // res.user = jwtPayLoad;
    
        // next();
      } catch (error) {
        // console.log(error.message);
        return res.status(403).json({
          message: "invalid token",
        });
      }
}

async function register (req, res) {
    const result = await client.db("baru").collection("collection_user").find({"email" : req.body.email})
    if(result){
        return res.status(400).json({
            message: "email is already registered"
        })
    }
    try {        
        const {password} = req.body;
        const encryptedPassword = await hashPassword(password);
        req.body.password = await encryptedPassword;
        const result = await client.db("baru").collection("collection_user").insertOne(req.body);
        return res.status(200).json({data: String(result.insertedId)});
    } catch (error) {
        return res.status(400).json({
            message: error
        })
    }
}

async function login(req, res) {
    const {email, password} = req.body;
    // console.log('teS')
    console.log(email+password);
    const result = await client.db("baru").collection("collection_user").find({"email" : email})
    const list = await result.toArray();
    if(list.length > 0) {
        const rescomp = await comparePassword(password, list[0].password);
        if (rescomp === true){
            const {status} = list[0];
            if(status !== "active"){
              return res.status(400).json({
                message: "Account is not activated"
              })
            } 
            const {_id, role} = list[0];
            const token = createToken(_id, role);
            return res.status(200).json({
                data: {
                  token,
                },
                id: _id,
                role,
              });
        } else {
            res.status(400).json({
                message: "wrong password",
            })
        }
    } else {
        res.status(404).json({
            message: "email not yet registered",
        })
    }
}

async function activate(req, res) {
  const {email, password} = req.body;
  // console.log('teS')
  // console.log(email+password);
  const result = await client.db("baru").collection("collection_user").find({"email" : email})
  const list = await result.toArray();
  if(list.length > 0) {
      // const rescomp = await comparePassword(password, list[0].password);
      const rescomp = (password == list[0].password);
      if (rescomp === true){

          const {_id, role} = list[0];
          list[0].status = "active";
          // const id = String(req.params.id);
          const filter = {"_id": new ObjectId(_id)};
          const result = await client.db("baru").collection("collection_user").updateOne(
              filter,
              {$set: list[0]},
              {upsert: true}
          );

          const {status} = list[0];
          const token = createToken(_id, role);
          return res.status(200).json({
              data: {
                token,
              },
              id: _id,
              role,
            });
      } else {
          res.status(400).json({
              message: "wrong password",
          })
      }
  } else {
      res.status(404).json({
          message: "email not yet registered",
      })
  }
}

async function changePassword(req, res) {
  try {
    const {id, newPassword} = req.body;
    const encryptedPassword = await hashPassword(newPassword);
    const idObject = new ObjectId(String(id));
    const result = await client.db("baru").collection("collection_user").find({"_id" : idObject});
    let data = await result.toArray();
    data[0].password = await encryptedPassword;
    const resultUpdate = await client.db("baru").collection("collection_user").updateOne(
        {"_id": idObject},
        {$set: data[0]},
        {upsert: true}
    );

    console.log(resultUpdate);
    if(resultUpdate.upsertedCount > 0){
        // res.send("new document has been inserted with id "+resultUpdate.upsertedId._id);
        return res.status(200).json({
          message: "data has modified"
        })
    } else {
        // res.send(resultUpdate.modifiedCount+" documents was updated");
        return res.status(200).json({
          message: "data has modified"
        })
    }

  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message: error.message
    })
  }
}

async function expireToken(req, res) {
  try {
    revokeToken(req.params.id);
    return res.status(200).json({
      message: "success"
    })
  } catch (error) {
    console.log(error.message);
    return res.status(400).json({
      message: error.message
    })
  }
}

async function hash(req, res) {
  try{
    const hashed = await hashPassword(req.body.password);
    return res.status(200).json({
      data: hashed
    })
  } catch (error) {
    console.log(error.message);
    return res.status(400).json({
      message: error.message
    })
  }
}

async function compare(req, res) {
  try{
    const same = await comparePassword(req.body.password, req.body.hash);
    return res.status(200).json({
      data: same
    })
  } catch (error) {
    console.log(error.message);
    return res.status(400).json({
      message: error.message
    })
  }
}

module.exports = {login, register, validateToken, expireToken, activate, changePassword, hash, compare}