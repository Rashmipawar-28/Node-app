const mongoose = require("mongoose");
const Schema = mongoose.Schema
const PhoneotpsSchema = new Schema({
   "phone":{type:String},
   "otp":{type:String}
})

module.exports = mongoose.model('Phoneotps',PhoneotpsSchema)