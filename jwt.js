const jwtToken = require('jsonwebtoken');
require('dotenv').config();

const SECRET_KEY = process.env.Secret_Key;

const jwtAuthMiddelWare = (req,res,next)=>{
    try {
        const auth = req.headers.authorization;
        if(!auth){
            res.status(404).json("token not found");
        }
        const authToken  = req.headers.authorization.split(' ')[1];
        if(!authToken){
            res.status(404).json("unauthorized")
        }
        const decoded =  jwtToken.verify(authToken,SECRET_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        console.log(error);
         res.status(404).json("unauthorized")
    }
}

const genToken = (userData)=>{
    try {
        const token = jwtToken.sign(userData,SECRET_KEY);
        return token;
    } catch (error) {
        return error;
    }
}

module.exports = {jwtAuthMiddelWare,genToken};