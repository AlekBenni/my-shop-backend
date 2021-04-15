const {Schema, model} = require("mongoose")

const schema = new Schema({
    name: String,
    email: String,
    password: String,
    avatar: String
})

module.exports = model("User", schema)