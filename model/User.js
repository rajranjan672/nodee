const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")
const JWT_Secret ="sdfergrsvbhwqafv"


const UserSchema = new mongoose.Schema({
    username: {
        type: String,
    },

    email: {
        type: String,

    },

    password: {
        type: String,
    },

    tokens: [
        {
            token: {
                type: String
            }
        }
    ]
})

UserSchema.methods.generateToken = async function() {
    let token = jwt.sign({_id: this._id}, JWT_Secret)
    this.tokens = this.tokens.concat({token: token})
    await this.save()
    return token;
}

const UserCollection = mongoose.model('User', UserSchema)

module.exports = UserCollection