/*
 * Title: Uptime Monitoring Application
 * Description: A RESTFul API to monitor up or down time of user defined links
 * Author: Muhammad Masum Billah
 * Date: 2023
 *
 */
// dependencies
const http = require('http');
const { handleReqRes } = require('./helpers/heqresHendle');
const environment = require('./helpers/environment');
const {sendTwilioSms}= require('./helpers/nitification')
// const data = require('./lib/Data');

// app object - module scaffolding
const app = {};
sendTwilioSms('01834081364', 'Hello world!', (err) => {
    if (err) {
        console.log('Error:', err);
    } else {
        console.log('SMS sent successfully!');
    }
});


// create server
// testing file system
// data.delete('text', 'newFile', (err) => {
//     console.log(err);
// });
app.createServer = () => {
    const server = http.createServer(app.handleReqRes);
    server.listen(environment.port, () => {
        
        console.log(`listening to port ${environment.port}`);
    });
};

// handle Request Response
app.handleReqRes = handleReqRes;

// start the server
app.createServer();
