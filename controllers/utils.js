var jwt = require('jsonwebtoken');
require('dotenv').config();
const config_env = JSON.parse(process.env.CONFIG);

async function generateJWTToken(user){
    const token =  jwt.sign({
        id: user._id,
        name: user.name,
        email:user.email
      }, config_env.jwtSecret, { expiresIn: '2h' });
    return token;
}

async function verifyJWT(token){
   return jwt.verify(token, config_env.jwtSecret);
}

async function generateMobileOtp(){
      // Declare a digits variable
  // which stores all digits
  var digits = "0123456789";
  let OTP = "";
  for (let i = 0; i < config_env.otp_length; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;

}
async function generateEmailOtp(){
  var digits = "0123456789";
  let OTP = "";
  for (let i = 0; i < config_env.otp_length; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
}
module.exports = {
    generateJWTToken : generateJWTToken,
    verifyJWT :verifyJWT,
    generateMobileOtp : generateMobileOtp,
    generateEmailOtp:generateEmailOtp
};