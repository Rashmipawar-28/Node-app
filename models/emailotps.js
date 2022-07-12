const mongoose = require("mongoose");
const Schema = mongoose.Schema
const EmailotpsSchema = new Schema({
   "email":{type:String},
   "otp":{type:String}
})

module.exports = mongoose.model('Emailotps',EmailotpsSchema)