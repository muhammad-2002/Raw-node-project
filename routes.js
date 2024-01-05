/*
 * Title: Routes
 * Description: Application Routes
 * Author: Muhammad Masum Billah
 * Date: 2023
 *
 */

// dependencies
const { sampleHandler } = require('./hendalers/samplehendalers/sampleHandle');
const { userHandler } = require('./hendalers/samplehendalers/userHandler');
const { tokenHandler } = require('./hendalers/samplehendalers/tokenHandler');
const {checkHandler}= require('./hendalers/samplehendalers/checkHendler')


const routes = {
    sample: sampleHandler,
    user: userHandler,
    token: tokenHandler,
    check:checkHandler,
};

module.exports = routes;
