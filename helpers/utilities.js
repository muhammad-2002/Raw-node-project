/*
 * Title:utilites
 * Description: utilites
 * Author: Muhammad Masum Billah
 * Date: 2023
 *
 */
// module scaffolding
const crypto = require('crypto');
const environments = require('./environment');

const utilities = {};


// parse JSON string to Object
utilities.parsejson = (jsonString) => {
    let output;

    try {
        output = JSON.parse(jsonString);
    } catch {
        output = {};
    }

    return output;
};

// hash string
utilities.hash = (str) => {
    if (typeof str === 'string' && str.length > 0) {
        console.log(environments, process.env.NODE_ENV);
        const hash = crypto.createHmac('sha256', environments.secretKey).update(str).digest('hex');
        return hash;
    }
    return false;
};

// hash string
utilities.createrandomString= (strlength) => {
    let length = strlength;
    length = typeof(strlength)=== 'number'&& strlength>0?strlength:false;
    if(length){
        const posiballchar= "abcdefghijklmnopqrstuvwxyz123456789";
        let output=''
        for(let i=1;i<=length;i++){
            let randomcharecter= posiballchar.charAt(Math.floor(Math.random()*posiballchar.length))
            output+=randomcharecter;

        }
        return output;
    }else{
        return false
    }
};

module.exports = utilities;
