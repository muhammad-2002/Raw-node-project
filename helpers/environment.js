/*
 * Title: Environment creatin
 * Description: staging and production environment
 * Author: Muhammad Masum Billah
 * Date: 2023
 *
 */
// module scaffholding
const environments = {};
// stage of environment
environments.staging = {
    port: 3000,
    envName: 'staging',
    secretKey: 'thfalafkfj',
    maxChecks: 5,
    twilio:{
        fromPhone:"+12013808910",
        accountSid:"AC4935474e6a704307087d20030c80d9ef",
        authToken:"f01b4e1074f6d16ed0983e44fdb4a186"
    }
};
environments.production = {
    port: 4000,
    envName: 'production',
    secretKey: 'amajgapeo',
    maxChecks: 5,
    twilio:{
        fromPhone:"+12013808910",
        accountSid:"AC4935474e6a704307087d20030c80d9ef",
        authToken:"f01b4e1074f6d16ed0983e44fdb4a186"
    }
};
// detirmine who environment was pased
const currentEnvironment =
    typeof process.env.NODE_ENV === 'string' ? process.env.NODE_ENV : 'staging';

// export environment
const exportToEnvironment =
    typeof environments[currentEnvironment] === 'object'
        ? environments[currentEnvironment]
        : environments.staging;
module.exports = exportToEnvironment;
