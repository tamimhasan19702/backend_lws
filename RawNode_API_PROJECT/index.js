/**
 * Title: Uptime monitoring system Api
 * Description: A Restful Api for to monitor up and down time of user defined links
 * Author: Tareq Monower
 * Date: 24/5/2023
 * *this is the primary file for this Api
 * !this is an complete Raw Node Project. there's no framework being used
 */

//todo: dependencies
//dependencies
const http = require('http');

//app object for module scaffholding
const app = {}

//configuration
app.config = {}

//create server
app.createServer = () => {
    const server = http.createServer(handleReqRes);
}

//handle server request/response
app.handleReqRes = (req,res) => {
    //response handle
    res.end('Hello world')
}