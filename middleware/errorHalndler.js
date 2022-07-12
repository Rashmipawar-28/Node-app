exports.provideErrorHandler = (req,res,next)=>{
    res.sendAPiError = config=>{

     return res.status(config.status).send({
            type:false,
            msg: config.msg
        })

    }
    res.sendAPiSuccess = config=>{

        if(config.data){
            return  res.status(config.status).send({
                type: true,
                data: config.data
            })
        }

        if(config.msg){
                return  res.status(config.status).send({
                    type: true,
                    msg: config.msg
                }) 
        }
    } 
    next()
}