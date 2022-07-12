const request = require('request');
var unirest = require("unirest");
const fast2sms = require('fast-two-sms')
const config_env = JSON.parse(process.env.CONFIG);
const nodemailer = require('nodemailer');
var MAIL_SETTINGS = require('../constants/email-settings');
const transporter = nodemailer.createTransport(MAIL_SETTINGS.MAIL_SETTINGS);

module.exports ={
    async sendSMS(data, next) {
        // request.get({
        //     url: config_env.sms.smsUrl,
        //     qs: {
        //         feedid: config_env.sms.feedid,
        //         Username: config_env.sms.smsUname,
        //         Password: config_env.sms.smsPass,
        //         To: "+91"+data.to,
        //         Text: data.text
        //     },
        //     rejectUnauthorized: false
        // }, (err, response, body) => {
        //     let json = {}
        //     if (err) {
        //         //console.log(err)
        //         json.type = false
        //     }
        //     else {
        //         console.log(response)
        //         console.log("###########")
        //         console.log(body,"############")
        //         json.type = true
        //     }
        //     return next(json)
        // })   

        let json = {}
        var options = {authorization : 'Htz1w0fZcRKdpgEUeA8oMYBQn7SICG6rDOylahjvP5TsJXkW9mFSeQYfOVbDy1HgI2chZ0o6ErniU9Xt' , message : data.text ,  numbers : [data.to]} 
         //Asynchronous Function.
        await fast2sms.sendMessage(options).then(response=>{
            console.log("hey")
            console.log(response,"res")
            if(response && !response.return){
                json.type = false
            }else{
                json.type = true
            }
          }).catch((error)=>{
            console.log(error)
            console.log("hello")
            json.type = false
          })


// var req = unirest("GET", "https://www.fast2sms.com/dev/bulkV2");
// let json = {}
// req.query({
//   "authorization": "Htz1w0fZcRKdpgEUeA8oMYBQn7SICG6rDOylahjvP5TsJXkW9mFSeQYfOVbDy1HgI2chZ0o6ErniU9Xt",
//   "variables_values": "5599",
//   "route": "otp",
//   "numbers": "9167798323"
// });

// req.headers({
//   "cache-control": "no-cache"
// });


// req.end(function (res) {
//   if (res.error){
//     json.type = false
//   };
//   json.type = true
//   console.log(res.body);
// });
          return next(json)
    },
    async senEmail(data,next){
        let json = {}
        try {
            let info = await transporter.sendMail({
              from: MAIL_SETTINGS.MAIL_SETTINGS.auth.user,
              to: data.to, 
              subject: 'Otp for Test Site',
              html: `
              <div
                class="container"
                style="max-width: 90%; margin: auto; padding-top: 20px"
              >
                <h2>Welcome to the club.</h2>
                <h4>You are officially In ✔</h4>
                <p style="margin-bottom: 30px;">Pleas enter the sign up OTP to get started</p>
                <h1 style="font-size: 40px; letter-spacing: 2px; text-align:center;">${data.otp}</h1>
             </div>
            `,
            });
            json.type = true
          } catch (error) {
            console.log(error);
            json.type = false
          }

          return next(json)
    }
}