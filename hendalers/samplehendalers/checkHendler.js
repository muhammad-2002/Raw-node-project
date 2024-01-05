const data = require('../../lib/data');
const { createrandomString } = require('../../helpers/utilities');
const {parsejson}=require('../../helpers/utilities')
const {maxChecks}= require('../../helpers/environment')
const tokenHandler =require('./tokenHandler')

// module scaffolding
const handler = {};

handler.checkHandler = (requestProperties, callback) => {
    const acceptedMethods = ['get', 'post', 'put', 'delete'];
    if (acceptedMethods.indexOf(requestProperties.method) > -1) {
        handler._check[requestProperties.method](requestProperties, callback);
    } else {
        callback(405);
    }
};

handler._check = {};

handler._check.post = (requestProperties, callback) => {
    const protocol= typeof(requestProperties.body.protocol)==='string' && ['http','https'].indexOf(requestProperties.body.protocol)>-1?requestProperties.body.protocol:false;

    const url =typeof(requestProperties.body.url)==='string'&&requestProperties.body.url.trim().length>0?requestProperties.body.url: false;

    const method = typeof(requestProperties.body.method)==='string'&& ['GET','POST','PUT','DELETE'].indexOf(requestProperties.body.method)>-1?requestProperties.body.method:false;

    const sucessCode = typeof(requestProperties.body.sucessCode)==='object'&& requestProperties.body.sucessCode instanceof Array ? requestProperties.body.sucessCode:false;

    const timeoutSecond = typeof(requestProperties.body.timeoutSecond)==='number' &&requestProperties.body.timeoutSecond % 1===0 && requestProperties.body.timeoutSecond>=1 &&requestProperties.body.timeoutSecond<=5?requestProperties.body.timeoutSecond:false;

    if(protocol && url && method && sucessCode && timeoutSecond){
        const token = typeof(requestProperties.headersObject.token)==='string'?requestProperties.headersObject.token:false;
        //look up the user phone by reading the token
        data.read('token',token,(err,tokenData)=>{
            if(!err && tokenData){
                let userPhone = parsejson(tokenData).phone
                //look up usrer data
                data.read('users',userPhone,(err, userData)=>{
                    if(!err && userData){
                        tokenHandler._token.varify(token,userPhone,(tokenIsValid)=>{
                            if(tokenIsValid){
                                const userObject = parsejson(userData)
                                console.log(userObject)
                                const userChacked =typeof(userObject.checkes)==='object'&&userObject.checkes instanceof Array?userObject.checkes:[] 
                                console.log(maxChecks)
                                if(userChacked.length<maxChecks){
                                    const checkId = createrandomString(20)
                                    const checkObj ={
                                        id:checkId,
                                        userPhone,
                                        protocol,
                                        url,
                                        method,
                                        sucessCode,
                                        timeoutSecond
                                    }
                                    //save obj
                                    data.create('checks',checkId,checkObj,(err)=>{
                                        if(!err){
                                            userObject.checkes = userChacked
                                            userObject.checkes.push(checkId)
                                            console.log(userChacked)
                                            console.log(userObject)
                                            //save the new user data
                                            data.update('users',userPhone,userObject,(err)=>{
                                                if(!err){
                                                    callback(200,checkObj)
                                                }else{
                                                    callback(500,{
                                                        message:"there is a problem server side!"
                                                    })
                                                }
                                            })

                                        }else{
                                            callback(500,{
                                                message:"there is a problem server side"
                                            })
                                        }
                                    })

                                }else{
                                    callback(403,{
                                        message:"User Alrady rished Max check area"
                                    })
                                }

                            }else{
                                callback(403,{
                                    message:"Authentication Problem"
                                })
                            }
                        })

                    }else{
                        callback(500,{
                            error:"user not found"
                        })
                    }
                })

            }else{
                callback(403,{
                    error:"Server side Problem"
                })
            }
        })

    }else{
        callback(400,{
            error:"you have a problem in your request "
        })
    }
    
};
handler._check.get = (requestProperties, callback) => {
    const id =
        typeof requestProperties.queryStringObject.id === 'string' &&
        requestProperties.queryStringObject.id.trim().length === 20
            ? requestProperties.queryStringObject.id
            : false;
            if(id){
                data.read('checks',id,(err,checkData)=>{
                    console.log(id)
                    if(!err && checkData){
                        
                        const token = typeof(requestProperties.headersObject.token)==='string'?requestProperties.headersObject.token:false;
                        const userPhone = parsejson(checkData).userPhone
                        console.log(userPhone)
                       tokenHandler._token.varify(token,userPhone,(tokenIsValid)=>{
                        if(tokenIsValid){
                            callback(200,parsejson(checkData))

                        }else{
                            callback(403,{
                                message:"Authentication Error"
                            })
                        }
                    })
                    }else{
                        callback(500,{
                            message:"The problem was server side!"
                        })
                    }
                })

            }else{
                callback(400,{
                    error: "this is a problem in your request"
                })
            }
};

