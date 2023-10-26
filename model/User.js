const mongoose = require('mongoose');
const {Schema} = mongoose;
const jwt = require("jsonwebtoken")
const JWT_SECRET='ultrockwillrock#'

const UserSchema = new Schema({
    name:{
        type:String,
    },
    username:{
        type:String,
    },
    email:{
        type:String,
        unique:true

    },
    password:{
        type:String,
        
        
    },
    repeatpassword:{
        type:String,
        
    },
    tokens: [
        {
            token:{
                type:String,
            }
        }
    ]
})

UserSchema.methods.generateToken = async function() {
    let token = jwt.sign({_id: this._id}, JWT_SECRET)
    this.tokens = this.tokens.concat({token: token})
    await this.save()
    return token;
}

const User=mongoose.model('user',UserSchema);
// same email will not enter  again
module.exports=User
