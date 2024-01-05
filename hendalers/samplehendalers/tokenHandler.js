const data = require('../../lib/data');
const { hash } = require('../../helpers/utilities');
const { createrandomString } = require('../../helpers/utilities');
const {parsejson}=require('../../helpers/utilities')

// module scaffolding
const handler = {};

handler.tokenHandler = (requestProperties, callback) => {
    const acceptedMethods = ['get', 'post', 'put', 'delete'];
    if (acceptedMethods.indexOf(requestProperties.method) > -1) {
        handler._token[requestProperties.method](requestProperties, callback);
    } else {
        callback(405);
    }
};

handler._token = {};

handler._token.post = (requestProperties, callback) => {
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
    if (phone && password) {
        data.read('users',phone,(err,userData)=>{
            const hashPassword = hash(password)
            if(hashPassword  === parsejson(userData).password){
                let tokenId =createrandomString(20);
                let expairs = Date.now() + 60 * 60 * 1000;
                let tokenObj ={
                    phone,
                    id:tokenId,
                    expairs,
                }
                data.create('token',tokenId,tokenObj,(err)=>{
                    if(!err){
                        callback(200,tokenObj)
                    }
                    else{
                        callback(500,{
                            error:"This is problem of server Side"
                        })
                    }

                })

            }else{
                callback(500,{
                    error:"password is not valid"
                })
            }

        })
    }else{
        callback(400,{
            error:"you have a problem in your request"
        })
    }
};
handler._token.get = (requestProperties, callback) => {
    const id =
        typeof requestProperties.queryStringObject.id === 'string' &&
        requestProperties.queryStringObject.id.trim().length === 20
            ? requestProperties.queryStringObject.id
            : false;
    if(id){
        data.read('token',id,(err,tokenData)=>{
            const token ={...parsejson(tokenData)}
            if(!err && token){
                callback(200,token)

            }else{
                callback(404,{
                    error:'not found token'
                })
            }

        })
    }else{
        callback(404,{
            error:'not found'
        })
    }
};

handler._token.put = (requestProperties, callback) => {
    const id =
    typeof requestProperties.body.id === 'string' &&
    requestProperties.body.id.trim().length === 20
        ? requestProperties.body.id
        : false;
    const extend =typeof requestProperties.body.extend === "boolean" && requestProperties.body.extend===true ?true:false
    if(id && extend){
      data.read('token',id,(err,tokenData)=>{
        let tokenObj=parsejson(tokenData)
        if(tokenObj.expairs>Date.now()){
            tokenObj.expairs = Date.now() + 60*60*1000;
            data.update('token',id,tokenObj,(err)=>{
                if(!err){
                    callback(200,{
                        message:"sucessfull"
                    })

                }else{
                    callback(500,{
                        error:"server side error"
                    })
                }
            })

        }else{
            callback(400,{
                message:"Token Time is Over"
            })
        }
      })

    }else{
        callback(400,{
            message:"There is a Problem in your Request"
        })
    }
};

handler._token.delete = (requestProperties, callback) => {
    const id= typeof(requestProperties.queryStringObject.id)==='string'&&requestProperties.queryStringObject.id.trim().length ===20?requestProperties.queryStringObject.id:false;
    if(id){
       data.read('token',id,(err,tokenData)=>{
    if(!err && tokenData){
        data.delete('token',id,(err)=>{
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
    }
    else{
        callback(400,{
            message:"Invalid phone nubmber "
        })
    }
};
//token varify
handler._token.varify =(id,phone,callback)=>{
    data.read('token',id,(err,tokenData)=>{
        if(!err && tokenData){
            if(parsejson(tokenData).phone ===phone && parsejson(tokenData).expairs>Date.now()){
                callback(true)
            }else{
                callback(false)
            }

        }else{
            callback(false)
        }
    })
}
module.exports = handler;
