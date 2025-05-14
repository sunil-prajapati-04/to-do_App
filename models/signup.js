const mongoose  = require('mongoose');
const bcrypt = require('bcrypt');


const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    phone:{
        type:String
    },
    role:{
        type:String,
        enum:["student","teacher","corporate","other"],
        required:true
    },
    password:{
        type:String,
        required:true
    },
    Tasks:[
        {
            task:{
                type:String
            }
        }
    ]
})

userSchema.pre('save',async function(next){
    try {
        const user = this;
        if(!user.isModified('password')){
            return next();
        }

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(user.password,salt);
        user.password = hashPassword;
        next();
    } catch (error) {
        return next(error);
    }
})

userSchema.methods.comparePassword = async function(password){
    try {
        const isMatch = await bcrypt.compare(password,this.password);
        return isMatch;
    } catch (error) {
        throw error;
    }
}



const signupUser = mongoose.model('signupUser',userSchema);
module.exports = signupUser;