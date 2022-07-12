const Users = require('../models/user')
const Sessions = require('../models/sessions')
const commonController = require('./commonController')
const Phoneotps = require('../models/phoneotps')
const Emailotps = require('../models/emailotps')

const cookieParser = require("cookie-parser");
const utils = require('./utils')

module.exports = {

    async getUsers(req,res){
        const users = await Users.find({}).select('name email');
        try {
           if(users){
            res.sendAPiSuccess({
                status : 200,
                data : users
            })
           }else{
            res.sendAPiError({
                status : 422,
                msg : error
            })
           }
        } catch (error) {
           console.log(error)
        }
    },

    async register(req,res){
        const { name, email, password} = req.body;
        const user = await Users.findOne({email});
        try{
            if(user){
                res.sendAPiError({
                    status : 422,
                    msg : "User with this email aleardy exists"
                })
            }else{
                const user = new Users({name,email,password})
                user.save((error=>{
                    if(error){
                        res.sendAPiError({
                            status : 422,
                            msg : error
                        })
                    }else{
                        res.sendAPiSuccess({
                            status : 200,
                            msg : "Registered!"
                        })  
                    }
                }))
            }
        }
        catch(error){
            console.log(error)  
        }
    }, 

    async login(req,res){
        const { email,password } = req.body;
         Users.findOne({email},async(error,user)=>{
            if(error){
                res.sendAPiError({
                    status : 422,
                    msg : error
                })
            }
            if(!user){
                    res.sendAPiError({
                        status : 422,
                        msg : "User with this email does not exists"
                    }) 
            }
            //delete existing token
            await Sessions.deleteOne({"user_id":user._id})
            if(user.hasSamePassword(password)){
                //generate JWT token
                let token = await utils.generateJWTToken(user)

                const sessions = new Sessions({
                    "user_id":user._id,
                    "jwt":token
                })
                await sessions.save()

                res.sendAPiSuccess({
                    status : 200,
                    data : token
                }) 

            }else{
                res.sendAPiError({
                    status : 422,
                    msg : "Password is incorrect"
                }) 
                
            }
         });
       
    },

    authorization(req, res, next) {
        const token = req.body.token || req.query.token || req.headers["x-access-token"];
        if (!token) {
            res.sendAPiError({
                status : 422,
                msg : "Unauthorize access found!"
            })
        }
        try {
          const data = utils.verifyJWT(token)
          console.log(data,"authorization")
          data.then(data=>{
            req.userId = data.id;
            var user = Users.findById(req.userId)
            if(!user){
              res.sendAPiError({
                  status : 422,
                  msg : "Unauthorize access found!"
              }) 
            }else{
              return next();
            }
          }).catch(error=>{
            res.sendAPiError({
                status : 422,
                msg : "Unauthorize access found!"
            }) 
          })
          
        } catch(error) {
          console.log(error,"console error auth")
        }
    },

   async logout(req, res){
    const token = req.body.token || req.query.token || req.headers["x-access-token"];
    await Sessions.deleteOne({"jwt":token});
          res.sendAPiSuccess({
            status : 200,
            msg : "Successfully logged out 😏 🍀"
        }) 

   }, 

   async sendPhoneOtp(req,res){
     let otp =  await utils.generateMobileOtp();
     let phoneotps = new Phoneotps({"phone":req.body.phone,"otp":otp});
     await phoneotps.save();
     if (otp) {  
        console.log("phone otp :",otp)    
        commonController.sendSMS({ to: req.body.phone, text: `Dear user, ${otp} is your One-Time Password (OTP). It is valid for 10 minutes. Please use the same for login process. WEBSITE OWNER` }, (result) => {
            if (result.type) {
                res.json({
                    type: true,
                    msg: "Otp Sent!"
                })
            }
            else {
                res.json({
                    type: false,
                    msg: "Otp not Sent!"
                })
            }
        })
    }

   },

   async verifyPhoneOtp(req,res){
     const {phone,otp} = req.body;
     const phonerecord = await Phoneotps.findOne({phone})
     if(phonerecord){
        try{
            if(phonerecord.otp == otp){
                await Phoneotps.deleteOne(phonerecord);
                res.sendAPiSuccess({
                    status : 200,
                    msg: "Otp Veryfied !"
                })
             }else{
                res.sendAPiError({
                    status : 422,
                    msg: "Otp not veryfied !"
                })
             }
        }catch(error){
            console.log(error)
        }
     }else{
        res.sendAPiError({
            status : 422,
            msg: "Otp not veryfied !"
        })
     }
   },

   async sendEmailOtp(req,res){
    let otp =  await utils.generateEmailOtp();
    let emailotps = new Emailotps({"email":req.body.email,"otp":otp});
    await emailotps.save();
    if (otp) {  
       console.log("emailotps :",otp)    
       commonController.senEmail({ to: req.body.email, otp:otp  }, (result) => {
           if (result.type) {
               res.json({
                   type: true,
                   msg: "Otp Sent!"
               })
           }
           else {
               res.json({
                   type: false,
                   msg: "Otp not Sent!"
               })
           }
       })
   }
   },

   async verifyEmailOtp(req,res){
    const {email,otp} = req.body;
    const emailrecord = await Emailotps.findOne({email})
    if(emailrecord){
       try{
           if(emailrecord.otp == otp){
               await Emailotps.deleteOne(emailrecord);
               res.sendAPiSuccess({
                   status : 200,
                   msg: "Otp Veryfied !"
               })
            }else{
               res.sendAPiError({
                   status : 422,
                   msg: "Otp not veryfied !"
               })
            }
       }catch(error){
           console.log(error)
       }
    }else{
       res.sendAPiError({
           status : 422,
           msg: "Otp not veryfied !"
       })
    }
  },

}