handler._check.put = (requestProperties, callback) => {
    const id =
    typeof requestProperties.body.id === 'string' &&
    requestProperties.body.id.trim().length === 20
        ? requestProperties.body.id
        : false;
    const protocol= typeof(requestProperties.body.protocol)==='string' && ['http','https'].indexOf(requestProperties.body.protocol)>-1?requestProperties.body.protocol:false;

    const url =typeof(requestProperties.body.url)==='string'&&requestProperties.body.url.trim().length>0?requestProperties.body.url: false;

    const method = typeof(requestProperties.body.method)==='string'&& ['GET','POST','PUT','DELETE'].indexOf(requestProperties.body.method)>-1?requestProperties.body.method:false;

    const sucessCode = typeof(requestProperties.body.sucessCode)==='object'&& requestProperties.body.sucessCode instanceof Array ? requestProperties.body.sucessCode:false;

    const timeoutSecond = typeof(requestProperties.body.timeoutSecond)==='number' &&requestProperties.body.timeoutSecond % 1===0 && requestProperties.body.timeoutSecond>=1 &&requestProperties.body.timeoutSecond<=5?requestProperties.body.timeoutSecond:false;

    if(id){
        if(protocol || url || method || sucessCode || timeoutSecond){
            data.read('checks',id,(err,checkData)=>{
                if(!err && checkData){
                    let checkObj = parsejson(checkData)
                    const token = typeof(requestProperties.headersObject.token)==='string'?requestProperties.headersObject.token:false;
                    tokenHandler._token.varify(token,checkObj.userPhone,(tokenIsValid)=>{
                        if(tokenIsValid){
                            if(protocol){
                                checkObj.protocol = protocol;
                            }
                            if(protocol){
                                checkObj.url = url;
                            }
                            if(protocol){
                                checkObj.sucessCode = sucessCode;
                            }
                            if(protocol){
                                checkObj.method = method;
                            }
                            if(protocol){
                                checkObj.timeoutSecond = timeoutSecond;
                            }
                            // store data
                            data.update('checks',id,checkObj,(err)=>{
                                if(!err){
                                    callback(200)

                                }else{
                                    callback(500,{
                                        message:"server side error"
                                    })

                                }
                            })

                        }else{
                            callback(403,{
                                message:"Authorization problem"
                            })
                        }
                    })
                

                }else{
                    callback(500,{
                        message:"there is a prblem in server side"
                    })
                }
            })

        }else{
            callback(500,{
                message:"there is a problem in server side"
            })
        }

    }else{
        callback(400,{
            message:"there is a problem in your Request"
        })
    }
};

handler._check.delete = (requestProperties, callback) => {const id =
    typeof requestProperties.queryStringObject.id === 'string' &&
    requestProperties.queryStringObject.id.trim().length === 20
        ? requestProperties.queryStringObject.id
        : false;
        if(id){
            data.read('checks',id,(err,checkData)=>{
                console.log(id)
                if(!err && checkData){
                    
                    const token = typeof(requestProperties.headersObject.token)==='string'?requestProperties.headersObject.token:false;
                    const userPhone = parsejson(checkData).userPhone
                    console.log(userPhone)
                   tokenHandler._token.varify(token,userPhone,(tokenIsValid)=>{
                    if(tokenIsValid){
                        //delete check data
                        data.delete('checks',id,(err)=>{
                         if(!err){
                            
                           
                             data.read('users', parsejson(checkData).userPhone,(err,userData)=>{
                                const userObj =parsejson(userData)
                                 if(!err && userData){
                                     let userCheck = typeof(userObj.checkes)==='object'&& userObj.checkes instanceof Array? userObj.checkes:[];
                                  
 
                                     let checkPosition = userCheck.indexOf(id)
                                     console.log(checkPosition)
                                     if(checkPosition>-1){
                                         userCheck.splice(checkPosition,1);
                                         //resave data
                                         userObj.checkes=userCheck
                                      data.update('users',userObj.phone,userObj,(err)=>{
                                         if(!err){
                                             callback(200)
                                         }else{
                                             callback(500,{
                                                 message:"server side error"
                                             })
                                         }
                                      })
 
                                     }else{
                                         callback(500,{
                                             error:"user id not found checks"
                                         })
                                     }
                                 }else{
                                     callback(500,
                                         {
                                             message:"server side Error"
                                         })
                                 }
                             })
 
                         }else{
                             callback(500,{
                                 message:"The problem was server side!"
                             })
                         }
                        })
                     }else{
                         callback(403,{
                             message:"Authentication Error"
                         })
                     }
                })
                }else{
                    callback(500,{
                        message:"The problem was server side!"
                    })
                }
            })

        }else{
            callback(400,{
                error: "this is a problem in your request"
            })
        }

};

module.exports = handler;
