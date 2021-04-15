const {Schema, model} = require("mongoose")

const schema = new Schema({
    name: String,
    category: String,
    desc: String,
    img: String,
    price: Number,
    ratting: Number
})

module.exports = model("Product", schema)