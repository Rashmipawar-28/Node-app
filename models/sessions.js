const mongoose = require("mongoose");
const Schema = mongoose.Schema
const SessionsSchema = new Schema({
   "jwt":{type:String},
   "user_id":{type:Schema.ObjectId}
})

module.exports = mongoose.model('Sessions',SessionsSchema)
