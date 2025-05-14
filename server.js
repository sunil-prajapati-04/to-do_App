const express = require('express');
const app  = express();
const db = require('./db');
require('dotenv').config();
const bodyParser = require('body-parser');

app.use(bodyParser.json());
const PORT = process.env.Port;

app.get('/',(req,res)=>{
    res.send("TODO APP(use it through postman app by different route)");
})

app.listen(PORT,()=>{
    console.log(`server is listening on Port ${PORT}`);
})

const signupRoute = require('./routes/userRoutes');
app.use('/user',signupRoute);