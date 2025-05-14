const mongoose = require('mongoose');
require('dotenv').config();
const MongoDbUrl = process.env.mongoDbUrl;

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