const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")
const JWT_SECRET='ultrockwillrock#'

const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    cars: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"car"
    }
})

// UserSchema.methods.generateToken = async function() {
//     let token = jwt.sign({_id: this._id}, JWT_SECRET)
//     await this.save()
//     return token;
// }

const UserModel = mongoose.model("emp", UserSchema)
module.exports = UserModel