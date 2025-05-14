require('dotenv').config();
const mongoose = require('mongoose');
// const MongoDbUrl = process.env.mongoDbUrl_local;
console.log("Mongo URI:", process.env.mongoDbUrl_online);

const MongoDbUrl = process.env.mongoDbUrl_online ;
console.log("MongoDB URL:", MongoDbUrl); 

mongoose.connect(MongoDbUrl);

const db = mongoose.connection;

db.on('connected',()=>{
    console.log("connected to Database succesfully");
})

db.on('disconnected',()=>{
    console.log("disconnected to Database succesfully");
})

db.on('error',(err)=>{
    console.log("error in connecting with database",err);
})