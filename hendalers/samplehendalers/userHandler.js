//dependensis section
const data = require('../../lib/data');
const { hash } = require('../../helpers/utilities');
const {parsejson}=require('../../helpers/utilities');
const tokenHendaler = require('./tokenHandler')


// module scaffolding
const handler = {};

handler.userHandler = (requestProperties, callback) => {
    const acceptedMethods = ['get', 'post', 'put', 'delete'];
    if (acceptedMethods.indexOf(requestProperties.method) > -1) {
        handler._users[requestProperties.method](requestProperties, callback);
    } else {
        callback(405);
    }
};

handler._users = {};

handler._users.post = (requestProperties, callback) => {
    const firstName =
        typeof requestProperties.body.firstName === 'string' &&
        requestProperties.body.firstName.trim().length > 0
            ? requestProperties.body.firstName
            : false;

    const lastName =
        typeof requestProperties.body.lastName === 'string' &&
        requestProperties.body.lastName.trim().length > 0
            ? requestProperties.body.lastName
            : false;

    const phone =
        typeof requestProperties.body.phone === 'string' &&
        requestProperties.body.phone.trim().length === 11
            ? requestProperties.body.phone
            : false;

    const password =
        typeof requestProperties.body.password === 'string' &&
        requestProperties.body.password.trim().length > 0
            ? requestProperties.body.password
            : false;

    const tosAgreement =
        typeof requestProperties.body.tosAgreement === 'boolean' &&
        requestProperties.body.tosAgreement
            ? requestProperties.body.tosAgreement
            : false;

    if (firstName && lastName && phone && password && tosAgreement) {
                // make sure that the user doesn't already exist
                data.read('users', phone, (err1) => {
                    if (err1) {
                        const userObject = {
                            firstName,
                            lastName,
                            phone,
                            password: hash(password),
                            tosAgreement,
                        };
                        // store the user to db
                        data.create('users', phone, userObject, (err2) => {
                            if (!err2) {
                                callback(200, {
                                    message: 'User was created successfully!',
                                });
                            } else {
                                callback(500, { error: 'Could not create user!' });
                            }
                        });
                    } else {
                        callback(500, {
                            error: 'There was a problem on the server side!',
                        });
                    }
                });
            } else {
                callback(400, {
                    error: 'You have a problem in your request',
                });
            }
        };
//TODO:Authication
handler._users.get = (requestProperties, callback) => {
    const phone =
        typeof requestProperties.queryStringObject.phone === 'string' &&
        requestProperties.queryStringObject.phone.trim().length === 11
            ? requestProperties.queryStringObject.phone
            : false;
    if(phone){
        //varify token
        const token = typeof(requestProperties.headersObject.token)==='string'?requestProperties.headersObject.token:false;
        tokenHendaler._token.varify(token,phone,(tokenId)=>{
            if(tokenId){
                data.read('users',phone,(err,u)=>{
                    const user ={...parsejson(u)}
                    if(!err && user){
                        delete user.password;
                        callback(200,user)
        
                    }else{
                        callback(404,{
                            error:'not found'
                        })
                    }
        
                })

            }else{
                callback(403,{
                    message:"Authecation faild"
                })
            }

        })

    }else{
        callback(404,{
            error:'not found'
        })
    }
    
}
//TODO:Authication
handler._users.put =(requestProperties,callback)=>{
    //validity Check
    const firstName =
        typeof requestProperties.body.firstName === 'string' &&
        requestProperties.body.firstName.trim().length > 0
            ? requestProperties.body.firstName
            : false;

    const lastName =
        typeof requestProperties.body.lastName === 'string' &&
        requestProperties.body.lastName.trim().length > 0
            ? requestProperties.body.lastName
            : false;

    const phone =
        typeof requestProperties.body.phone === 'string' &&
        requestProperties.body.phone.trim().length === 11
            ? requestProperties.body.phone
            : false;

    const password =
        typeof requestProperties.body.password === 'string' &&
        requestProperties.body.password.trim().length > 0
            ? requestProperties.body.password
            : false;
        if(phone){
            if(firstName|| lastName||password){
                //varify token
        const token = typeof(requestProperties.headersObject.token)==='string'?requestProperties.headersObject.token:false;
        tokenHendaler._token.varify(token,phone,(tokenId)=>{
            if(tokenId){
                data.read('users',phone,(err,uData)=>{
                    const userData = {...parsejson(uData)}
                    if(!err && userData){
                        if(firstName){
                            userData.firstName =firstName
                        }
                        if(lastName){
                            userData.lastName = lastName
                        }
                        if(password){
                            userData.password = hash(password)
                        }
                        //store to database
                    data.update('users',phone,userData,(err)=>{
                        if(!err){
                            callback(200,{
                                message:"data ubdated sucessfully"
                            })
                        }else{
                            callback(500,{
                                message:"problem server side"
                            })
                        }
    
                    })
    
                    }else{
                        callback(400,{
                            message:"you have a problem in your request"
                        })
                    }
                   })
                

            }else{
                callback(403,{
                    message:"Authecation faild"
                })
            }

        })
               

            }else{
                callback(400,{
                    message:"you have a problem in your request"
                })
            }

        }else{
            callback(400,{
                message:"Invalid phone number"
            })
        }
}
//TODO:Authication
handler._users.delete =(requestProperties,callback)=>{
    const phone= typeof(requestProperties.queryStringObject.phone)==='string'&&requestProperties.queryStringObject.phone.trim().length ===11?requestProperties.queryStringObject.phone:false;
    if(phone){
        const token = typeof(requestProperties.headersObject.token)==='string'?requestProperties.headersObject.token:false;
        tokenHendaler._token.varify(token,phone,(tokenId)=>{
            if(tokenId){
                data.read('users',phone,(err,userData)=>{
                    if(!err && userData){
                        data.delete('users',phone,(err)=>{
                            if(!err){
                                callback(200,{
                                    message:"Succfully Delete"
                                })
                            }else{
                                callback(500,{
                                    error:"This is server side problem"
                                })
                            }
                
                        })
                    }else{
                        callback(500,{
                            error:"This is server side problem"
                        })
                    }
                
                       })

            }else{
                callback(403,{
                    message:"Authecation faild"
                })
            }

        })
       
    }
    else{
        callback(400,{
            message:"Invalid phone nubmber "
        })
    }

}
module.exports = handler