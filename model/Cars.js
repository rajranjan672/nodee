const mongoose = require("mongoose")
const Schema = mongoose.Schema

const CarSchema = new Schema({
    make: String,
    model: String,
    price: String,

})


const CarModel = mongoose.model("car", CarSchema)
module.exports = CarModel